import { useState } from 'react';
import { useAuth } from '../../model/context/AuthContext';
import { useThreads, useMessages } from '../../controller/hooks/useMessages';
import Sidebar from '../components/Sidebar';
import './ConversationsPage.css';

export default function ConversationsPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <ConversationsContent />
    </div>
  );
}

function ConversationsContent() {
  const { user } = useAuth();
  const { threads, createThread, error: threadError, loading } = useThreads();

  // tacking which chat the user clicks onto to open hat
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  // i filtered threads so each user only sees their own conversations
  const myThreads = threads.filter((t) => {
    if (user.role === 'patient') return t.patient_id === user.user_id;
    if (user.role === 'professional') return t.professional_id === user.user_id;
    return false;
  });

  const selectedThread = myThreads.find((t) => t.thread_id === selectedThreadId);

  return (
    <main className="dashboard-main">
      <div className="dashboard-topbar">
        <h1 className="dashboard-heading">Conversations</h1>
      </div>

      {threadError && <p className="dashboard-error">{threadError}</p>}

      <div className="mh-layout">
        {/* left side shows thread list and the new conversation form */}
        <div className="mh-sidebar">
          {user.role === 'patient' && (
            <NewThreadForm onCreate={createThread} userId={user.user_id} role="patient" />
          )}
          {user.role === 'professional' && (
            <NewThreadForm onCreate={createThread} userId={user.user_id} role="professional" />
          )}

          <h3 className="mh-section-title">Conversations</h3>

          {loading && <p className="mh-empty">Loading...</p>}

          {!loading && myThreads.length === 0 && (
            <p className="mh-empty">No conversations yet</p>
          )}

          {myThreads.map((t) => {
            // showing the name of the person the user is chatting to
            const otherName = user.role === 'patient'
              ? `${t.professional_first_name} ${t.professional_last_name}`
              : `${t.patient_first_name} ${t.patient_last_name}`;

            const otherRole = user.role === 'patient' ? 'Professional' : 'Patient';

            return (
              <button
                key={t.thread_id}
                className={`mh-thread-btn ${selectedThreadId === t.thread_id ? 'mh-thread-btn-active' : ''}`}
                onClick={() => setSelectedThreadId(t.thread_id)}
              >
                <span className="mh-thread-name">{otherName}</span>
                <span className="mh-thread-role">{otherRole}</span>
              </button>
            );
          })}
        </div>

        {/* right side shows the messages for the selected thread */}
        <div className="mh-chat">
          {selectedThread ? (
            <ChatPanel thread={selectedThread} currentUserId={user.user_id} />
          ) : (
            <div className="mh-empty-chat">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// the form used by both patients and professionals to start a new conversation
function NewThreadForm({ onCreate, userId, role }) {
  const [otherId, setOtherId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // i set the label based on role so each user knows who to enter the id for
  const placeholder = role === 'patient' ? 'Enter professional ID' : 'Enter patient ID';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // i built the thread data differently depending on who is starting the chat
      const threadData = role === 'patient'
        ? { patient_id: userId, professional_id: Number(otherId) }
        : { patient_id: Number(otherId), professional_id: userId };

      await onCreate(threadData);
      setOtherId('');
    } catch (err) {
      setError('Could not start conversation');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mh-new-thread">
      <h3 className="mh-section-title">New Conversation</h3>
      {error && <p className="dashboard-error">{error}</p>}
      <form onSubmit={handleSubmit} className="mh-new-form">
        <input
          type="number"
          className="form-input"
          placeholder={placeholder}
          value={otherId}
          onChange={(e) => setOtherId(e.target.value)}
          required
        />
        <button type="submit" className="login-btn mh-start-btn" disabled={submitting}>
          {submitting ? 'Starting...' : 'Start Chat'}
        </button>
      </form>
    </div>
  );
}

// the chat panel that shows messages and the send message box
function ChatPanel({ thread, currentUserId }) {
  const { messages, send, error } = useMessages(thread.thread_id);
  const [messageBody, setMessageBody] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!messageBody.trim()) return;
    setSending(true);

    // this sends the current users id and the message text to the hook
    await send(currentUserId, messageBody);
    setMessageBody('');
    setSending(false);
  }

  return (
    <div className="mh-chat-panel">
      {/* shows who the conversation is with at the top */}
      <div className="mh-chat-header">
        {currentUserId === thread.patient_id
          ? `${thread.professional_first_name} ${thread.professional_last_name}`
          : `${thread.patient_first_name} ${thread.patient_last_name}`}
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      <div className="mh-messages">
        {messages.length === 0 && (
          <p className="mh-no-messages">No messages yet. Say hello!</p>
        )}

        {messages.map((msg) => {
          // i used the sender id to decide if the bubble should go left or right
          const isMine = msg.sender_user_id === currentUserId;

          return (
            <div key={msg.message_id} className={`mh-bubble-row ${isMine ? 'mh-bubble-row-mine' : ''}`}>
              <div className={`mh-bubble ${isMine ? 'mh-bubble-mine' : 'mh-bubble-theirs'}`}>
                {!isMine && (
                  <span className="mh-bubble-sender">{msg.first_name} {msg.last_name}</span>
                )}
                <p className="mh-bubble-text">{msg.message_body}</p>
                <span className="mh-bubble-time">
                  {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* the text box and send button at the bottom of the chat */}
      <form onSubmit={handleSend} className="mh-send-form">
        <input
          type="text"
          className="form-input mh-message-input"
          placeholder="Type a message..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
        />
        <button type="submit" className="login-btn mh-send-btn" disabled={sending}>
          Send
        </button>
      </form>
    </div>
  );
}
