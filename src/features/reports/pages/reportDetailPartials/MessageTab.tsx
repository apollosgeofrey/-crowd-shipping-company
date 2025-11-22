// MessageTab.tsx
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useUserData } from '../../../../hooks/useUserData';
import reportApi, { type Message } from "../../services/reportApi.ts";
import {FaPhoneAlt, FaVideo, FaPaperclip, FaSmile, FaPaperPlane, FaImage, FaFile, FaMicrophone, FaEdit, FaTrash, FaCheck, FaTimes} from "react-icons/fa";

interface MessageTabProps {
    report: any;
    onReportUpdate?: (updatedReport: any) => void;
}

export default function MessageTab({ report }: MessageTabProps) {
    const { user } = useUserData();
    const currentUserId = user?._id || '';
    const [hasMore, setHasMore] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAppendingMoreMessages, setIsAppendingMoreMessages] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editMessageText, setEditMessageText] = useState("");

    // Check if report has a conversation
    const conversationId = report.conversation?._id;

    // Fetch messages when component mounts
    useEffect(() => {
        if (conversationId) fetchMessages();        
        const container = document.querySelector(".message-container");
        if (container) container.scrollTop = container.scrollHeight;
    }, [conversationId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if(!isAppendingMoreMessages) {
            const container = document.querySelector(".message-container");
            if (container) container.scrollTop = container.scrollHeight;            
        }
    }, [messages]);

    const fetchMessages = async (page: number = 1, append: boolean = false) => {
        if (!conversationId) return;
        setIsLoading(true);
        try {
            const response = await reportApi.getConversationMessages(report._id, conversationId, { page, limit: 50 } );
            if (response.code === 200) {
                const newMessages = response.data.items.filter((msg: Message) => !msg.isDeleted && msg.messageType === 'text').map((msg: Message) => ({ ...msg, text: (msg.message || '') }));                
                if(append) {
                    setIsAppendingMoreMessages(true);
                    setMessages(prev => [...prev, ...newMessages]);
                } else {
                    setMessages(newMessages);
                }
                setHasMore(response.data.meta.currentPage < response.data.meta.totalPages);
                setCurrentPage(response.data.meta.currentPage);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !conversationId) return;
        setIsSending(true);
        setIsAppendingMoreMessages(false);
        try {
            const messageData = {message:newMessage.trim(), messageType:'text' as const, attachments:[] };
            const response = await reportApi.sendMessage(report._id, conversationId, messageData);

            if (response.code === 201) {
                const newMsg: Message = response.data;
                const formattedMessage = {...newMsg, text: newMsg.message || '', sender: 'staff', senderName: 'Support Agent'};                
                setMessages(prev => [formattedMessage, ...prev]);
                setNewMessage("");
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            Swal.fire("Error", (err?.response?.data?.message || "Failed to send message. Please try again."), "error");
        } finally {
            setIsSending(false);
        }
    };

    // Check if message can be edited/deleted (within 1 hour)
    const canModifyMessage = (message: Message) => {
        if (message.senderId !== currentUserId) return false;
        
        const messageTime = new Date(message.createdAt).getTime();
        const currentTime = new Date().getTime();
        const oneHourInMs = 60 * 60 * 1000;
        
        return (currentTime - messageTime) <= oneHourInMs;
    };

    // Delete message handler
    const handleDeleteMessage = async (message: Message) => {
        if (!conversationId) return;
        const result = await Swal.fire({
            title: 'Delete Message?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const response = await reportApi.deleteMessage(report._id, conversationId, message._id);                
                if (response.code === 200) { // Remove message from local state
                    setMessages(prev => prev.filter(msg => msg._id !== message._id));
                    Swal.fire('Deleted!', 'Your message has been deleted.', 'success');
                }
            } catch (err) {
                console.error("Failed to delete message:", err);
                Swal.fire('Error!', 'Failed to delete message. Please try again.', 'error');
            }
        }
    };

    // Start editing message
    const handleStartEdit = (message: Message) => {
        setEditingMessageId(message._id);
        setEditMessageText(message.message || '');
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditMessageText("");
    };

    // Save edited message
    const handleSaveEdit = async (message: Message) => {
        if (!editMessageText.trim() || !conversationId) return;

        try {
            const updateData = {message: editMessageText.trim(), messageType: 'text' as const};
            const response = await reportApi.updateMessage(report._id, conversationId, message._id, updateData);

            // Update message in local state
            if (response.code === 200) {
                setMessages(prev => prev.map(msg => msg._id===message._id ? {...msg, message:editMessageText.trim(), text:editMessageText.trim()} : msg ));
                setEditingMessageId(null);
                setEditMessageText("");
                Swal.fire('Success!', 'Message updated successfully.', 'success');
            }
        } catch (err) {
            console.error("Failed to update message:", err);
            Swal.fire('Error!', 'Failed to update message. Please try again.', 'error');
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !isLoading) fetchMessages(currentPage + 1, true);
    };

    const formatDate = (dateString: string) => (dateString) ? new Date(dateString).toLocaleDateString('en-US', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit'}) : 'N/A';
    const formatTime = (dateString: string) => (dateString) ? new Date(dateString).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true}) : "";

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderMessageContent = (msg: any) => {
        if (msg.messageType === 'image' && msg.attachments.length > 0) {
            return (
                <div>
                    <FaImage className="me-2" />
                    <img src={msg.attachments[0]} alt="Attachment" style={{ maxWidth: '200px', maxHeight: '200px' }} className="rounded"/>
                    <div className="mt-1 small">{msg.message}</div>
                </div>
            );
        } else if (msg.messageType === 'file' && msg.attachments.length > 0) {
            return (
                <div>
                    <FaFile className="me-2" />
                    <a href={msg.attachments[0]} target="_blank" rel="noopener noreferrer" className="text-decoration-none">Download File</a>
                    <div className="mt-1 small">{msg.message}</div>
                </div>
            );
        } else if (msg.messageType === 'voice' && msg.attachments.length > 0) {
            return (
                <div>
                    <FaMicrophone className="me-2" />
                    <audio controls className="mt-1">
                        <source src={msg.attachments[0]} type="audio/mpeg" /> Your browser does not support the audio element.
                    </audio>
                    <div className="mt-1 small">{msg.message}</div>
                </div>
            );
        } else {
            // Show edit input if message is being edited
            if (editingMessageId === msg._id) {
                return (
                    <div className="w-100">
                        <textarea className="form-control" value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} rows={3} autoFocus/>
                        <div className="d-flex gap-2 mt-2">
                            <button className="btn btn-primary btn-sm py-0" onClick={() => handleSaveEdit(msg)} disabled={!editMessageText.trim()}><span className="fa fa-check"></span> Save</button>
                            <button className="btn btn-secondary btn-sm py-0" onClick={handleCancelEdit}><span className="fa fa-times"></span> Cancel</button>
                        </div>
                    </div>
                );
            }
            return msg.text || msg.message;
        }
    };

    if (!conversationId) {
        return (
            <div className="p-3 text-center">
                <div className="text-muted py-4">
                    <i className="fa fa-comments fa-2x mb-3"></i>
                    <p>No conversation started yet.</p>
                    <small>Start by sending the first message.</small>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header with call actions */}
            <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light">
                <span className="fw-semibold text-dark">
                    {report.conversation?.lastMessageAt ? `Last activity ${formatDate(report.conversation.lastMessageAt)}` : 'No recent activity'}
                </span>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" title="Voice Call"><FaPhoneAlt size={14} /></button>
                    <button className="btn btn-sm btn-outline-secondary" title="Video Call"><FaVideo size={14} /></button>
                </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-grow-1 overflow-auto p-3 message-container" style={{ maxHeight: "400px" }}>
                {isLoading && messages.length === 0 ? (
                    <div className="text-center text-muted py-4">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-muted py-4">
                        <i className="fa fa-comments fa-2x mb-2 d-block"></i> No messages yet. Start a conversation...
                    </div>
                ) : (
                   <>
                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center mb-3">
                                <button className="btn btn-outline-secondary btn-sm" onClick={handleLoadMore} disabled={isLoading}>{isLoading ? 'Loading...' : 'Load Older Messages'}</button>
                            </div>
                        )}

                        {/* Messages List - Reversed to show newest at bottom */}
                        {[...messages].reverse().map((msg, index, arr) => {
                            const prevMessage = arr[index - 1];
                            const currentDateSplit = formatDate(msg.createdAt).split(",");  
                            const prevDate = prevMessage ? formatDate(prevMessage.createdAt).split(",")[0] : null;
                            const showDateHeader = index === 0 || currentDateSplit[0] !== prevDate;
                            const isCurrentUser = msg.senderId === currentUserId;
                            const canModify = canModifyMessage(msg);

                            return (
                                <div key={msg._id}>

                                    {/* DATE HEADER (show only once per date group) */}
                                    {showDateHeader && (<div className="text-center mt-3 mb-2 small text-muted fw-bold">{`${currentDateSplit[0]}, ${currentDateSplit[1]}`}</div>)}

                                    {/* MESSAGE BUBBLE */}
                                    <div className={`d-flex mb-3 ${isCurrentUser ? "justify-content-end" : "justify-content-start"}`}>
                                        <div className={`card border-0 shadow-sm ${isCurrentUser ? "bg-primary-subtle" : "bg-light"}`} style={{ maxWidth: "75%", minWidth: "300px" }}>
                                            <div className="card-body py-2 px-3">
                                                <div className="mb-2">{renderMessageContent(msg)}</div>

                                                {/* Non-text type indicator */}
                                                {msg.messageType !== 'text' && (
                                                    <div className={`text-start mb-2 ${isCurrentUser ? 'text-white-50' : 'text-muted'}`}>
                                                        <small>
                                                            {msg.messageType === 'image' && '📷 Image'}
                                                            {msg.messageType === 'file' && '📎 File'}
                                                            {msg.messageType === 'voice' && '🎤 Voice'}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer with sender + time + action buttons */}
                                            <div className={`card-footer py-0 px-2 ${isCurrentUser ? "bg-primary-subtle border-primary" : "bg-white border-light"}`}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className={isCurrentUser ? '' : 'text-muted'}>
                                                        {!isCurrentUser && msg.sender?.fullName && (<small className={`fw-semibold me-1 ${isCurrentUser ? 'text-white-50' : 'text-dark'}`}>• {msg.sender.fullName}</small>)}
                                                        {!isCurrentUser && msg.sender?.role && msg.sender.role !== 'user' && (<small className="badge bg-secondary me-1">{msg.sender.role}</small>)}
                                                        <small>• {formatTime(msg.createdAt)}</small>
                                                    </small>

                                                    {/* Action buttons for current user's messages within 1 hour */}
                                                    {report?.status==='pending' && isCurrentUser && canModify && editingMessageId !== msg._id && (
                                                        <div className="d-flex gap-2">
                                                            <button className="text-primary" onClick={() => handleStartEdit(msg)} title="Edit message">
                                                                <FaEdit size={10} />
                                                            </button>
                                                            <button className="text-danger" onClick={() => handleDeleteMessage(msg)} title="Delete message">
                                                                <FaTrash size={10} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
            
            {/* Message Input */}
            <div className="border-top p-3">
                <div className="d-flex align-items-center gap-2 mb-0">
                    <textarea placeholder="Type your message..." className="form-control shadow-lg" rows='3' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} disabled={report?.status === 'resolved' || isSending}/>
                    {report?.status === 'pending' && (
                        <>
                            <button className="btn btn-light" title="Attach file" disabled={isSending}><FaPaperclip /></button>
                            <button className="btn btn-light" title="Add emoji" disabled={isSending}><FaSmile /></button>
                            <button className="btn btn-primary" onClick={handleSendMessage} disabled={isSending || !newMessage.trim() || !conversationId}>
                                {isSending ? (<div className="spinner-border spinner-border-sm" role="status"></div> ) : (<FaPaperPlane />)}
                            </button>
                        </>
                    )}
                </div>
                <div className="mt-0">
                    <small className="text-muted">Press Enter to send. Use Shift+Enter for new line.</small>
                </div>
            </div>
        </>
    );
}