const {check} = require('express-validator')

class forgetPasswordValidator{
    handle(){
        return[
            check('email')
                .isEmail()
                .withMessage('ایمیل وارد شده معتبر نمی باشد')
        ]
    }
}

module.exports = new forgetPasswordValidator();