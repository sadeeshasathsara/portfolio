// controllers/countsController.js
import Counts from '../../models/Counts.js';
import Project from '../../models/Project.js';

export const getCounts = async (req, res) => {
    try {
        // Get or initialize the main counts document
        let main = await Counts.findOne();
        if (!main) {
            main = new Counts({
                portfolioVisitors: 0,
                projectClicks: 0,
                cvDownloads: 0
            });
            await main.save();
        }

        // Get the actual total projects count from Project model
        const totalProjects = await Project.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                portfolioVisitors: main.portfolioVisitors,
                projectClicks: main.projectClicks,
                cvDownloads: main.cvDownloads,
                totalProjects: totalProjects
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
