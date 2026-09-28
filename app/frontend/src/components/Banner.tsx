import React, { useState } from 'react';
import '../styles/components/banner.css';

interface ServerNoticeBannerProps {
  onDismiss?: () => void;
}

export const ServerNoticeBanner: React.FC<ServerNoticeBannerProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      role="status"
      aria-label="Aviso sobre inicialização da API"
      className="server-notice-banner"
    >
      <div className="server-notice-container">
        <div className="server-notice-content">
          {/* Subtle pulsating status dot */}
          <span className="server-notice-pulse">
            <span className="server-notice-ping" />
            <span className="server-notice-dot" />
          </span>

          <svg
            className="server-notice-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>

          <p className="server-notice-text">
            <strong>Aviso: </strong>
            Como a API está hospedada no plano gratuito do Render, o servidor hiberna após 15 min de inatividade e pode levar até ~45 segundos para inicializar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            if (onDismiss) onDismiss();
          }}
          className="server-notice-close-btn"
          aria-label="Fechar aviso"
          title="Fechar aviso"
        >
          <svg
            className="server-notice-close-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default ServerNoticeBanner;