import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        styleImport({
            libs: [
                {
                    libraryName: 'ant-design-vue',
                    esModule: true,
                    resolveStyle: (name) => {
                        return `ant-design-vue/es/${name}/style/index`
                    }
                }
            ]
        }),

    ],
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: { // 更改主题在这里
                    'primary-color': '#52c41a',
                    'link-color': '#1DA57A',
                    'border-radius-base': '2px'
                },
                javascriptEnabled: true
            }
        }
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        }
    }
})
