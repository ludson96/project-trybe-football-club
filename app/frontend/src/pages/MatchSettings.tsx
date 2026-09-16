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

  const createMatch = async () => {
    const body = {
      homeTeamId,
      awayTeamId,
      homeTeamGoals: Number(homeTeamScoreboard),
      awayTeamGoals: Number(awayTeamScoreboard),
    };

    const { data } = await api.post<IMatch>('/matches', body);
    return data;
  };

  const updateMatch = async (id: number, updateGoals: { homeTeamGoals: number | string; awayTeamGoals: number | string }) => {
    await api.patch(`/matches/${id}`, {
      homeTeamGoals: Number(updateGoals.homeTeamGoals),
      awayTeamGoals: Number(updateGoals.awayTeamGoals),
    });
  };

  const finishMatch = async (id: number) => {
    await api.patch(`/matches/${id}/finish`);
  };

  if (!isAuthenticated) return <Loading />;

  const locationState = location.state as LocationStateMatch | null;

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
