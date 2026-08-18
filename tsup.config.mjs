import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['src/index.ts', 'src/yup/index.ts', 'src/zod/index.ts'],
    format: ['esm', 'cjs'],
    splitting: true,
    sourcemap: true,
    clean: true,
    // Hier zwingen wir den DTS-Compiler, die Warnung zu ignorieren
    dts: {
        compilerOptions: {
            ignoreDeprecations: '6.0'
        }
    }
})