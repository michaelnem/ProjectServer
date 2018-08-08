'use strict'

module.exports = {
    name: 'RESTful AppScore API',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: 'mongodb://checkerRW:RW@ds261128.mlab.com:61128/appscoredb',
    },
    firebase: {
        ServerKey: 'AAAA-FJK_xU:APA91bF6hIPRWVBMwKJsaUz4xPPce6vfe3xCOHH0hPym9Uvl8C-s0kfJc98Q-i6ZX25SHSFgtdKMP_bSbJv_0jlAOJJ01JJvB8Q7D3WezXH_GKGk3oRugaimbdfANykCuPQ7GD6GdTlA'
    }
}