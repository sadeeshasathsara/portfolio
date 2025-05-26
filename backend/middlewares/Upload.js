import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Create multer config dynamically
 * @param {string} folder - destination folder
 * @param {RegExp} allowedTypes - allowed file extensions regex
 */
export const createUploadMiddleware = (folder, allowedTypes) => {
    // Ensure the folder exists
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true }); // Create folder and parent folders if necessary
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        }
    });

    const fileFilter = (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error("File type not allowed"));
        }
    };

    return multer({ storage, fileFilter });
};
