const express = require('express');
const passport = require('passport');
const controller = require('./../controller');

class registerController extends controller {
    
    // نمایش فرم ثبت نام
    showForm(req, res) {
        // اگر Recaptcha تنظیم نشده است، تنظیم شود
        if (!this.recaptcha) {
            this.setRecaptcha();
        }
        // Render فرم با اطلاعات خطاها و Recaptcha
        res.render('home/auth/register', { messages: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }

    // پردازش ثبت نام
    async registerProcess(req, res, next) {
        // اعتبارسنجی Recaptcha و ذخیره نتیجه
        await this.validationRecaptcha(req, res, next)
            const result = await this.validationForm(req);
            if(result){
                // اگر اعتبارسنجی داده‌ها موفقیت‌آمیز بود، ثبت نام انجام می‌شود
                this.register(req, res, next);
            }else{
                res.redirect('/auth/register')
            }
            
    }

    // انجام عملیات ثبت نام با استفاده از Passport
    register(req, res, next) {
        passport.authenticate('local.register', {
            successRedirect: '/',
            failureRedirect: '/auth/register',
            failureFlash: true
        })(req, res, next);
    }
}

module.exports = new registerController();
