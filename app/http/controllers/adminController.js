const controller = require('./controller')

class adminController extends controller{

    index(req, res, next){
        res.render('admin/index')
    }
}


module.exports = new adminController();