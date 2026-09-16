import React from 'react';
import { ITeam } from '../types';

interface TeamOptionProps {
  teams: ITeam[];
  homeTeam: boolean;
  getTeam: (teamName: string, homeOrAway: 'homeTeam' | 'awayTeam') => void;
  testId: string;
  setTeams?: React.Dispatch<React.SetStateAction<ITeam[]>>;
  selectedTeam?: string;
}

const TeamOption: React.FC<TeamOptionProps> = ({ teams, homeTeam, getTeam, testId, selectedTeam }) => (
  <label htmlFor={ (homeTeam) ? 'home-team-scoreboard' : 'away-team-scoreboard' }>
    { (homeTeam) ? <p>Time Mandante</p> : <p>Time Visitante</p> }
    <select
      data-testid={ testId }
      value={ selectedTeam }
      onChange={ ({ target: { value } }) => {
        const homeOrAway = (homeTeam) ? 'homeTeam' : 'awayTeam';
        getTeam(value, homeOrAway);
      } }
    >
      {
        teams.map(({ teamName }, index) => (
          <option key={ index } value={ teamName }>{ teamName }</option>
        ))
      }
    </select>
  </label>
);

export default TeamOption;
