import React, { useState } from 'react';
import {
    Shield,
    Key,
    Smartphone,
    Database,
    Mail,
    Bell,
    Download,
    Eye,
    FileText,
    Users,
    Plus,
    Trash2,
    UserX,
    Save,
    Edit,
    Check,
    X,
    AlertCircle,
    Settings,
    Lock,
    Unlock,
    Server,
    Search
} from 'lucide-react';

function SettingsTab() {
    const [activeTab, setActiveTab] = useState('security');
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingDatabase, setEditingDatabase] = useState(false);

    // State for all settings
    const [settings, setSettings] = useState({
        // Security settings
        twoFactorEnabled: false,
        googleConnected: false,
        googleAuthEnabled: false,
        passwordAuthEnabled: true,

        // Notification settings
        emailInquiries: true,
        userVisitingNotifications: false,
        cvDownloadNotifications: true,
        projectViewNotifications: true,

        // Email configuration
        emailProvider: 'smtp',
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUsername: '',
        smtpPassword: '',
        senderEmail: '',
        senderName: '',

        // Database configuration
        mongodbUri: '',
        databaseName: '',
        connectionTimeout: '30000',
        maxPoolSize: '10',

        // Admin accounts
        adminAccounts: [
            { id: 1, email: 'admin@company.com', role: 'Primary Admin', status: 'active', isPrimary: true },
            { id: 2, email: 'support@company.com', role: 'Admin', status: 'active', isPrimary: false },
            { id: 3, email: 'manager@company.com', role: 'Admin', status: 'disabled', isPrimary: false }
        ]
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [newAdminForm, setNewAdminForm] = useState({
        email: '',
        role: 'Admin'
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInputChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Handle password change logic here
        setShowPasswordChange(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleAddAdmin = (e) => {
        e.preventDefault();
        const newAdmin = {
            id: Date.now(),
            email: newAdminForm.email,
            role: newAdminForm.role,
            status: 'active',
            isPrimary: false
        };
        setSettings(prev => ({
            ...prev,
            adminAccounts: [...prev.adminAccounts, newAdmin]
        }));
        setNewAdminForm({ email: '', role: 'Admin' });
        setShowAddAdmin(false);
    };

    const toggleAdminStatus = (id) => {
        setSettings(prev => ({
            ...prev,
            adminAccounts: prev.adminAccounts.map(admin =>
                admin.id === id ? { ...admin, status: admin.status === 'active' ? 'disabled' : 'active' } : admin
            )
        }));
    };

    const deleteAdmin = (id) => {
        setSettings(prev => ({
            ...prev,
            adminAccounts: prev.adminAccounts.filter(admin => admin.id !== id)
        }));
    };

    const tabs = [
        { id: 'security', label: 'Security & Privacy', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'email', label: 'Email Service', icon: Mail },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'admin', label: 'Admin Management', icon: Users }
    ];

    const ToggleSwitch = ({ enabled, onToggle, disabled = false }) => (
        <button
            onClick={onToggle}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, disabled = false }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 transition-colors disabled:bg-gray-800/50"
            />
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-2 space-y-8">

            {/* Tabs */}
            <div className="border-b border-gray-700/50 mb-8">
                <div className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Security & Privacy Tab */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    {/* Password Management */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Key className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Password Management</h3>
                        </div>

                        {!showPasswordChange ? (
                            <button
                                onClick={() => setShowPasswordChange(true)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Change Password
                            </button>
                        ) : (
                            <div className="space-y-4 max-w-md">
                                <InputField
                                    label="Current Password"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
                                    required
                                />
                                <InputField
                                    label="New Password"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
                                    required
                                />
                                <InputField
                                    label="Confirm New Password"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
                                    required
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handlePasswordSubmit}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordChange(false)}
                                        className="bg-gray-600/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Smartphone className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-white">Enable 2FA</p>
                                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                            </div>
                            <ToggleSwitch
                                enabled={settings.twoFactorEnabled}
                                onToggle={() => toggleSetting('twoFactorEnabled')}
                            />
                        </div>
                    </div>

                    {/* Login Management */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Login Management</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Google Account Connection */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">Google Account</p>
                                    <p className="text-sm text-gray-400">
                                        {settings.googleConnected ? 'Connected to Google account' : 'Connect your Google account'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleSetting('googleConnected')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${settings.googleConnected
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                                        }`}
                                >
                                    {settings.googleConnected ? 'Disconnect' : 'Connect Google'}
                                </button>
                            </div>

                            {/* Google Authentication */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">Google Authentication</p>
                                    <p className="text-sm text-gray-400">Allow login with Google account</p>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.googleAuthEnabled}
                                    onToggle={() => toggleSetting('googleAuthEnabled')}
                                    disabled={!settings.googleConnected}
                                />
                            </div>

                            {/* Password Authentication */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">Password Authentication</p>
                                    <p className="text-sm text-gray-400">Allow login with email and password</p>
                                </div>
                                <ToggleSwitch
                                    enabled={settings.passwordAuthEnabled}
                                    onToggle={() => toggleSetting('passwordAuthEnabled')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Backup & Export */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Download className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Data Backup & Export</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <button className="bg-blue-400/20 border border-blue-400/30 text-blue-400 px-4 py-3 rounded-lg hover:bg-blue-400/30 transition-colors text-left">
                                <div className="font-medium">Export All Data</div>
                                <div className="text-sm opacity-75">Download complete data backup</div>
                            </button>
                            <button className="bg-green-400/20 border border-green-400/30 text-green-400 px-4 py-3 rounded-lg hover:bg-green-400/30 transition-colors text-left">
                                <div className="font-medium">Schedule Backup</div>
                                <div className="text-sm opacity-75">Set up automatic backups</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-orange-400" />
                                <div>
                                    <p className="font-medium text-white">Email Inquiries</p>
                                    <p className="text-sm text-gray-400">Get notified when new inquiries are received</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.emailInquiries}
                                onToggle={() => toggleSetting('emailInquiries')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4 text-purple-400" />
                                <div>
                                    <p className="font-medium text-white">User Visiting Notifications</p>
                                    <p className="text-sm text-gray-400">Get notified when users visit your profile</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.userVisitingNotifications}
                                onToggle={() => toggleSetting('userVisitingNotifications')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-green-400" />
                                <div>
                                    <p className="font-medium text-white">CV Download Notifications</p>
                                    <p className="text-sm text-gray-400">Get notified when someone downloads your CV</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.cvDownloadNotifications}
                                onToggle={() => toggleSetting('cvDownloadNotifications')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4 text-cyan-400" />
                                <div>
                                    <p className="font-medium text-white">Project View Notifications</p>
                                    <p className="text-sm text-gray-400">Get notified when someone views your projects</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.projectViewNotifications}
                                onToggle={() => toggleSetting('projectViewNotifications')}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Email Service Tab */}
            {activeTab === 'email' && (
                <div className="space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">Email Service Configuration</h3>
                            </div>
                            <button
                                onClick={() => setEditingEmail(!editingEmail)}
                                className="flex items-center gap-2 px-4 py-2 text-blue-400 border border-blue-400/50 rounded-lg hover:bg-blue-400/10 transition-colors"
                            >
                                {editingEmail ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                                {editingEmail ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Provider</label>
                                    <select
                                        value={settings.emailProvider}
                                        onChange={(e) => handleInputChange('emailProvider', e.target.value)}
                                        disabled={!editingEmail}
                                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-400/50 disabled:bg-gray-800/50 transition-colors"
                                    >
                                        <option value="smtp">SMTP</option>
                                        <option value="sendgrid">SendGrid</option>
                                        <option value="mailgun">Mailgun</option>
                                    </select>
                                </div>

                                <InputField
                                    label="SMTP Host"
                                    value={settings.smtpHost}
                                    onChange={(value) => editingEmail && handleInputChange('smtpHost', value)}
                                    placeholder="smtp.gmail.com"
                                    disabled={!editingEmail}
                                />

                                <InputField
                                    label="SMTP Port"
                                    value={settings.smtpPort}
                                    onChange={(value) => editingEmail && handleInputChange('smtpPort', value)}
                                    placeholder="587"
                                    disabled={!editingEmail}
                                />

                                <InputField
                                    label="Username"
                                    value={settings.smtpUsername}
                                    onChange={(value) => editingEmail && handleInputChange('smtpUsername', value)}
                                    placeholder="your-email@gmail.com"
                                    disabled={!editingEmail}
                                />
                            </div>

                            <div className="space-y-4">
                                <InputField
                                    label="Password"
                                    type="password"
                                    value={settings.smtpPassword}
                                    onChange={(value) => editingEmail && handleInputChange('smtpPassword', value)}
                                    placeholder="••••••••"
                                    disabled={!editingEmail}
                                />

                                <InputField
                                    label="Sender Email"
                                    value={settings.senderEmail}
                                    onChange={(value) => editingEmail && handleInputChange('senderEmail', value)}
                                    placeholder="noreply@yourcompany.com"
                                    disabled={!editingEmail}
                                />

                                <InputField
                                    label="Sender Name"
                                    value={settings.senderName}
                                    onChange={(value) => editingEmail && handleInputChange('senderName', value)}
                                    placeholder="Your Company Name"
                                    disabled={!editingEmail}
                                />

                                {editingEmail && (
                                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save Email Configuration
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Database Tab */}
            {activeTab === 'database' && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Server className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">MongoDB Configuration</h3>
                        </div>
                        <button
                            onClick={() => setEditingDatabase(!editingDatabase)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-400 border border-blue-400/50 rounded-lg hover:bg-blue-400/10 transition-colors"
                        >
                            {editingDatabase ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                            {editingDatabase ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <InputField
                                label="MongoDB URI"
                                value={settings.mongodbUri}
                                onChange={(value) => editingDatabase && handleInputChange('mongodbUri', value)}
                                placeholder="mongodb://localhost:27017"
                                disabled={!editingDatabase}
                            />

                            <InputField
                                label="Database Name"
                                value={settings.databaseName}
                                onChange={(value) => editingDatabase && handleInputChange('databaseName', value)}
                                placeholder="myapp_database"
                                disabled={!editingDatabase}
                            />
                        </div>

                        <div className="space-y-4">
                            <InputField
                                label="Connection Timeout (ms)"
                                value={settings.connectionTimeout}
                                onChange={(value) => editingDatabase && handleInputChange('connectionTimeout', value)}
                                placeholder="30000"
                                disabled={!editingDatabase}
                            />

                            <InputField
                                label="Max Pool Size"
                                value={settings.maxPoolSize}
                                onChange={(value) => editingDatabase && handleInputChange('maxPoolSize', value)}
                                placeholder="10"
                                disabled={!editingDatabase}
                            />

                            {editingDatabase && (
                                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Database Configuration
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">Warning</span>
                        </div>
                        <p className="text-sm text-yellow-300/80 mt-1">
                            Changing database configuration may affect application connectivity. Make sure to test the connection before saving.
                        </p>
                    </div>
                </div>
            )}

            {/* Admin Management Tab */}
            {activeTab === 'admin' && (
                <div className="space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">Admin Account Management</h3>
                            </div>
                            <button
                                onClick={() => setShowAddAdmin(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                                Add Admin
                            </button>
                        </div>

                        {/* Add Admin Form */}
                        {showAddAdmin && (
                            <div className="mb-6 p-4 border border-gray-700/50 rounded-lg bg-gray-900/30">
                                <h4 className="font-medium text-white mb-4">Add New Admin Account</h4>
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Email Address"
                                            type="email"
                                            value={newAdminForm.email}
                                            onChange={(value) => setNewAdminForm(prev => ({ ...prev, email: value }))}
                                            placeholder="admin@company.com"
                                            required
                                        />
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Role</label>
                                            <select
                                                value={newAdminForm.role}
                                                onChange={(e) => setNewAdminForm(prev => ({ ...prev, role: e.target.value }))}
                                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-400/50 transition-colors"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Super Admin">Super Admin</option>
                                                <option value="Moderator">Moderator</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAddAdmin}
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Add Admin
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddAdmin(false)}
                                            className="bg-gray-600/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin Accounts List */}
                        <div className="space-y-3">
                            {settings.adminAccounts.map((admin) => (
                                <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-900/30 border border-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${admin.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                                            }`} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-white">{admin.email}</span>
                                                {admin.isPrimary && (
                                                    <span className="px-2 py-1 text-xs bg-blue-400/20 text-blue-400 rounded-full">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400">{admin.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${admin.status === 'active'
                                            ? 'bg-green-400/20 text-green-400'
                                            : 'bg-red-400/20 text-red-400'
                                            }`}>
                                            {admin.status}
                                        </span>

                                        {!admin.isPrimary && (
                                            <>
                                                <button
                                                    onClick={() => toggleAdminStatus(admin.id)}
                                                    className={`p-2 rounded-lg transition-colors ${admin.status === 'active'
                                                        ? 'text-red-600 hover:bg-red-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                    title={admin.status === 'active' ? 'Disable Account' : 'Enable Account'}
                                                >
                                                    {admin.status === 'active' ? <UserX className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => deleteAdmin(admin.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Account"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsTab;