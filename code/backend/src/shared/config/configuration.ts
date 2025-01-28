export default () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        uri: process.env.MONGO_URI,
    },
    smsProvider: {
        name: process.env.SMS_PROVIDER || 'sinch',
        credentials: {
            applicationKey: process.env.SINCH_APP_KEY,
            applicationSecret: process.env.SINCH_APP_SECRET,
        }
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
    redis: {
        host: process.env.REDIS_HOST,
    },
    logging: {
        logLevel: process.env.LOG_LEVEL,
    },
});