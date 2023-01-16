// const multer = require("multer");


// const fileStorage = multer.diskStorage({
//   destination: "public/uploads",

//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.originalname
//     );
//   },
// });

// const editStorage = multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'public/uploads')
//   },
//   filename :(req,file,cb)=>{
//     cb(null,file.originalname)
//   }
// });

// module.exports ={
//   uploads:multer({storage: fileStorage}).single('file')
// }

// module.exports={
//     uploadImage : multer({
//         storage: fileStorage,
//         limits: {
//           fileSize: 100000000,
//         },
//         fileFilter(req, file, cb) {
//           if (!file.originalname.match(/\.(png|jpg)$/)) {
//             return cb(new Error("Please upload an Image file!"));
//           }
//           cb(undefined, true);
//         },
//       })

// } 


