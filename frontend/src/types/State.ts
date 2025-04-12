import { Dispatch, SetStateAction } from "react"

type State<V> = [V, Dispatch<SetStateAction<V>>]

export default State
