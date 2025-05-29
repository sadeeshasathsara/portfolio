
import React, { useState, useEffect, useRef } from 'react';
import {
    Mail,
    Send,
    Reply,
    Archive,
    Trash2,
    Star,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    User,
    Clock,
    Paperclip,
    X,
    Check,
    AlertCircle,
    FileText,
    Image,
    Download,
    Plus
} from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../../tools/Tools';

function Messages() {
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replySubject, setReplySubject] = useState('');
    const [replyAttachments, setReplyAttachments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [displayedEmails, setDisplayedEmails] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreEmails, setHasMoreEmails] = useState(true);
    const fileInputRef = useRef(null);
    const [allEmails, setAllEmails] = useState([]);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/contact/all`);
                setAllEmails(res.data);
            } catch (error) {
                console.error('Failed to fetch emails:', error);
            }
        };

        fetchEmails();
    }, []);

    const filteredEmails = allEmails.filter(email => {
        const sender = (email.sender || '').toLowerCase();
        const subject = (email.subject || '').toLowerCase();
        const preview = (email.preview || '').toLowerCase();
        const query = searchTerm.toLowerCase();

        const matchesSearch = sender.includes(query) ||
            subject.includes(query) ||
            preview.includes(query);

        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'unread' && email.isNew) ||
            (filterStatus === 'starred' && email.isStarred);

        return matchesSearch && matchesFilter;
    });



    const visibleEmails = filteredEmails.slice(0, displayedEmails);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000) {
                loadMoreEmails();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [displayedEmails, filteredEmails.length]);

    const loadMoreEmails = () => {
        if (isLoading || displayedEmails >= filteredEmails.length) return;

        setIsLoading(true);
        setTimeout(() => {
            const newDisplayCount = Math.min(displayedEmails + 5, filteredEmails.length);
            setDisplayedEmails(newDisplayCount);
            setHasMoreEmails(newDisplayCount < filteredEmails.length);
            setIsLoading(false);
        }, 800); // Simulate loading delay
    };



    // Reset displayed emails when search/filter changes
    useEffect(() => {
        setDisplayedEmails(5);
        setHasMoreEmails(filteredEmails.length > 5);
    }, [searchTerm, filterStatus]);

    const handleReply = async () => {
        if (replyText.trim()) {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/contact/${selectedEmail.id}/reply`, {
                    subject: replySubject,
                    content: replyText,
                    attachments: replyAttachments // assuming strings or filenames
                });

                console.log('Reply sent:', response.data);

                // Optional: update the local UI message thread
                // selectedEmail.previousEmails.push(...)

                setReplyText('');
                setReplySubject('');
                setReplyAttachments([]);
                setIsReplying(false);
            } catch (err) {
                console.error('Failed to send reply:', err.response?.data?.message || err.message);
            }
        }
    };



    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newAttachments = files.map(file => ({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.type.includes('image') ? 'image' :
                file.type.includes('pdf') ? 'pdf' : 'document',
            file: file
        }));
        setReplyAttachments([...replyAttachments, ...newAttachments]);
    };

    const removeAttachment = (index) => {
        setReplyAttachments(replyAttachments.filter((_, i) => i !== index));
    };

    const startReply = (email) => {
        setIsReplying(true);
        setReplySubject(`Re: ${email.subject}`);
    };

    const toggleStar = (emailId) => {
        console.log('Toggle star for email:', emailId);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-red-400';
            case 'medium': return 'border-l-yellow-400';
            case 'low': return 'border-l-green-400';
            default: return 'border-l-gray-400';
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText className="w-4 h-4 text-red-400" />;
            case 'image': return <Image className="w-4 h-4 text-blue-400" />;
            case 'design': return <Image className="w-4 h-4 text-purple-400" />;
            case 'archive': return <FileText className="w-4 h-4 text-yellow-400" />;
            default: return <FileText className="w-4 h-4 text-gray-400" />;
        }
    };

    const [showNewEmail, setShowNewEmail] = useState(false);
    const [newEmail, setNewEmail] = useState({
        to: '',
        subject: '',
        content: '',
        attachments: []
    });

    const markAsRead = async (emailId) => {
        try {
            await axios.put(`${BACKEND_URL}/api/contact/set-read`, { id: emailId });

            // Update local state to mark as read
            setAllEmails(prevEmails =>
                prevEmails.map(email =>
                    email.id === emailId ? { ...email, isNew: false } : email
                )
            );

            // If the selected email is the one being marked as read, update it too
            if (selectedEmail && selectedEmail.id === emailId) {
                setSelectedEmail(prev => ({ ...prev, isNew: false }));
            }

        } catch (error) {
            console.error('Failed to mark email as read:', error);
        }
    };

    return (
        <div className="space-y-6 p-1 m-3">


            {/* New Email Modal */}
            {showNewEmail && (
                <div className="fixed inset-0 bg-black/50 rounded-xl z-50 flex justify-center p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700/50 w-full max-w-2xl max-h-[95vh]">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Compose New Email</h2>
                                <button
                                    onClick={() => {
                                        setShowNewEmail(false);
                                        setNewEmail({ to: '', subject: '', content: '', attachments: [] });
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* To Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
                                    <input
                                        type="email"
                                        value={newEmail.to}
                                        onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                                        placeholder="recipient@example.com"
                                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 transition-colors"
                                    />
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={newEmail.subject}
                                        onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                                        placeholder="Email subject"
                                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 transition-colors"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                    <textarea
                                        value={newEmail.content}
                                        onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                                        placeholder="Type your message here..."
                                        className="w-full h-40 bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400/50 transition-colors"
                                    />
                                </div>

                                {/* Attachments */}
                                {newEmail.attachments && newEmail.attachments.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Attachments</label>
                                        <div className="space-y-2">
                                            {newEmail.attachments.map((attachment, index) => (
                                                <div key={index} className="flex items-center space-x-2 bg-gray-700/30 rounded-lg p-2 border border-gray-600/30">
                                                    {getFileIcon(attachment.type)}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-medium truncate">{attachment.name}</p>
                                                        <p className="text-gray-400 text-xs">{attachment.size}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const updatedAttachments = newEmail.attachments.filter((_, i) => i !== index);
                                                            setNewEmail({ ...newEmail, attachments: updatedAttachments });
                                                        }}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                const newAttachments = files.map(file => ({
                                                    name: file.name,
                                                    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                                                    type: file.type.includes('image') ? 'image' :
                                                        file.type.includes('pdf') ? 'pdf' : 'document',
                                                    file: file
                                                }));
                                                setNewEmail({
                                                    ...newEmail,
                                                    attachments: [...(newEmail.attachments || []), ...newAttachments]
                                                });
                                            }}
                                            multiple
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center space-x-1 p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            <Paperclip className="w-4 h-4" />
                                            <span className="text-sm">Attach</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setShowNewEmail(false);
                                                setNewEmail({ to: '', subject: '', content: '', attachments: [] });
                                            }}
                                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Sending new email:', newEmail);
                                                setShowNewEmail(false);
                                                setNewEmail({ to: '', subject: '', content: '', attachments: [] });
                                            }}
                                            disabled={!newEmail.to.trim() || !newEmail.subject.trim() || !newEmail.content.trim()}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Send Email</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Interface */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                {selectedEmail ? (
                    /* Email Detail View */
                    <div className="animate-in slide-in-from-right duration-300">
                        {/* Email Header */}
                        <div className="p-4 lg:p-6 border-b border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back to Inbox
                                </button>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleStar(selectedEmail.id)}
                                        className={`p-2 rounded-lg transition-all ${selectedEmail.isStarred
                                            ? 'text-yellow-400 bg-yellow-400/20'
                                            : 'text-gray-400 hover:text-yellow-400 bg-gray-700/50 hover:bg-yellow-400/20'
                                            }`}
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg text-gray-400 hover:text-blue-400 bg-gray-700/50 hover:bg-blue-400/20 transition-all">
                                        <Archive className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 bg-gray-700/50 hover:bg-red-400/20 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-xl lg:text-2xl font-semibold text-white">
                                    {selectedEmail.subject}
                                </h2>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm lg:text-base">
                                                {selectedEmail.senderName}
                                            </p>
                                            <p className="text-gray-400 text-xs lg:text-sm">
                                                {selectedEmail.sender}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-400 text-xs lg:text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>{selectedEmail.time}</span>
                                    </div>
                                </div>

                                {/* Email Attachments */}
                                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-300 mb-2">Attachments ({selectedEmail.attachments.length})</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEmail.attachments.map((attachment, index) => (
                                                <div key={index} className="flex items-center space-x-2 bg-gray-700/30 rounded-lg p-2 border border-gray-600/30">
                                                    {getFileIcon(attachment.type)}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-xs font-medium truncate">{attachment.name}</p>
                                                        <p className="text-gray-400 text-xs">{attachment.size}</p>
                                                    </div>
                                                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Previous Emails & Replies Section */}
                        {selectedEmail.previousEmails && selectedEmail.previousEmails.length > 0 && (
                            <div className="border-b border-gray-700/50">
                                <div className="p-4 lg:p-6">
                                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                                        Previous Conversation ({selectedEmail.previousEmails.length})
                                    </h3>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {selectedEmail.previousEmails.map((prevEmail, index) => (
                                            <div key={index} className="bg-gray-700/20 rounded-lg p-4 border-l-4 border-gray-600/50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 bg-gray-600/50 rounded-full flex items-center justify-center">
                                                            <User className="w-3 h-3 text-gray-400" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-300">
                                                            {prevEmail.isReply ? 'You' : prevEmail.senderName}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {prevEmail.isReply ? '(Reply)' : '(Original)'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{prevEmail.time}</span>
                                                </div>
                                                <h4 className="text-sm font-medium text-gray-300 mb-2">{prevEmail.subject}</h4>
                                                <p className="text-sm text-gray-400 line-clamp-3">{prevEmail.content}</p>
                                                {prevEmail.attachments && prevEmail.attachments.length > 0 && (
                                                    <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
                                                        <Paperclip className="w-3 h-3" />
                                                        <span>{prevEmail.attachments.length} attachment(s)</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Content */}
                        <div className="p-4 lg:p-6">
                            <div className="prose prose-invert max-w-none">
                                <div className="text-gray-300 text-sm lg:text-base leading-relaxed whitespace-pre-line">
                                    {selectedEmail.content}
                                </div>
                            </div>
                        </div>

                        {/* Reply Section */}
                        <div className="border-t border-gray-700/50 p-4 lg:p-6">
                            {!isReplying ? (
                                <button
                                    onClick={() => startReply(selectedEmail)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-400/20 hover:bg-blue-400/30 text-blue-400 rounded-lg transition-all duration-200"
                                >
                                    <Reply className="w-4 h-4" />
                                    <span>Reply</span>
                                </button>
                            ) : (
                                <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-medium">Reply to {selectedEmail.senderName}</h3>
                                        <button
                                            onClick={() => {
                                                setIsReplying(false);
                                                setReplyText('');
                                                setReplySubject('');
                                                setReplyAttachments([]);
                                            }}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* To Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
                                        <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg p-3 text-gray-400">
                                            {selectedEmail.sender}
                                        </div>
                                    </div>

                                    {/* Subject Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            value={replySubject}
                                            onChange={(e) => setReplySubject(e.target.value)}
                                            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 transition-colors"
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply here..."
                                            className="w-full h-32 lg:h-40 bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400/50 transition-colors"
                                        />
                                    </div>

                                    {/* Attachments */}
                                    {replyAttachments.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Attachments</label>
                                            <div className="space-y-2">
                                                {replyAttachments.map((attachment, index) => (
                                                    <div key={index} className="flex items-center space-x-2 bg-gray-700/30 rounded-lg p-2 border border-gray-600/30">
                                                        {getFileIcon(attachment.type)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-sm font-medium truncate">{attachment.name}</p>
                                                            <p className="text-gray-400 text-xs">{attachment.size}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeAttachment(index)}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                multiple
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center space-x-1 p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                            >
                                                <Paperclip className="w-4 h-4" />
                                                <span className="text-sm">Attach</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setIsReplying(false);
                                                    setReplyText('');
                                                    setReplySubject('');
                                                    setReplyAttachments([]);
                                                }}
                                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleReply}
                                                disabled={!replyText.trim() || !replySubject.trim()}
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
                                            >
                                                <Send className="w-4 h-4" />
                                                <span>Send Reply</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Email List View */
                    <div>
                        {/* Toolbar */}
                        <div className="p-4 lg:p-6 border-b border-gray-700/50">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                {/* Search */}
                                <div className="relative flex-1 lg:max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search emails..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 transition-colors"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex items-center space-x-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400/50 transition-colors"
                                    >
                                        <option value="all">All Emails</option>
                                        <option value="unread">Unread</option>
                                        <option value="starred">Starred</option>
                                    </select>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                                <span>{filteredEmails.length} emails</span>
                                <span>{allEmails.filter(e => e.isNew).length} unread</span>
                            </div>
                        </div>

                        {/* Email List */}
                        <div className="flex-1">
                            {filteredEmails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Mail className="w-12 h-12 mb-4" />
                                    <p className="text-lg mb-2">No emails found</p>
                                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-700/30">
                                    {filteredEmails.map((email) => (
                                        <div
                                            key={email.id}
                                            onClick={() => {
                                                setSelectedEmail(email);
                                                if (email.isNew) {
                                                    markAsRead(email.id);
                                                }
                                            }}
                                            className={`p-4 lg:p-6 hover:bg-gray-700/20 cursor-pointer transition-all duration-200 border-l-4 ${getPriorityColor(email.priority)} ${email.isNew ? 'bg-gray-700/10' : ''
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3 lg:space-x-4">
                                                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${email.isNew ? 'bg-blue-400/20' : 'bg-gray-700/50'
                                                    }`}>
                                                    <User className={`w-5 h-5 lg:w-6 lg:h-6 ${email.isNew ? 'text-blue-400' : 'text-gray-400'
                                                        }`} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center space-x-2">
                                                            <p className={`text-sm lg:text-base font-medium truncate ${email.isNew ? 'text-white' : 'text-gray-300'
                                                                }`}>
                                                                {email.senderName}
                                                            </p>
                                                            {email.isNew && (
                                                                <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                                                            )}
                                                            {email.previousEmails && email.previousEmails.length > 0 && (
                                                                <span className="text-xs bg-blue-400/20 text-blue-400 px-2 py-1 rounded-full">
                                                                    {email.previousEmails.length + 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                                            {email.hasAttachment && (
                                                                <Paperclip className="w-3 h-3 text-gray-400" />
                                                            )}
                                                            <span className="text-xs text-gray-400">{email.time}</span>
                                                        </div>
                                                    </div>

                                                    <h3 className={`text-sm lg:text-base mb-1 truncate ${email.isNew ? 'text-white font-medium' : 'text-gray-300'
                                                        }`}>
                                                        {email.subject}
                                                    </h3>

                                                    <p className="text-xs lg:text-sm text-gray-400 line-clamp-2">
                                                        {email.preview}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            {email.sender}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            {email.isStarred && (
                                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                            )}
                                                            {email.priority === 'high' && (
                                                                <AlertCircle className="w-3 h-3 text-red-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;