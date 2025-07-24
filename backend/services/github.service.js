import axios from 'axios';
import Project from '../models/Project.js'; // adjust the path as needed

/**
 * Helper: fetch README content for a repo and extract image/gif URL (or '')
 */
const getReadmeImageUrl = async (owner, repo, githubToken) => {
    try {
        // Get repo info for default branch
        const repoInfo = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
            },
        });

        const defaultBranch = repoInfo.data.default_branch || 'main';

        // Fetch raw README markdown
        const res = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: "application/vnd.github.v3.raw",
                },
            }
        );

        const markdown = res.data;
        if (!markdown || typeof markdown !== 'string') {
            console.warn(`⚠️ [${owner}/${repo}] Empty or invalid README content`);
            return '';
        }

        // Extract image URLs
        const urls = [];
        const imageRegexMarkdown = /!\[[^\]]*\]\((.*?)\)/g;
        const imageRegexHTML = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;

        let match;

        // Markdown images
        while ((match = imageRegexMarkdown.exec(markdown)) !== null) {
            urls.push(match[1]);
        }

        // HTML <img> tags
        while ((match = imageRegexHTML.exec(markdown)) !== null) {
            urls.push(match[1]);
        }

        if (urls.length === 0) {
            return '';
        }

        return urls;
    } catch (error) {

        return '';
    }
};
/**
 * Fetches public GitHub repositories and saves them to MongoDB
 */
export const fetchPublicGitHubRepos = async () => {
    try {
        const response = await axios.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_SECRET}`,
                Accept: "application/vnd.github+json",
            },
            params: {
                visibility: "public",
                per_page: 100,
            },
        });


        if (!Array.isArray(response.data)) {
            console.error("❌ Unexpected GitHub API response:", response.data);
            return;
        }

        for (const repo of response.data) {
            const image = await getReadmeImageUrl(repo.owner.login, repo.name, process.env.GITHUB_SECRET);

            const projectData = {
                title: repo.name || "Untitled",
                description: repo.description || "No description provided.",
                image: image[0] || '',
                githubUrl: repo.html_url || '',
                liveUrl: '',
                tools: repo.language ? [repo.language] : [],
                tags: [],
            };



            await Project.findOneAndUpdate(
                { githubUrl: repo.html_url },
                projectData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        console.log('✅ GitHub projects synced to database.');
    } catch (error) {
        console.error("❌ GitHub sync failed:", error.response?.data || error.message);
    }
};
