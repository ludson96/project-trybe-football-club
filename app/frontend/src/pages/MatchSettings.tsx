import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateNewGame from '../components/CreateNewGame';
import EditGame from '../components/EditGame';
import Header from '../components/Header';
import MatchesBtn from '../components/MatchesBtn';
import Loading from '../components/Loading';
import api, { requestData, setToken } from '../services/requests';
import { ITeam, IMatch } from '../types';
import '../styles/pages/matchSettings.css';

interface LocationStateMatch {
  id: number;
  homeTeam: ITeam;
  homeTeamGoals: number | string;
  awayTeam: ITeam;
  awayTeamGoals: number | string;
  inProgress: boolean;
}

const MatchSettings: React.FC = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [homeTeamScoreboard, setHomeTeamScoreboard] = useState<string | number>('0');
  const [awayTeamScoreboard, setAwayTeamScoreboard] = useState<string | number>('0');
  const [homeTeamId, setHomeTeamId] = useState<number>(0);
  const [awayTeamId, setAwayTeamId] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token') || '';

      if (!token) return navigate('/');

      setToken(token);

      requestData('/login/validate')
        .then(() => setIsAuthenticated(true))
        .catch(() => navigate('/'));
    })();
  }, [navigate]);

  useEffect(() => {
    const endpoint = '/teams';

    const token = localStorage.getItem('token') || '';
    if (token !== '') {
      setToken(token);
    }
    if (!teams.length) {
      requestData<ITeam[]>(endpoint)
        .then((response) => {
          setTeams(response);
        })
        .catch((error) => console.log(error));
    }
  }, [teams.length]);

  const getTeam = (team: string, homeOrAway: 'homeTeam' | 'awayTeam') => {
    const foundTeam = teams.find(({ teamName }) => teamName === team);
    if (foundTeam) {
      if (homeOrAway === 'homeTeam') {
        setHomeTeamId(foundTeam.id);
      } else {
        setAwayTeamId(foundTeam.id);
      }
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Processando...');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToastAndRedirect = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      navigate('/matches');
    }, 1800);
  };

  const createMatch = async () => {
    setIsLoading(true);
    setLoadingMessage('Criando nova partida...');
    try {
      const body = {
        homeTeamId,
        awayTeamId,
        homeTeamGoals: Number(homeTeamScoreboard),
        awayTeamGoals: Number(awayTeamScoreboard),
      };

      const { data } = await api.post<IMatch>('/matches', body);
      setIsLoading(false);
      showToastAndRedirect('Partida criada com sucesso!', 'success');
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setToast({ message: 'Erro ao criar partida.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      throw error;
    }
  };

  const updateMatch = async (id: number, updateGoals: { homeTeamGoals: number | string; awayTeamGoals: number | string }) => {
    setIsLoading(true);
    setLoadingMessage('Atualizando placar...');
    try {
      await api.patch(`/matches/${id}`, {
        homeTeamGoals: Number(updateGoals.homeTeamGoals),
        awayTeamGoals: Number(updateGoals.awayTeamGoals),
      });
      setIsLoading(false);
      showToastAndRedirect('Partida editada com sucesso!', 'success');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setToast({ message: 'Erro ao atualizar a partida.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const finishMatch = async (id: number) => {
    setIsLoading(true);
    setLoadingMessage('Finalizando partida...');
    try {
      await api.patch(`/matches/${id}/finish`);
      setIsLoading(false);
      showToastAndRedirect('Partida finalizada com sucesso!', 'success');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setToast({ message: 'Erro ao finalizar a partida.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!isAuthenticated) return <Loading />;

  const locationState = location.state as LocationStateMatch | null;

  const renderFeedbackElements = () => (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="circular-spinner" />
          <p className="loading-text">{loadingMessage}</p>
        </div>
      )}
      {toast && (
        <div className={`floating-toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );

  if (locationState) {
    const {
      id,
      homeTeam: homeTeamState,
      homeTeamGoals,
      awayTeam: awayTeamState,
      awayTeamGoals,
    } = locationState;
    return (
      <>
        {renderFeedbackElements()}
        <Header
          page="EDITAR PARTIDA"
          FirstNavigationLink={ MatchesBtn }
          logged={ isAuthenticated }
          setLogin={ setIsAuthenticated }
        />
        <EditGame
          homeTeam={ [homeTeamState] }
          awayTeam={ [awayTeamState] }
          homeTeamGoals={ homeTeamGoals }
          awayTeamGoals={ awayTeamGoals }
          idMatch={ id }
          updateMatch={ updateMatch }
          finishMatch={ finishMatch }
          getTeam={ getTeam }
        />
      </>
    );
  }

  return (
    <>
      {renderFeedbackElements()}
      <Header
        page="ADICIONAR PARTIDA"
        FirstNavigationLink={ MatchesBtn }
        logged={ isAuthenticated }
        setLogin={ setIsAuthenticated }
      />
      <CreateNewGame
        setHomeTeamScoreboard={ setHomeTeamScoreboard }
        setAwayTeamScoreboard={ setAwayTeamScoreboard }
        homeTeamScoreboard={ String(homeTeamScoreboard) }
        awayTeamScoreboard={ String(awayTeamScoreboard) }
        teams={ teams }
        getTeam={ getTeam }
        createMatch={ createMatch }
        finishMatch={ finishMatch }
      />
    </>
  );
};

export default MatchSettings;
