const controller = require('./../controller')
const Course = require('app/models/Course')
const fs = require('fs')
const fsPromises = require('fs').promises;
const path = require('path')
const sharp = require('sharp');
const { count } = require('console');
const faker = require('faker')



class courseController extends controller{

    async index(req, res, next){

        //faker
        // for(let i = 0; i < 30; i++){
        //     const addCourse = new Course({
        //         user : req.user._id,
        //         title : faker.name.title(),
        //         body : faker.lorem.text(),
        //         slug : faker.lorem.slug(),
        //         type : 'free',
        //         price : faker.commerce.price(),
        //         images : faker.image.imageUrl(),
        //         tags : faker.lorem.words()
        //     })

        //     addCourse.save();
        // }

        //صفحه بندی دستی
        // const perPage = 9;
        // const page = req.query.page || 1;

        // const courses = await Course.find({})
        // .skip((perPage * page) - perPage)
        // .limit(perPage)
        // .exec();

        // const count = await Course.countDocuments();

        // res.render('admin/course/index', {
        //     courses,
        //     page,
        //     pages: Math.ceil(count / perPage)

        // });

        const page = req.query.page || 1;
        const courses = await Course.paginate({}, {page, limit : 10, sort : { createAt : 1 }})
        res.render('admin/course/index', { courses })
    }

    create(req, res, next){
        res.render('admin/course/create', { messages: req.flash('errors')})
    }

    async store(req, res, next){
        let result = await this.validationForm(req);
        if(result){
            this.storeProcess(req, res, next)
        }else{
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return this.back(req, res)
        }
    }

    storeProcess(req, res, next){
        let images = this.resizeImage(req.file);
        let {title, body, type, price, tags} = req.body;
        const addCourse = new Course({
            user : req.user._id,
            title,
            slug : this.slug(title),
            images,
            body,
            type,
            price,
            tags,
        })

        addCourse.save()
        .then(() => {
            console.log('Course saved successfully');
            res.redirect('/admin/course');
        })
        .catch(err => {
            console.error(err);
            res.redirect('/admin/course/create'); // یا هر کار دیگری که نیاز دارید
        });

    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, '-')
    }

    getDirImage(dir){
        return dir.substring(8)
    }

    async edit(req, res, next){
        const course = await Course.findById(req.params.id);
        res.render('admin/course/edit', {messages: req.flash('errors'), course});
    }

    async update(req, res, next){
        let result = await this.validationForm(req);
        if(result){
            this.updateProcess(req, res, next)
        }else{
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return this.back(req, res)
        }
    }

    async updateProcess(req, res, next){

        const existingCourse = await Course.findById(req.params.id); //دریافت اطلاعات دوره قبلی برای دسترسی به تصاویر قبلی

        let imageUrl = {};
        if(req.file){  // اگر تصویر جدید بارگذاری شده 

            this.deletePreviousImages(existingCourse.images); //حذف تصاویر قبلی

            imageUrl.images = this.resizeImage(req.file); //تنظیم تصاویر جدید
        }
        delete req.body.images;
        await Course.findByIdAndUpdate(req.params.id, {$set : {...req.body, ...imageUrl}});
        
        res.redirect('/admin/course')
    }

    async destroy(req, res, next){
        let course = await Course.findById(req.params.id).populate('episodes').exec();
        if(! course){
            res.json('چنین دوره ای در سایت ثبت نشده است')
        }

        // await course.episodes.forEach(episode => episode.deleteOne());

        this.deletePreviousImages(course.images);  //حذف تصاویر

        await course.deleteOne();  //حذف دوره
        return res.redirect('/admin/course');
            
    }

    deletePreviousImages(images) {  // حذف تصاویر

        Object.values(images).forEach(image => {
            const imagePath = `./public${image}`;
            fs.unlinkSync(imagePath);
        });
    }

    resizeImage(image) {
        const imagePath = path.parse(image.path);  //استخراج اطلاعات مسیر تصویر
        
        let imageUrl = {};   // ایجاد یک شیء خالی برای ذخیره لینک‌های تصاویر
        
        imageUrl['original'] = this.getDirImage(`${image.destination}/${image.filename}`);  // تنظیم لینک تصویر اصلی با اندازه اصلی

        // تابع resize که یک اندازه را به عنوان ورودی می‌گیرد و لینک تصویر متناظر با آن اندازه را تنظیم می‌کند
        let resize = size => {
            
            const imageName = `${imagePath.name}-${size}${imagePath.ext}`;  // ایجاد نام تصویر جدید با افزودن اندازه به نام اصلی
            
            imageUrl[size] = this.getDirImage(`${image.destination}/${imageName}`);  // تنظیم لینک تصویر با اندازه جدید
            
            sharp(image.path).resize(size, null).toFile(`${image.destination}/${imageName}`);  // استفاده از کتابخانه sharp برای تغییر اندازه تصویر و ذخیره در مسیر جدید
        };

        [1080, 720, 480, 360].map(resize);

        return imageUrl;
    }
}


module.exports = new courseController();