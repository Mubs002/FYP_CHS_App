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
}
