import React from 'react';
import { useNavigate } from 'react-router-dom';
import { negativeLogo, exitToAppImg } from '../images';
import '../styles/components/header.css';

interface HeaderProps {
  page: string;
  FirstNavigationLink: React.ComponentType;
  SecondNavegationLink?: React.ComponentType;
  logged?: boolean;
  setLogin?: (logged: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  page,
  FirstNavigationLink,
  SecondNavegationLink,
  logged,
  setLogin,
}) => {
  const navigate = useNavigate();

  const logoff = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    if (setLogin) setLogin(false);
    navigate('/leaderboard');
  };

  return (
    <header className="common-header">
      <div className="image-content">
        <img src={ negativeLogo } alt="Futebol Clube Logo" />
      </div>
      <h1 data-testid="header__title">{ page }</h1>
      <div className="buttons-content">
        <FirstNavigationLink />
        {
          (logged)
            ? (
              <button type="button" onClick={ () => logoff() }>
                Sair
                <img src={ exitToAppImg } alt="Sair do aplicativo" />
              </button>
            )
            : SecondNavegationLink && <SecondNavegationLink />
        }
      </div>
    </header>
  );
};

export default Header;
