const express = require('express');
const passport = require('passport');
const controller = require('./../controller');

class loginController extends controller {
    
    // نمایش فرم ثبت نام
    showForm(req, res) {
        // اگر Recaptcha تنظیم نشده است، تنظیم شود
        if (!this.recaptcha) {
            this.setRecaptcha();
        }
        // Render فرم با اطلاعات خطاها و Recaptcha
        res.render('home/auth/login', { messages: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }

    // پردازش ثبت نام
    async loginProcess(req, res, next) {
        // اعتبارسنجی Recaptcha و ذخیره نتیجه
        await this.validationRecaptcha(req, res)
            const result = await this.validationForm(req);
            if(result){
                // اگر اعتبارسنجی داده‌ها موفقیت‌آمیز بود، ثبت نام انجام می‌شود
                this.login(req, res, next);
            }else{
                res.redirect('/auth/login')
            }
            
    }

    // انجام عملیات ثبت نام با استفاده از Passport
    async login(req, res, next) {
        passport.authenticate('local.login', (err, user)=> {
            if(!user) return res.redirect('/auth/login')
            req.login(user, err =>{
                if(err) console.log(err)
                if(req.body.remember){
                    user.setRememberToken(res)  // برات ذخیره یک توکن برای یاداوری رمز 
                }
                return res.redirect('/')
            })
        })(req, res, next);
    }
    


}



module.exports = new loginController();
