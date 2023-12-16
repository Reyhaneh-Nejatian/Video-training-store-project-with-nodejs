const controller = require('app/http/controllers/controller')
const User = require('app/models/User')
const passwordReset = require('app/models/Password-reset')
const { v4: uuidv4 } = require('uuid'); 

class forgetPasswordController extends controller {

    showForm(req, res, next) {
        res.render('home/auth/password/reset', { messages: req.flash('errors'), success: req.flash('success'), recaptcha: this.recaptcha.render() })
    }

    async passwordResetLink(req, res, next){
        await this.validationRecaptcha(req, res);
        const result = await this.validationForm(req);
        if(result){
            this.resetLinkProcess(req, res, next)
        }else{
            return this.back(req, res)
        }
    }

    async resetLinkProcess(req, res, next){
        let user = await User.findOne({email : req.body.email});
        if(!user){
            req.flash('errors', 'کاربری بااین ایمیل در سایت ثبت نام نکرده است')
            return this.back(req, res)
        }

        const setPassword = new passwordReset({
            email : req.body.email,
            token : uuidv4()
        })

        await setPassword.save();

        //send email

        req.flash('success','لینک تغییر رمز عبور به ایمیل وارد شده ارسال شد')
        res.redirect('/auth/password/reset')
    }

}


module.exports = new forgetPasswordController();