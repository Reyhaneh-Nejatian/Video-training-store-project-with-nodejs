const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./../models/User');

// تعریف یک استراتژی احراز هویت با استفاده از Google OAuth
passport.use(new googleStrategy({
    clientID: config.service.GOOGLE.CLIENT_ID,         // شناسه مشتری (Client ID) از تنظیمات سرویس Google
    clientSecret: config.service.GOOGLE.CLIENT_SECRET, // کلید مخفی مشتری (Client Secret) از تنظیمات سرویس Google
    callbackURL: config.service.GOOGLE.callback_URL    // URL بازخورد برای برگشت از فرآیند احراز هویت در Google
}, function (token, refreshToken, profile, done) {  // تابع callback برای پردازش نتیجه احراز هویت

    // جستجوی کاربر با استفاده از ایمیل ارائه شده توسط Google
    User.findOne({ 'email': profile.emails[0].value }, (err, user) => {
        if (err) return done(err);  // در صورت بروز خطا، ارسال آن به Passport
        if (user) return done(null, user);  // اگر کاربر یافت شود، احراز هویت با موفقیت انجام می‌شود

        // اگر کاربر یافت نشود، یک حساب کاربری جدید ایجاد می‌شود
        const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id  // برای راحتی، از شناسه Google به عنوان رمز عبور استفاده شده است (توجه: این روش امن نیست)
        });

        // ذخیره کاربر جدید
        newUser.save(err => {
            if (err) console.log(err);  // در صورت خطا در هنگام ذخیره، نمایش خطا در کنسول
            done(null, newUser);  // احراز هویت با موفقیت انجام می‌شود
        });
    });
}));

// صادر کردن Passport برای استفاده در سایر قسمت‌های برنامه
module.exports = passport;
