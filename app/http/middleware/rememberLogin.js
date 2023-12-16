const User = require('app/models/User');
const middleware = require('./middleware');


class rememberLogin extends middleware{

     // تعریف یک متد با نام handle که به عنوان middleware در استفاده می‌شود
     handle(req, res, next) {
        
        if (!req.isAuthenticated()) {   // بررسی اینکه آیا کاربر وارد شده است یا نه
            
            const rememberToken = req.signedCookies.remember_token;  // دریافت توکن مربوط به یادآوری ورود از کوکی‌های امضاشده
            
            if (rememberToken) return this.userFind(rememberToken, req, next);  // اگر توکن موجود باشد، تابع userFind فراخوانی می‌شود
        }
        next();
    }

    // تعریف تابع userFind برای جستجوی کاربر با توکن
    userFind(rememberToken, req, next) {
        
        User.findOne({ rememberToken })  // جستجوی کاربر بر اساس توکن در مدل User
            .then(user => {
                if (user) {
                    
                    req.login(user, err => {   // اگر کاربر یافت شده باشد، احراز هویت او انجام می‌شود
                        if (err) console.log(err);
                        next();
                    });
                } else {
                    next();
                }
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    }
}


module.exports = new rememberLogin();