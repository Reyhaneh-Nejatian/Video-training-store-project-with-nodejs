const path = require('path')
const expressLayouts = require('express-ejs-layouts')


module.exports = {
    PUBLIC_DIR : 'public',
    VIEW_ENGINE : 'ejs',
    VIRW_DIR : path.resolve('./resource/views'),
    EJS : {
        expressLayouts,
        master : 'master',
        extractScripts : true,
        extractStyles : true
    }
}