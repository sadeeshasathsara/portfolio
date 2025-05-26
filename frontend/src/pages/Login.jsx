import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios'
import { BACKEND_URL } from '../tools/Tools';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { delay } from 'framer-motion';

const Login = () => {
    const [currentView, setCurrentView] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        otp: ['', '', '', '', '', '']
    });
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    // Password validation function
    const validatePassword = (password) => {
        const errors = [];

        if (password.length < 8) {
            errors.push('At least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('At least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('At least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('At least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('At least one special character');
        }

        return errors;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOtpChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...formData.otp];
            newOtp[index] = value;
            setFormData(prev => ({
                ...prev,
                otp: newOtp
            }));

            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handlePasswordChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Validate password in real-time for the changePassword view
        if (field === 'password' && currentView === 'changePassword') {
            const errors = validatePassword(value);
            setPasswordErrors(errors);
        }
    };

    const isPasswordValid = () => {
        if (currentView !== 'changePassword') return true;

        const passwordValidationErrors = validatePassword(formData.password);
        const passwordsMatch = formData.password === formData.confirmPassword;
        const hasPassword = formData.password.length > 0;
        const hasConfirmPassword = formData.confirmPassword.length > 0;

        return passwordValidationErrors.length === 0 && passwordsMatch && hasPassword && hasConfirmPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (currentView === 'login') {
            try {
                const res = await axios.post(`${BACKEND_URL}/api/login`, {
                    email: formData.email,
                    password: formData.password
                }, { withCredentials: true });
                toast.success('Login successful');
                if (res.status == 200) {
                    navigate("/admin")
                }
            } catch (e) {
                console.log(e);
                toast.error(e?.response?.data?.message || e.message || "Login failed");
            }
        } else if (currentView === 'forgot') {
            try {
                const res = await axios.post(`${BACKEND_URL}/api/forgot-password`, {
                    email: formData.email
                });
                toast.success('Reset code sent to your email');
                setCurrentView('otp');
            } catch (e) {
                console.log(e);
                toast.error(e?.response?.data?.message || e.message || "Failed to send reset code");
            }

        } else if (currentView === 'otp') {
            console.log('OTP submitted:', formData.otp.join(''));
            try {
                const res = await axios.post(`${BACKEND_URL}/api/validate-otp`, {
                    otp: formData.otp.join(''),
                    email: formData.email
                });
                toast.success('OTP verified successfully');
                setCurrentView('changePassword');
            } catch (e) {
                console.log(e);
                toast.error(e?.response?.data?.message || e.message || "OTP verification failed");
            }

        } else if (currentView === 'changePassword') {
            // Validate passwords before submitting
            const passwordValidationErrors = validatePassword(formData.password);
            if (passwordValidationErrors.length > 0) {
                toast.error("Please fix password validation errors");
                setIsLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                setIsLoading(false);
                return;
            }

            try {
                const res = await axios.post(`${BACKEND_URL}/api/change-password`, {
                    email: formData.email,
                    password: formData.password,
                });
                toast.success("Password updated successfully");
                setCurrentView('success');
            } catch (e) {
                toast.error("Password update failed");
                console.log(e.message);
            }
        }

        setIsLoading(false);
    };

    const handleGoogleSignIn = () => {
        console.log('Google Sign-in clicked');
    };

    const resetToLogin = () => {
        setCurrentView('login');
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            otp: ['', '', '', '', '', '']
        });
        setPasswordErrors([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#151e2c] to-slate-900 flex items-center justify-center p-4">
            <ToastContainer />
            <div className="w-full max-w-md">
                <div className="bg-[#131c2b] rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                    <div className="px-8 pt-8 pb-6 text-center relative">
                        {currentView !== 'login' && (
                            <button
                                onClick={() => currentView === 'otp' ? setCurrentView('forgot') : resetToLogin()}
                                className="absolute left-6 top-6 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            {currentView === 'success' ? (
                                <CheckCircle size={32} className="text-white" />
                            ) : currentView === 'otp' ? (
                                <Shield size={32} className="text-white" />
                            ) : (
                                <Lock size={32} className="text-white" />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {currentView === 'login' && 'Welcome Back'}
                            {currentView === 'forgot' && 'Forgot Password'}
                            {currentView === 'otp' && 'Verify Email'}
                            {currentView === 'changePassword' && 'Create New Password'}
                            {currentView === 'success' && 'Password Reset'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {currentView === 'login' && 'Sign in to your account to continue'}
                            {currentView === 'forgot' && 'Enter your email to receive a reset code'}
                            {currentView === 'otp' && `We sent a code to ${formData.email}`}
                            {currentView === 'changePassword' && 'Enter a strong password for your account'}
                            {currentView === 'success' && 'Your password has been successfully updated'}
                        </p>
                    </div>

                    <div className="px-8 pb-8">
                        {currentView === 'login' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-purple-500 bg-slate-800 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                                        />
                                        <span className="text-slate-300 text-sm">Remember me</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentView('forgot')}
                                        className="text-purple-400 cursor-pointer hover:text-purple-300 text-sm font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-[#131c2b] text-slate-400">Or continue with</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full py-3 px-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>
                            </form>
                        )}

                        {/* Forgot Password Form */}
                        {currentView === 'forgot' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Sending code...</span>
                                        </div>
                                    ) : (
                                        'Send Reset Code'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* OTP Verification */}
                        {currentView === 'otp' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-4 text-center">
                                        Enter the 6-digit code
                                    </label>
                                    <div className="flex justify-center space-x-3">
                                        {formData.otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                className="w-12 h-12 text-center text-xl font-bold bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                maxLength={1}
                                                pattern="[0-9]"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || formData.otp.some(digit => !digit)}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </button>

                                <div className="text-center">
                                    <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
                                    <button
                                        type="button"
                                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Change Password Form with Validation */}
                        {currentView === 'changePassword' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => handlePasswordChange('password', e.target.value)}
                                            className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${passwordErrors.length > 0 && formData.password
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-slate-600 focus:ring-purple-500'
                                                }`}
                                            placeholder="Enter your new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
                                    {formData.password && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-slate-300 text-sm font-medium">Password requirements:</p>
                                            <div className="space-y-1">
                                                {[
                                                    { test: formData.password.length >= 8, text: 'At least 8 characters long' },
                                                    { test: /[A-Z]/.test(formData.password), text: 'At least one uppercase letter' },
                                                    { test: /[a-z]/.test(formData.password), text: 'At least one lowercase letter' },
                                                    { test: /\d/.test(formData.password), text: 'At least one number' },
                                                    { test: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: 'At least one special character' }
                                                ].map((req, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        {req.test ? (
                                                            <CheckCircle size={16} className="text-green-400" />
                                                        ) : (
                                                            <AlertCircle size={16} className="text-red-400" />
                                                        )}
                                                        <span className={`text-sm ${req.test ? 'text-green-400' : 'text-red-400'}`}>
                                                            {req.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                                ? 'border-red-500 focus:ring-red-500'
                                                : formData.confirmPassword && formData.password === formData.confirmPassword
                                                    ? 'border-green-500 focus:ring-green-500'
                                                    : 'border-slate-600 focus:ring-purple-500'
                                                }`}
                                            placeholder="Confirm your new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {formData.confirmPassword && (
                                        <div className="mt-2 flex items-center space-x-2">
                                            {formData.password === formData.confirmPassword ? (
                                                <>
                                                    <CheckCircle size={16} className="text-green-400" />
                                                    <span className="text-sm text-green-400">Passwords match</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle size={16} className="text-red-400" />
                                                    <span className="text-sm text-red-400">Passwords do not match</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !isPasswordValid()}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Updating password...</span>
                                        </div>
                                    ) : (
                                        'Update Password'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Success State */}
                        {currentView === 'success' && (
                            <div className="text-center space-y-6">
                                <div className="space-y-3">
                                    <p className="text-slate-300">
                                        Your password has been successfully reset.
                                    </p>
                                </div>

                                <button
                                    onClick={resetToLogin}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Back to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;