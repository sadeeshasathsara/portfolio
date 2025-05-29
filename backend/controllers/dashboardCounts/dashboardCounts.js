// controllers/countsController.js
import Counts from "../../models/Counts.js";

// Helper function to get the main document or create it
const getMainDocument = async () => {
    let main = await Counts.findOne();
    if (!main) {
        main = new Counts({
            portfolioVisitors: 0,
            totalProjects: 0,
            projectClicks: 0,
            cvDownloads: 0,
        });
        await main.save();
    }
    return main;
};

export const increasePortfolioVisitors = async (req, res) => {
    try {
        const main = await getMainDocument();
        main.portfolioVisitors += 1;
        await main.save();
        res.status(200).json({ success: true, portfolioVisitors: main.portfolioVisitors });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const increaseTotalProjects = async (req, res) => {
    try {
        const main = await getMainDocument();
        main.totalProjects += 1;
        await main.save();
        res.status(200).json({ success: true, totalProjects: main.totalProjects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const increaseProjectClicks = async (req, res) => {
    try {
        const main = await getMainDocument();
        main.projectClicks += 1;
        await main.save();
        res.status(200).json({ success: true, projectClicks: main.projectClicks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const increaseCvDownloads = async (req, res) => {
    try {
        const main = await getMainDocument();
        main.cvDownloads += 1;
        await main.save();
        res.status(200).json({ success: true, cvDownloads: main.cvDownloads });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
