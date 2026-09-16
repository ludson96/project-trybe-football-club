import React from 'react';
import { Link } from 'react-router-dom';

const LeaderboardBtn: React.FC = () => (
  <Link data-testid="header__show_classification_btn" to="/leaderboard">
    Classificação
  </Link>
);

export default LeaderboardBtn;
