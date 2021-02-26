const multer = require('multer');
const path = require('path');

const multerHelper = {};

const single_multi = multer({dest: path.resolve('./src/public/img/temp')}).single('multi_single');

multerHelper.single = (req,res,next) => {
    single_multi(req,res,function (err) {
        if(err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            // req.flash('error_msg','Se produjo un error al cargar ');
        } else if (err) {
            // An unknown error occurred when uploading.
            // req.flash('error_msg','Ocurrió un error desconocido al cargar ');
        }

        // Everything went fine.
        return next();
    });
}


//Exports
module.exports = multerHelper;