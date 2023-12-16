const controller = require('app/http/controllers/controller')
const User = require('app/models/User')
const passwordReset = require('app/models/Password-reset')
const { v4: uuidv4 } = require('uuid'); 

class restPasswordController extends controller {

    showForm(req, res, next) {
        const tokenFromURL = req.params.token;
        res.render('home/auth/password/email', { messages: req.flash('errors'), success: req.flash('success'), recaptcha: this.recaptcha.render(), token: tokenFromURL })
    }

    async resetPasswordProcess(req, res, next) {
        await this.validationRecaptcha(req, res);
        const result = await this.validationForm(req, res);
        if (result) {
            this.resetPassword(req, res, next);
        } else {
            this.redirect('/auth/password/reset');
        }
    }
    
    async resetPassword(req, res, next) {
        let passwordreset = await passwordReset.findOne({ $and: [{ email: req.body.email }, { token: req.body.token }] });
        if (!passwordreset) {
            req.flash('errors', 'اطلاعات وارد شده صحیح نمی باشد');
            return this.back(req, res);
        }
    
        if (passwordreset.use) {
            req.flash('errors', 'از این لینک قبلا برای تغییر پسورد استفاده شده است');
            return this.back(req, res);
        }
    
        let user = await User.findOneAndUpdate({ email: req.body.email }, { $set: { password: req.body.password } });
        if (!user) {
            req.flash('errors', 'کاربری با این مشخصات در سیستم وجود ندارد');
            return this.back(req, res);
        }
    
        await passwordreset.updateOne({ use : true });
        res.redirect('/auth/login');
    }
    

}


module.exports = new restPasswordController();