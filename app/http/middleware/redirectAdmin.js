const middleware = require('./middleware')

class redirectAdmin extends middleware{

    handle(req, res, next){
        if(req.isAuthenticated() && req.user.admin){  // اگر کاربر لاگین کرده بود و فیلد ادمین ترو بود
            next();
        }else{
            res.redirect('/')
        }
    }
}


module.exports = new redirectAdmin();