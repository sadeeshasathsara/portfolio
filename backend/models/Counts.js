import mongoose from 'mongoose';

const countsSchema = new mongoose.Schema({
    portfolioVisitors: {
        type: Number,
    },
    totalProjects: {
        type: Number,
    },
    projectClicks: {
        type: Number,
    },
    cvDownloads: {
        type: Number,
    }
})

const Counts = mongoose.model('Counts', countsSchema);
export default Counts;