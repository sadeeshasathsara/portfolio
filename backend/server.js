import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';

import ApiRoutes from "./routes/ApiRoutes.js"
import { enrichRequest } from "./middlewares/EnrichRequest.js"


const app = express()

app.set('trust proxy', true);


// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(enrichRequest);


const corsOptions = {
    origin: "https://sathsara-k.onrender.com",
    credentials: true,
};
app.use(cors(corsOptions))


// API Routes
app.use("/api", ApiRoutes)
app.use('/up/image', express.static('src/profilePics'));
app.use('/up/cv', express.static('src/CVs'));
app.use('/up/project', express.static('src/projectPics'));

// MongoDB connection
if (!process.env.MONGODB_URI) {
    console.log("MongoDB URI not found in environment variables")
} else {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to MongoDB")

            const port = process.env.PORT || 5000;
            app.listen(port, '0.0.0.0', () => {
                console.log(`Server is running on port ${port}`)
            })
        })
        .catch((error) => {
            console.log("Error connecting to MongoDB")
            console.error(error)
        })
}
