import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';

import ApiRoutes from "./routes/ApiRoutes.js"
import { enrichRequest } from "./middlewares/EnrichRequest.js"
import { fetchPublicGitHubRepos } from "./services/github.service.js"


const app = express()

app.set('trust proxy', true);


// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(enrichRequest);


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions))


// API Routes
app.use("/api", ApiRoutes)
app.use('/up/image', express.static('src/profilePics'));
app.use('/up/cv', express.static('src/CVs'));
app.use('/up/project', express.static('src/projectPics'));

app.use("/", async (req, res) => {
    return res.status(200).json({ message: "Server is live" });
})

const runGitHubSync = async () => {
    try {
        const repos = await fetchPublicGitHubRepos();
        console.log(`GitHub sync: repos fetched`);
    } catch (err) {
        console.error('GitHub sync failed:', err.message);
    }
};

// Run once on startup
runGitHubSync();
// Run every 24 hours
setInterval(runGitHubSync, 24 * 60 * 60 * 1000);

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
