const {check} = require('express-validator')

class registerValidator{
    handle(){
        return[
            check('name')
                .isLength({min : 5})
                .withMessage('نام کاربری خود را وارد نمایید'),
            
            check('email')
                .isEmail()
                .withMessage('ایمیل وارد شده معتبر نمی باشد'),

            check('password')
                .isLength({min : 6})
                .withMessage('رمز عبور وارد شده کمتر از 6  کاراکتر می باشد'),
        ]
    }
}

module.exports = new registerValidator();