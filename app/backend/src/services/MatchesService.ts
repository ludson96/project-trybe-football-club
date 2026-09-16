import prisma from '../database/client';
import IMatche, { IMatcheUpdated } from '../interfaces/IMatche';

export default class MatchesService {
  constructor(private _prisma = prisma) { }

  public async getMatches(inProgress: string | undefined): Promise<object[]> {
    let where;
    if (inProgress) {
      where = { inProgress: inProgress === 'true' };
    }

    const matches = await this._prisma.match.findMany({
      where,
      include: {
        homeTeam: { select: { teamName: true } },
        awayTeam: { select: { teamName: true } },
      },
    });

    return matches;
  }

  public async verifyTeam(homeTeamId: number, awayTeamId: number) {
    const homeTeam = await this._prisma.team.findUnique({ where: { id: homeTeamId } });
    const awayTeam = await this._prisma.team.findUnique({ where: { id: awayTeamId } });
    if (homeTeam && awayTeam) return false;
    return true;
  }

  public async createMatche(matche: IMatche) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = matche;
    if (homeTeamId === awayTeamId) {
      return { status: 422, message: 'It is not possible to create a match with two equal teams' };
    }
    const verify = await this.verifyTeam(homeTeamId, awayTeamId);
    if (verify) return { status: 404, message: 'There is no team with such id!' };

    const newMatch = await this._prisma.match.create({
      data: {
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals,
        inProgress: true,
      },
    });
    return { status: 201, message: newMatch };
  }

  public async finish(id: number) {
    await this._prisma.match.update({
      where: { id },
      data: { inProgress: false },
    });
  }

  public updateMatche = async ({ homeTeamGoals, awayTeamGoals }: IMatcheUpdated, id: number) =>
    this._prisma.match.update({
      where: { id },
      data: {
        homeTeamGoals: Number(homeTeamGoals),
        awayTeamGoals: Number(awayTeamGoals),
      },
    });
}
