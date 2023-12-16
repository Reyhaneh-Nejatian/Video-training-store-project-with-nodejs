const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const uniqueString = require('unique-string') // برای ایجاد یک توکن
const { v4: uuidv4 } = require('uuid');  // برای ایجاد یک توکن



const User = mongoose.Schema({
    admin : { type : Boolean, default : false},
    name : { type : String, require : true},
    email : { type : String, require : true},
    password : { type : String, require : true},
    rememberToken : { type : String, default : ''}
},{
    timestamps : true,
    toJSON : { virtuals : true }
})

// Middleware برای رویداد 'save' در مدل User
User.pre('save', function(next){
    const salt = bcrypt.genSaltSync(15);   // ایجاد نمونه از salt با استفاده از تابع genSaltSync با مقدار 15

    const hash = bcrypt.hashSync(this.password, salt);  // هش کردن رمز عبور با استفاده از نمک ساخته شده
    this.password = hash;   // جایگزین کردن رمز عبور اصلی با رمز عبور هش شده
    next();   // ادامه اجرای middleware ها یا عملیات ذخیره
})

User.pre('findOneAndUpdate', function(next) {
    const salt = bcrypt.genSaltSync(15);

    const hash = bcrypt.hashSync(this.getUpdate().$set.password, salt);  // هش کردن رمز عبور از شیء به‌روزرسانی با استفاده از نمک تولید شده

    this.getUpdate().$set.password = hash;    // به‌روزرسانی رمز عبور در شیء به‌روزرسانی با رمز عبور هش شده
    next(); 
});



// // اضافه کردن یک متد به مدل User برای مقایسه رمز عبور
User.methods.comparePassword = function(password){
    
    return bcrypt.compareSync(password, this.password);  // مقایسه رمز عبور وارد شده با رمز عبور هش شده در دیتابیس
}


User.methods.setRememberToken = async function(res){
    try {
        const token = uuidv4(); 
        res.cookie('remember_token' , token , {maxAge : 1000 * 60 * 60 * 24 * 6 , httpOnly : true, signed : true});
        await this.updateOne({rememberToken : token});  // اینجا توکن رو ذخیره می کنیم
    } catch (err) {
        console.error(err);
    }
}



//ریلیشن شیپ با جدول کورس
User.virtual('courses',{
    ref : 'Course',
    localField : '_id',
    foreignField : 'user'
})



module.exports =  mongoose.model('User', User)