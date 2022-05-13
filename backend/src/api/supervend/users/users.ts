import express, { Request, Response } from "express"
import { getPool, handleQueryError } from "../../../util/db/postgres"
import { authenticate, checkName, genSaltedHash } from "../auth"
import { QueryResult } from "pg"
import User from "../types/user"

const userRouter = express.Router()
const pool = getPool("supervend")

userRouter.get("/:name",
    authenticate,
    checkName,
    async (req, res): Promise<void> => {
        try {
            const result = await pool.query(
                "SELECT name, wallet FROM users WHERE name=$1",
                [req.params.name]
            )
            if (result.rows.length < 1) {
                res.status(404).send("User not found")
                return
            }
            res.json(new User(
                result.rows[0].name,
                result.rows[0].wallet
            ))
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

userRouter.post("/:name",
    async (req, res): Promise<void> => {
        const name = req.params.name || ""
        const password = String(req.body.password || "")
        if (name.length > 30 || name == "" || password == "") {
            res.status(400).send("Invalid parameters")
            return
        }
        let result: QueryResult
        try {
            result = await pool.query(
                "SELECT name FROM users WHERE name=$1",
                [name]
            )
        } catch (err) {
            return handleQueryError(err, res)
        }
        if (result.rowCount > 0) {
            res.status(400).send("User already exists")
            return
        }
        const passwordSaltedHash = await genSaltedHash(password)
        let insertionResult: QueryResult
        try {
            insertionResult = await pool.query(
                "INSERT INTO users VALUES ($1, $2) RETURNING name, wallet",
                [name, passwordSaltedHash]
            )
        } catch (err) {
            return handleQueryError(err, res)
        }
        if (insertionResult.rows.length < 1) {
            res.status(400).send("User already exists")
            return
        }
        res.json(new User(
            insertionResult.rows[0].name,
            insertionResult.rows[0].wallet
        ))
    }
)

userRouter.delete("/:name",
    authenticate,
    checkName,
    async (req, res): Promise<void> => {
        try {
            const result = await pool.query(
                "DELETE FROM users WHERE name=$1",
                [req.params.name]
            )
            if (result.rowCount < 1) {
                res.status(404).send("User not found")
                return
            }
            res.sendStatus(204)
        } catch (err) {
            handleQueryError(err, res)
        }
    }
)

userRouter.patch("/:name",
    authenticate,
    checkName,
    async (req, res): Promise<void> => {
        const password = String(req.body.password || "")
        const deposit = parseInt(req.body.deposit || 0, 10)
        if (isNaN(deposit) || deposit < 0) {
            res.status(400).send("Invalid parameters")
            return
        }

        if (password !== "" && res.locals.password !== password) {
            // modify password
            await modifyPassword(password, req, res)
            if (res.writableEnded) return
        }

        if (deposit !== 0) {
            // add value
            await depositMoney(deposit, req, res)
            if (res.writableEnded) return
        }

        let result: QueryResult
        try {
            result = await pool.query(
                "SELECT name, wallet FROM users WHERE name = $1",
                [req.params.name]
            )
        } catch (err) {
            return handleQueryError(err, res)
        }
        if (result.rows.length < 1) {
            res.status(404).send("User not found")
            return
        }
        res.json(new User(
            result.rows[0].name,
            result.rows[0].wallet
        ))
    }
)

async function modifyPassword(password: string, req: Request, res: Response): Promise<void> {
    const passwordSaltedHash = await genSaltedHash(password)
    let updateResult: QueryResult
    try {
        updateResult = await pool.query(
            "UPDATE users SET hash = $2 WHERE name = $1",
            [req.params.name, passwordSaltedHash]
        )
    } catch (err) {
        return handleQueryError(err, res)
    }
    if (updateResult.rowCount < 1) {
        res.status(404).send("User not found")
    }
}

async function depositMoney(amount: number, req: Request, res: Response): Promise<void> {
    let updateResult: QueryResult
    try {
        updateResult = await pool.query(
            "UPDATE users SET wallet = wallet + $2 WHERE name = $1",
            [req.params.name, amount]
        )
    } catch (err) {
        return handleQueryError(err, res)
    }
    if (updateResult.rowCount < 1) {
        res.status(404).send("User not found")
    }
}

userRouter.post("/:name/buy",
    authenticate,
    checkName,
    async (req, res): Promise<void> => {
        const data = req.body || {}

        if (!Array.isArray(data)) {
            res.status(400).send("Invalid parameters")
            return
        }

        console.log(JSON.stringify(data))
        console.log("valid")

        // sum up totals
        const [total, orders] = await sumOrder(data, req, res) || [0, []]
        if (res.writableEnded) return

        console.log("summed")

        // update wallet
        const balance = await updateWallet(total, req, res) || 0
        if (res.writableEnded) return

        console.log("wallet updated")

        // update products
        await updateStock(orders, res)
        if (res.writableEnded) return

        res.json({
            "total": total,
            "balance": balance,
            "order": data
        })
    }
)

async function sumOrder(
    data: { quantity: unknown, product_id: unknown }[],
    _req: Request, res: Response
): Promise<void | [number, Array<[number, string]>]> {
    let total = 0
    const orders: Array<[number, string]> = []

    for (const order of data) {
        const quantity = parseInt(String(order.quantity) || "-1", 10)
        const productId = String(order.product_id || "")
        if (isNaN(quantity) || quantity < 0 || productId === "") {
            res.status(400).send("Invalid parameters")
            return
        }
        orders.push([quantity, productId])
        let productResult: QueryResult
        try {
            productResult = await pool.query(
                "SELECT price, stock FROM products WHERE product_id = $1",
                [productId]
            )
        } catch (err) {
            handleQueryError(err, res)
            return
        }
        if (productResult.rows.length < 1) {
            res.status(404).send("Product not found")
            return
        }
        const {price, stock} = productResult.rows[0]
        if (stock < quantity) {
            res.status(400).send("Not enough stock")
            return
        }
        total += price * quantity
    }

    return [total, orders]
}

async function updateWallet(total: number, req: Request, res: Response): Promise<void | number> {
    let walletResult: QueryResult
    try {
        walletResult = await pool.query(
            "SELECT wallet FROM users WHERE name = $1",
            [req.params.name]
        )
    } catch (err) {
        return handleQueryError(err, res)
    }
    if (walletResult.rows.length < 1) {
        res.status(404).send("User not found")
        return
    }
    const wallet = parseInt(walletResult.rows[0].wallet || 0, 10)
    if (isNaN(wallet) || total > wallet) {
        res.status(400).send("Not enough money")
        return
    }
    let updateResult: QueryResult
    try {
        updateResult = await pool.query(
            "UPDATE users SET wallet = wallet - $1 WHERE name = $2 RETURNING wallet",
            [total, req.params.name]
        )
    } catch (err) {
        return handleQueryError(err, res)
    }
    if (updateResult.rows.length < 1) {
        res.status(404).send("User not found")
        return
    }
    const balance = parseInt(updateResult.rows[0].wallet || 0, 10)
    if (isNaN(balance)) {
        res.sendStatus(500)
    }
}

async function updateStock(orders: Array<[number, string]>, res: Response): Promise<void> {
    for (const [quantity, productId] of orders) {
        try {
            const result = await pool.query(
                "UPDATE products SET stock = stock - $1 WHERE product_id = $2",
                [quantity, productId]
            )
            if (result.rowCount < 1) {
                res.status(404).send("Product not found")
                return
            }
        } catch (err) {
            return handleQueryError(err, res)
        }
    }
}

export { userRouter }