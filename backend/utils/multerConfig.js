import multer from "multer";

// Configure storage with a dynamic folder path for images
export const imageStorage = (folder) =>
  multer.diskStorage({
    destination: `./uploads/${folder}`,
    filename: (req, file, cb) => {
      const newFilename = file.originalname.replace(/\s+/g, "-");
      cb(null, newFilename);
    },
  });

// Configure multer
export const uploadImage = (folder) =>
  multer({
    storage: imageStorage(folder),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  });

// Configure storage with a dynamic folder path for videos
export const videoStorage = (folder) =>
  multer.diskStorage({
    destination: `./uploads/${folder}`,
    filename: (req, file, cb) => {
      const newFilename = file.originalname.replace(/\s+/g, "-");
      cb(null, newFilename);
    },
  });

// Configure multer
export const uploadVideo = (folder) =>
  multer({
    storage: videoStorage(folder),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "video/mp4" ||
        file.mimetype === "video/mpeg" ||
        file.mimetype === "video/ogg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .mp4, .mpeg, and .ogg format allowed!"));
      }
    },
  });
