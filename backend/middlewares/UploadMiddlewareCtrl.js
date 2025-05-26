import { createUploadMiddleware } from "./Upload.js";

export const uploadImage = createUploadMiddleware("src/profilePics", /\.(jpg|jpeg|png|gif)$/);
export const uploadCV = createUploadMiddleware("src/CVs", /\.pdf$/);