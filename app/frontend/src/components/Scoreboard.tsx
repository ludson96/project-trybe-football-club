import React from 'react';

interface ScoreboardProps {
  homeTeam: boolean;
  score?: number | string;
  setScore: (score: string | number) => void;
  qtyGoal?: number | string;
  testId: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ homeTeam, score, setScore, qtyGoal, testId }) => (
  <label htmlFor={ (homeTeam) ? 'home-team-scoreboard' : 'away-team-scoreboard' }>
    <p>Gols</p>
    <input
      data-testid={ testId }
      type="number"
      min="0"
      value={ score }
      onChange={ ({ target: { value } }) => {
        if (qtyGoal !== undefined && Number(value) < Number(qtyGoal)) {
          setScore(qtyGoal);
        } else {
          setScore(value);
        }
      } }
    />
  </label>
);

export default Scoreboard;
