const express = require('express')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const cookieParser = require('cookie-parser')
const { Cookie } = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const rememberLogin = require('app/http/middleware/rememberLogin')
const methodOverride = require('method-override')


const app = express()

module.exports = class Application {
    constructor(){
        this.configServerAndMongo();
        this.setConfig();
        this.setRouts();
    }

    configServerAndMongo(){ //ست کردن یک سری اطلاعات در هدر
        mongoose.connect(config.database.url)  // اتصال به پایگاه داده مونوگو دی بی
        .then(()=>{
            app.listen(3000) //ران کردن برنامه روی پورت 3000
        }).catch((err)=>{
            console.log(err)
        })
    }

    setConfig(){
        require('./passport/passport-local')
        require('./passport/passport-google')
        app.use(express.static(config.layout.PUBLIC_DIR))   // مسیر فایل های ویو

        app.set('view engine', config.layout.VIEW_ENGINE)
        app.set('views', config.layout.VIRW_DIR);

        app.use(config.layout.EJS.expressLayouts)  // کانفیگ پکیج
        app.set('layout', config.layout.EJS.master)
        app.set('layout extractScripts', config.layout.EJS.extractScripts) //نمایش درست سکشن اسکریپت ها
        app.set('layout extractStyles', config.layout.EJS.extractStyles) //نمایش درست سکشن استایل ها

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}))  // کانفیگ برای گرفتن اطلاعات از فرم

        // app.use(express.urlencoded({extended: false})); // با اکسپرس هم می توان اطلاعات از فرم را گرفت

        app.use(session({ ...config.session }))

        app.use(cookieParser('secretId'));

        app.use(flash())
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(rememberLogin.handle);  //این میدلور رو ر.ی همه روت ها اجرا میکند

        app.use((req, res, next)=>{   // از ویژگی اپ لوکالز در اکسپرس برای چک کردن لاگین کاربر در ویو ها
            app.locals ={
                auth :{
                    check : req.isAuthenticated(),
                    user : req.user
                }
            }
            next();
        })

        app.use(methodOverride('_method'));
    }

    setRouts(){
        app.use(require('./routes/web'))
    }

    
}