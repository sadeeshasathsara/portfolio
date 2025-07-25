import axios from 'axios';
import Project from '../models/Project.js'; // adjust the path as needed

const getReadmeImageUrl = async (owner, repo, githubToken) => {
    try {
        const repoInfo = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: { Authorization: `Bearer ${githubToken}` },
        });

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

        const urls = [];
        const imageRegexMarkdown = /!\[[^\]]*\]\((.*?)\)/g;
        const imageRegexHTML = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;

        let match;
        while ((match = imageRegexMarkdown.exec(markdown)) !== null) urls.push(match[1]);
        while ((match = imageRegexHTML.exec(markdown)) !== null) urls.push(match[1]);

        return urls.length > 0 ? urls : '';
    } catch {
        return '';
    }
};

export const fetchPublicGitHubRepos = async () => {
    try {
        const githubToken = process.env.GITHUB_SECRET;
        const yourGitHubUsername = process.env.GITHUB_USERNAME;

        const response = await axios.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: `Bearer ${githubToken}`,
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
            if (repo.owner.login !== yourGitHubUsername) {
                console.log(`⏩ Skipping repo not owned by you: ${repo.full_name}`);
                continue;
            }

            const image = await getReadmeImageUrl(repo.owner.login, repo.name, githubToken);

            const existingProject = await Project.findOne({ githubUrl: repo.html_url });

            const projectData = {
                title: repo.name || "Untitled",
                description: repo.description || "No description provided.",
                githubUrl: repo.html_url || '',
                tools: repo.language ? [repo.language] : [],
            };

            // Preserve existing image if it exists and is not empty
            if (existingProject && existingProject.image && existingProject.image.trim() !== '') {
                projectData.image = existingProject.image;
            } else {
                projectData.image = image[0] || '';
            }

            if (existingProject) {
                projectData.tags = existingProject.tags || [];
                projectData.featured = existingProject.featured || false;
                projectData.liveUrl = existingProject.liveUrl || '';
                projectData.display = typeof existingProject.display !== 'undefined' ? existingProject.display : true;
            } else {
                projectData.tags = [];
                projectData.featured = false;
                projectData.liveUrl = '';
                projectData.display = true;
            }

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
