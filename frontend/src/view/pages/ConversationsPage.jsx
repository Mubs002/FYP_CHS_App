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
}
