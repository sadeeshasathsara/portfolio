import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const BACKEND_URL = "http://localhost:3000";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const toastId = toast.loading("Checking authentication...");
            await delay(1500);

            try {
                const res = await axios.get(`${BACKEND_URL}/api/check-auth`, {
                    withCredentials: true,
                });

                if (res.status === 200) {
                    setAuthenticated(true);
                    toast.update(toastId, {
                        render: "Authenticated",
                        type: "success",
                        isLoading: false,
                        autoClose: 1500,
                    });
                } else {
                    setAuthenticated(false);
                    toast.update(toastId, {
                        render: "Not authenticated",
                        type: "error",
                        isLoading: false,
                        autoClose: 1500,
                    });
                }
            } catch (err) {
                setAuthenticated(false);
                toast.update(toastId, {
                    render: "Auth check failed",
                    type: "error",
                    isLoading: false,
                    autoClose: 1500,
                });
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div><ToastContainer /></div>;

    return (
        <>
            <ToastContainer />
            {authenticated ? children : <Navigate to="/login" replace />}
        </>
    );
};