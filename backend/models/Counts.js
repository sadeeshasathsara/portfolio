import mongoose from 'mongoose';

const countsSchema = new mongoose.Schema({
    portfolioVisitors: Number,
    totalProjects: Number,
    projectClicks: Number,
    cvDownloads: Number,
    history: [
        {
            date: { type: Date, default: Date.now },
            portfolioVisitors: Number,
            totalProjects: Number,
            projectClicks: Number,
            cvDownloads: Number,
        }
    ]
});


const Counts = mongoose.model('Counts', countsSchema);
export default Counts;