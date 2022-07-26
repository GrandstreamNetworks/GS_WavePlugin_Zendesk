export default {
    dev: {
        '/api': {
            target: 'https://www.zohoapis.com.cn',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '',
            },
        },

        '/admin': {
            // target: 'https://www.zohoapis.com.cn',
            target: 'http://192.168.126.74',
            changeOrigin: true,
            pathRewrite: {
                '^/admin': '',
            },
        },

        '/tokenApi': {
            target: 'https://accounts.zoho.com.cn',
            changeOrigin: true,
            pathRewrite: {
                '^/tokenApi': '',
            },
        },
    },
};
