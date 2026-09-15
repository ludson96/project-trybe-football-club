import prisma from '../database/client';
import { IPontos, IPartida, ITeam, ILeader } from '../interfaces/IMatche';

export default class LeaderboardService {
  constructor(private _prisma = prisma) { }

  public async getLeaderBoardLocal(local: 'home' | 'away') {
    const allTeams = await this._prisma.team.findMany();

    const allMatche = allTeams.map(async (team: ITeam) => this.getTeamMatches(team, local));

    const board = await Promise.all(allMatche);

    return LeaderboardService.rank(board);
  }

  public async getLeaderboard() {
    const allTeams = await this._prisma.team.findMany();

    const matchesHome = allTeams.map(async (t: ITeam) => this.getTeamMatches(t, 'home'));
    const matchesAway = allTeams.map(async (t: ITeam) => this.getTeamMatches(t, 'away'));

    const allMatchesHome = await Promise.all(matchesHome);
    const allMatchesAway = await Promise.all(matchesAway);

    const points = LeaderboardService.orgaPontos(allMatchesHome, allMatchesAway);

    return LeaderboardService.rank(points);
  }

  private static orgaPontos(matcheHome: ILeader[], matcheAway: ILeader[]) {
    return matcheHome.map((h) => {
      const away = matcheAway.filter(({ name }) => name === h.name);

      const efficiency = LeaderboardService
        .eficiencia((h.totalPoints + away[0].totalPoints), (h.totalGames + away[0].totalGames));

      return LeaderboardService.sumPoints(h, away, efficiency);
    });
  }

  private static sumPoints(h: ILeader, away: ILeader[], efficiency: string) {
    return {
      name: h.name,
      totalPoints: h.totalPoints + away[0].totalPoints,
      totalGames: h.totalGames + away[0].totalGames,
      totalVictories: h.totalVictories + away[0].totalVictories,
      totalDraws: h.totalDraws + away[0].totalDraws,
      totalLosses: h.totalLosses + away[0].totalLosses,
      goalsFavor: h.goalsFavor + away[0].goalsFavor,
      goalsOwn: h.goalsOwn + away[0].goalsOwn,
      goalsBalance: h.goalsBalance + away[0].goalsBalance,
      efficiency,
    };
  }

  private async getTeamMatches(team: ITeam, local: 'home' | 'away') {
    const where = local === 'home' ? { homeTeamId: team.id } : { awayTeamId: team.id };
    const matches = await this._prisma.match.findMany({
      where: { ...where, inProgress: false },
    });
    return LeaderboardService.buildTeamStats(team.teamName, matches, local);
  }

  private static buildTeamStats(name: string, matches: IPartida[], local: 'home' | 'away') {
    const pontos = matches.map(LeaderboardService.calculatePoints);
    const totalPoints = LeaderboardService.pontosTotais(pontos, local);
    const totalGames = matches.length;
    return {
      name,
      totalPoints,
      totalGames,
      ...LeaderboardService.resultadoPartidas(pontos, local),
      ...LeaderboardService.statsGoals(matches, local),
      efficiency: LeaderboardService.eficiencia(totalPoints, totalGames),
    };
  }

  private static calculatePoints({ homeTeamGoals, awayTeamGoals }: IPartida) {
    if (homeTeamGoals > awayTeamGoals) return { homeTeam: 3, awayTeam: 0, win: 'home' };
    if (homeTeamGoals < awayTeamGoals) return { homeTeam: 0, awayTeam: 3, win: 'away' };
    return { homeTeam: 1, awayTeam: 1, win: 'draw' };
  }

  private static pontosTotais(pontos: IPontos[], local: 'home' | 'away') {
    return pontos.reduce((a, b) => a + b[`${local}Team`], 0);
  }

  private static resultadoPartidas(pontos: IPontos[], local: 'home' | 'away') {
    const oponente = local === 'home' ? 'away' : 'home';
    const totalVictories = pontos.filter(({ win }) => win === local);
    const totalDraws = pontos.filter(({ win }) => win === 'draw');
    const totalLosses = pontos.filter(({ win }) => win === oponente);

    return {
      totalVictories: totalVictories.length,
      totalDraws: totalDraws.length,
      totalLosses: totalLosses.length,
    };
  }

  private static statsGoals(matches: IPartida[], local: 'home' | 'away') {
    const oponente = local === 'home' ? 'away' : 'home';

    const goalsFavor = matches.length
      ? matches.map((match) => match[`${local}TeamGoals`]).reduce((a, b) => a + b)
      : 0;

    const goalsOwn = matches.length
      ? matches.map((match) => match[`${oponente}TeamGoals`]).reduce((a, b) => a + b)
      : 0;

    const goalsBalance = goalsFavor - goalsOwn;

    return { goalsFavor, goalsOwn, goalsBalance };
  }

  private static eficiencia(pontosTotais: number, totalGames: number) {
    if (totalGames === 0) return '0.00';
    return ((pontosTotais / (totalGames * 3)) * 100).toFixed(2);
  }

  private static rank(times: ILeader[]) {
    return times.sort((a, b) =>
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn);
  }
}
