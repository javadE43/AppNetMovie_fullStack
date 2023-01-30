import { createRequire } from "module";
import { getValidFileToUpload } from "../helper/pathfilename.js";
const require = createRequire(import.meta.url);
const multer = require('multer');
const mkdir = require('mkdirp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdir('./public/uploads/imgages').then(made=>{
            cb(null, './public/uploads/imgages');
        })
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname )
    }
})
   
const upload = multer({ storage: storage });

export default  upload;

