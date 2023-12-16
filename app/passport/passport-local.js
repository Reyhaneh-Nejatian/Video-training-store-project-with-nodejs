const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./../models/User');

// تنظیم استراتژی Passport برای ثبت نام
passport.use('local.register', new localStrategy({
    usernameField: 'email',         // نام فیلد مربوط به ایمیل در فرم ورود
    passwordField: 'password',      // نام فیلد مربوط به رمز عبور در فرم ورود
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        // یافتن کاربر با ایمیل ارائه شده در دیتابیس
        const user = await User.findOne({ 'email': email });

        if (user) {
            // اگر کاربر با این ایمیل قبلا ثبت نام کرده باشد
            return done(null, false, req.flash('errors', 'این اطلاعات قبلا در سیستم ثبت شده است'));
        }

        // ایجاد یک کاربر جدید
        const addUser = new User({
            name: req.body.name,
            email,
            password
        });

        // ذخیره کاربر در دیتابیس
        await addUser.save();

        // احراز هویت با موفقیت
        done(null, addUser);
    } catch (err) {
        // در صورت بروز خطا در هنگام ذخیره در دیتابیس
        done(err, false, req.flash('errors', 'امکان ذخیره اطلاعات وجود ندارد'));
    }
}));

// کانفیگ سریالایزر Passport برای ساخت session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// کانفیگ دیسریالایزر Passport برای بازگرداندن اطلاعات کاربر از session
passport.deserializeUser(async (id, done) => {
    try {
        // یافتن کاربر با استفاده از شناسه
        const user = await User.findById(id);

        // انجام کالبک
        done(null, user);
    } catch (err) {
        // در صورت بروز خطا در هنگام جستجو در دیتابیس
        done(err, null);
    }
});




// تعریف یک استراتژی محلی (local) به منظور احراز هویت کاربران
passport.use('local.login', new localStrategy({
    usernameField: 'email',          // فیلد مربوط به نام کاربری در فرم ورود
    passwordField: 'password',       // فیلد مربوط به رمز عبور در فرم ورود
    passReqToCallback: true          // امکان ارسال درخواست اصلی به تابع بازخوانی (callback)
}, async (req, email, password, done) => {
    try {
        // جستجوی کاربر بر اساس ایمیل
        const user = await User.findOne({ 'email': email });

        // اگر کاربر یافت نشده یا رمز عبور مطابقت نداشته باشد
        if (!user || !user.comparePassword(password)) {
            return done(null, false, req.flash('errors', 'نام کاربری یا رمز عبور اشتباه است.'));
        }

        // اگر کاربر یافت شود و رمز عبور صحیح باشد، احراز هویت موفق
        return done(null, user);
    } catch (err) {
        // در صورت بروز خطا در هنگام اجرای کد، ارسال پیام خطا به کاربر
        return done(err, false, req.flash('errors', 'مشکلی در هنگام ورود به حساب کاربری رخ داده است.'));
    }
}));





// Export Passport برای استفاده در سایر قسمت‌های برنامه
module.exports = passport;
