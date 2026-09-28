import React from 'react';
import '../styles/components/loading.css';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando dados...' }) => {
  return (
    <div className="server-loading-container">
      <div className="server-loading-card">
        <div className="server-spinner" />
        <h3 className="server-loading-title">{message}</h3>
      </div>
    </div>
  );
};

export default Loading;

