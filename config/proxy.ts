export default {
    dev: {
        '/aaa': {
            target: 'https://api.getbase.com/',
            changeOrigin: true,
            pathRewrite: {
                '^/aaa': '',
            },
        },
    },
};
