import React, { useState, useEffect } from 'react';
import GamesTable from '../components/GamesTable';
import Header from '../components/Header';
import AddNewMatchBtn from '../components/AddNewMatchBtn';
import LeaderboardBtn from '../components/LeaderboardBtn';
import LoginBtn from '../components/LoginBtn';
import GameFilter from '../components/GameFilter';
import '../styles/pages/games.css';

const Games: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState('Status do Jogo');
  const [isAdm, setIsAdm] = useState(false);
  const [logged, setLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) setLogin(true);

    setIsAdm(role === 'admin');
  }, []);

  return (
    <>
      <Header
        page="PARTIDAS"
        FirstNavigationLink={ LeaderboardBtn }
        SecondNavegationLink={ LoginBtn }
        logged={ logged }
        setLogin={ setLogin }
      />
      <section className="games-section">
        <div className="games-handlers">
          <GameFilter
            currentFilter={ currentFilter }
            setCurrentFilter={ setCurrentFilter }
          />
          {
            (isAdm)
              ? <AddNewMatchBtn />
              : null
          }
        </div>
        <GamesTable currentFilter={ currentFilter } isAdm={ isAdm } />
      </section>
    </>
  );
};

export default Games;
