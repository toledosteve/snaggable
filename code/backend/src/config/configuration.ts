export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        uri: process.env.MONGO_URI,
    },
    smsProvider: process.env.SMS_PROVIDER || 'sinch',
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
    redis: {
        host: process.env.REDIS_HOST,
    }
});