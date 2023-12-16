const controller = require('app/http/controllers/controller');
class redirectAuthenticated extends controller{
    handle(req, res, next){
        if(req.isAuthenticated()) res.redirect('/')
        next();
    }
}


module.exports = new redirectAuthenticated(); 