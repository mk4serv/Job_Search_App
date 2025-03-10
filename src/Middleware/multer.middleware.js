
import multer from 'multer'
import fs from 'fs'

// export const MulterLocal = (destinationPath = 'general', allowedMimeTypes = [])=>{

//     // ✅ Define the destination folder

//     const destinationFolder = `Assets/${destinationPath}`;
//     if(! fs.existsSync(destinationFolder)) {
//         fs.mkdirSync(destinationFolder, { recursive: true });
//     }

//     // ✅ Define the storage engine
//     const storage = multer.diskStorage({

//         // ✅ Define the destination for uploaded files
//         destination: (req, file, cb) => {
//             cb(null, destinationFolder);
//         },

//         // ✅ Define the filename for uploaded files
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             cb(null, uniqueSuffix + '__' + file.originalname);
//         }
//     })

//     // ✅ Define the file filter
//     const fileFilter = (req, file, cb) => {
//         if (allowedMimeTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type'), false);
//         }
//     }
//     const upload = multer({ storage, fileFilter })
//     return upload
// }

export const MulterCloud = ( allowedMimeTypes = [])=>{
    const storage = multer.diskStorage({})
    // ✅ Define the file filter
    const fileFilter = (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
    const upload = multer({ storage, fileFilter })
    return upload
}