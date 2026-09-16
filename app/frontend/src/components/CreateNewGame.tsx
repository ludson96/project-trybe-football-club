import React, { useState } from 'react';
import TeamOption from './TeamOption';
import Scoreboard from './Scoreboard';
import { ITeam } from '../types';

interface CreateNewGameProps {
  teams: ITeam[];
  setTeams?: React.Dispatch<React.SetStateAction<ITeam[]>>;
  getTeam: (teamName: string, homeOrAway: 'homeTeam' | 'awayTeam') => void;
  homeTeamScoreboard?: string;
  setHomeTeamScoreboard: (score: string | number) => void;
  awayTeamScoreboard?: string;
  setAwayTeamScoreboard: (score: string | number) => void;
  createMatch: () => Promise<any>;
  finishMatch: (id: number) => Promise<void>;
}

const CreateNewGame: React.FC<CreateNewGameProps> = ({
  teams,
  setTeams,
  getTeam,
  homeTeamScoreboard = '0',
  setHomeTeamScoreboard,
  awayTeamScoreboard = '0',
  setAwayTeamScoreboard,
  createMatch,
  finishMatch,
}) => {
  const notCreated = 'not-created';
  const [inProgress, setInProgress] = useState(notCreated);
  const [createdMatch, setCreatedMatch] = useState<any>(notCreated);

  return (
    <section className="match-settings-section">
      <form className="match-settings-form">
        <div className="match-settings-form-options">
          <TeamOption
            testId="insertion_matches__select_home_team"
            teams={ teams }
            setTeams={ setTeams }
            homeTeam
            getTeam={ getTeam }
          />
          <Scoreboard
            testId="insertion_matches__select_quantity_goals_home_team"
            homeTeam
            score={ homeTeamScoreboard }
            setScore={ setHomeTeamScoreboard }
          />
          <div className="match-settings-form-versus">
            <span />
            <span>X</span>
          </div>
          <Scoreboard
            testId="insertion_matches__select_quantity_goals_away_team"
            homeTeam={ false }
            score={ awayTeamScoreboard }
            setScore={ setAwayTeamScoreboard }
          />
          <TeamOption
            testId="insertion_matches__select_away_team"
            teams={ teams }
            setTeams={ setTeams }
            homeTeam={ false }
            getTeam={ getTeam }
          />
        </div>
        <div className="match-settings-form-buttons">
          <button
            data-testid="insertion_matches__save_match_btn"
            onClick={ async () => {
              const body = await createMatch();
              setCreatedMatch(body);
              setInProgress('In-Progress');
            } }
            type="button"
            disabled={ (inProgress !== notCreated) }
          >
            Salvar Partida
          </button>
          <button
            data-testid="insertion_matches__finish_match_btn"
            onClick={ () => { finishMatch(createdMatch.id); } }
            type="button"
            disabled={ (inProgress === notCreated) }
          >
            Finalizar Partida
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateNewGame;
