import React, { useState, useEffect } from 'react';
import '../styles/components/loading.css';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando dados...' }) => {
  const [dots, setDots] = useState('');
  const [showServerWakingMessage, setShowServerWakingMessage] = useState(false);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : `${prev}.`));
    }, 400);

    // Se a requisição demorar mais de 3 segundos, exibe aviso explicativo sobre o Render acordando
    const serverTimeout = setTimeout(() => {
      setShowServerWakingMessage(true);
    }, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(serverTimeout);
    };
  }, []);

  return (
    <div className="server-loading-container">
      <div className="server-loading-card">
        <div className="server-spinner" />
        <h3 className="server-loading-title">
          {message}
          <span className="server-loading-dots">{dots}</span>
        </h3>

        {showServerWakingMessage && (
          <div className="server-wake-alert">
            <span className="server-wake-icon">⚡</span>
            <div className="server-wake-content">
              <strong>Servidor em nuvem acordando</strong>
              <p>
                Como a API está hospedada no plano gratuito do Render, o servidor hiberna após 15 min de inatividade e pode levar até ~45 segundos para inicializar.
              </p>
              <div className="server-wake-progress-bar">
                <div className="server-wake-progress-fill" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
