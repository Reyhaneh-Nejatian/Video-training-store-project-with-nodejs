// const autoBind = require('auto-bind');
const abind = require('abind');  // ماژولی برای خودکار بایند کردن متدهای یک شیء به شیء خود
const { validationResult } = require('express-validator');
const config = require('../../../config');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const sprintf = require('sprintf')

// ایجاد یک کلاس پایه برای کنترلرها
module.exports = class controller {
    
    constructor() {
        this.setRecaptcha();  // فراخوانی متد تنظیم Recaptcha در هنگام ایجاد یک نمونه از کلاس
        // autoBind(this);  // خودکار بایند کردن متدهای کلاس (غیرفعال شده در اینجا)
        abind(this);  // استفاده از ماژول abind برای خودکار بایند کردن متدها به شیء خود
    }

    // تنظیم Recaptcha برای استفاده در کنترلرها
    setRecaptcha() {
        this.recaptcha = new Recaptcha(config.service.RECAPTCHA.SITE_KET, config.service.RECAPTCHA.SECRET_KEY, { ...config.service.RECAPTCHA.options });
    }

    // اعتبارسنجی Recaptcha و بازگشت یک Promise
    async validationRecaptcha(req, res) {
        return new Promise((resolve, reject) => {
            this.recaptcha.verify(req, (err) => {
                if (err) {
                    // اگر گزینه امنیتی فعال نباشد، خطا را به فلش اضافه کرده و به روت ثبت نام ریدایرکت می‌شود
                    req.flash('errors', 'گزینه امنیتی فعال نمی باشد');
                    this.back(req, res);
                } else {
                    // اگر گزینه امنیتی فعال باشد، Promise با مقدار true حل می‌شود
                    resolve(true);
                }
            });
        });
    }

    async validationForm(req){
        const result = await validationResult(req)
        if (!result.isEmpty()) {
            // اگر اعتبارسنجی داده‌ها موفقیت‌آمیز نبود
            const errors = result.array();
            const messages = [];
            errors.forEach(err => messages.push(err.msg));
            // ارسال خطاها به فلش و Redirect به فرم ثبت نام
            req.flash('errors', messages);
            return false
        }else{
            return true
        }
    }

    back(req, res){
        return res.redirect(req.header('Referer') || '/');
    }


    getTime(episodes){
        let second = 0;
        episodes.forEach(episode =>{
            let time = episode.time.split(':');
            if(time.length === 2){
                second += parseInt(time[0]) * 60;
                second += parseInt(time[1]);
            }else if(time.length === 3){
                second += parseInt(time[0]) * 3600;
                second += parseInt(time[1]) * 60;
                second += parseInt(time[2]);
            }
        })

        let hour = Math.floor(second / 3600);
        let minute = Math.floor((second / 60) % 60);
        second = Math.floor(second % 60);

        return sprintf("%02d:%02d:%02d", hour, minute, second);
    }
};
