import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var apiTarget = env.VITE_API_URL || 'http://127.0.0.1:3004';
    return {
        plugins: [react()],
        server: {
            proxy: {
                '/api': {
                    target: apiTarget,
                    changeOrigin: true,
                    secure: false,
                },
                '/uploads': {
                    target: apiTarget,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
