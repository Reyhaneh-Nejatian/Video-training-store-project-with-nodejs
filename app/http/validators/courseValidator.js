const {check} = require('express-validator')
const path = require('path');

class courseValidator{
    handle(){
        return[
            check('title')
                .isLength({min : 5})
                .withMessage('عنوان دوره نباید کمتر از 5 کاراکتر باشد'),
            
            check('body')
                .not().isEmpty()
                .withMessage('متن دوره نمی تواند خالی باشد'),

            check('type')
                .not().isEmpty()
                .withMessage('نوع دوره را وارد کنید'),

            check('images')
            .custom(async (value , { req }) => {

                if(req.query._method === 'PUT' && value === undefined) return;
                if(! value){
                    throw new Error('تصویر دوره را وارد کنید')
                }else {
                    const fileExe = ['.png', '.PNG', '.jpg', '.JPG', '.jepg' ,'.svg']
                    if( !fileExe.includes(path.extname(value))){
                        throw new Error('فایل انتخابی تصویر نمی باشد')
                    }
                }
            }),

            check('price')
                .not().isEmpty()
                .withMessage('هزینه دوره را وارد کنید'),

            check('tags')
                .not().isEmpty()
                .withMessage('تگ های دوره را وارد کنید'),
            
            
        ]
    }
}

module.exports = new courseValidator();