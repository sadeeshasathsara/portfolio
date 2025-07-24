// controllers/countsController.js
import Counts from "../../models/Counts.js";

const snapshotToHistory = (countsDoc) => {
    countsDoc.history.push({
        date: new Date(),
        portfolioVisitors: countsDoc.portfolioVisitors,
        totalProjects: countsDoc.totalProjects,
        projectClicks: countsDoc.projectClicks,
        cvDownloads: countsDoc.cvDownloads
    });

    // Optional: Keep only the last 100 snapshots
    if (countsDoc.history.length > 100) {
        countsDoc.history = countsDoc.history.slice(-100);
    }
};


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

export const increasePortfolioVisitors = async () => {
    try {
        const main = await getMainDocument();
        snapshotToHistory(main);
        main.portfolioVisitors += 1;
        await main.save();
        return true
    } catch (err) {
        return err
    }
};

export const increaseTotalProjects = async (req, res) => {
    try {
        const main = await getMainDocument();
        snapshotToHistory(main);
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
        snapshotToHistory(main);
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
        snapshotToHistory(main);
        main.cvDownloads += 1;
        await main.save();
        res.status(200).json({ success: true, cvDownloads: main.cvDownloads });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCountsWithInsights = async (req, res) => {
    try {
        const counts = await Counts.findOne();
        if (!counts) return res.status(404).json({ message: "Counts not found" });

        const now = new Date();

        const getSnapshot = (daysAgo) => {
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - daysAgo);
            return counts.history
                .filter(h => new Date(h.date) <= cutoff)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        };

        const current = {
            portfolioVisitors: counts.portfolioVisitors,
            projectClicks: counts.projectClicks,
            cvDownloads: counts.cvDownloads,
            totalProjects: counts.totalProjects
        };

        const periods = [
            { label: "day", days: 1 },
            { label: "week", days: 7 },
            { label: "month", days: 30 }
        ];

        const insights = {};

        for (const key of Object.keys(current)) {
            const deltas = periods.map(({ label, days }) => {
                const snapshot = getSnapshot(days) || { [key]: 0 };
                return {
                    label,
                    value: current[key] - (snapshot[key] || 0)
                };
            });

            // Choose the largest delta
            const bestDelta = deltas.reduce((prev, curr) =>
                Math.abs(curr.value) > Math.abs(prev.value) ? curr : prev
            );

            insights[key] = {
                value: current[key],
                change: bestDelta.value,
                period: bestDelta.label
            };
        }

        res.json({ stats: current, insights });
    } catch (error) {
        console.error("Error getting counts with insights:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
