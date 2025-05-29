import axios from 'axios';
import { BACKEND_URL } from './Tools';

const API_URL = `${BACKEND_URL}/api/activity/log`;

// Base function
const logActivity = (type, action, details) => {
    axios.post(API_URL, { type, action, details })
        .then(response => {

        })
        .catch(error => {
            console.error(`Error logging ${type}:`, error.response?.data || error.message);
        });
};

// VISIT
export const createVisit = () => {
    axios.post(`${BACKEND_URL}/api/activity/visit`)
        .then(response => {
            axios.post(`${BACKEND_URL}/api/portfolio-visitors`)
                .then(() => {
                })
                .catch(error => {
                    console.error('Error updating portfolio visitor count:', error.response?.data || error.message);
                });
        })
        .catch(error => {
            console.error('Error logging visit:', error.response?.data || error.message);
        });
};

// DOWNLOAD
export const logDownload = (fileName) => {
    logActivity('download', 'Downloaded CV', fileName);
    axios.post(`${BACKEND_URL}/api/cv-downloads`)
        .then(() => {
        })
        .catch(error => {
            console.error('Error updating CV download count:', error.response?.data || error.message);
        });
};

// PROJECT CLICK
export const logProjectClick = (projectName) => {
    logActivity('project_click', `Clicked on ${projectName}`, `Project view - ${projectName}`);
    axios.post(`${BACKEND_URL}/api/project-clicks`)
        .then(() => {
        })
        .catch(error => {
            console.error('Error updating project click count:', error.response?.data || error.message);
        });
};

// EMAIL
export const logEmail = (emailAddress) => {
    logActivity('email', 'Sent email via contact form', `Mail: ${emailAddress}`);
};

// LOGIN
export const logLogin = () => {
    logActivity('login', 'Logged in', 'Admin dashboard access');
};

export const logTriedLogin = () => {
    logActivity('security', 'Tried to Login', 'Access attempt blocked');
};

// CREATE
export const logCreate = (itemName) => {
    logActivity('create', `Created ${itemName}`, `Created new item: ${itemName}`);
};

// UPDATE
export const logUpdate = (itemName) => {
    logActivity('update', `Updated ${itemName}`, `Updated item: ${itemName}`);
};

// DELETE
export const logDelete = (itemName) => {
    logActivity('delete', `Deleted ${itemName}`, `Removed item: ${itemName}`);
};
