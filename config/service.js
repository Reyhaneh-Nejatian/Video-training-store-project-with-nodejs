// require('dotenv').config();
module.exports = {
    RECAPTCHA : {
        SITE_KET : process.env.RECAPTCHA_SITEKEY,
        SECRET_KEY : process.env.RECAPTCHA_SECRETKEY,
        options : {
            hl : 'fa'
        }
    },
    GOOGLE : {
        CLIENT_ID : process.env.GOOGLE_CLIENTKEY,
        CLIENT_SECRET : process.env.GOOGLE_SECRETKEY,
        callback_URL : 'http://localhost:3000/auth/google/callback'
    },

    
}

console.log()