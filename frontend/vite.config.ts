import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import typescript from "@rollup/plugin-typescript"

/**
 * @template T
 * @param {{ default: T }} f
 * @see {@link https://github.com/rollup/plugins/issues/1541}
 */
const fix = (f) => /** @type {T} */ f

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        fix(typescript)({
            tsconfig: "./tsconfig.json",
            include: ["./src/**/*"],
        }),
    ],
})
