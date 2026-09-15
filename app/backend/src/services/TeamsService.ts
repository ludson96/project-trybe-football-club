import prisma from '../database/client';

export default class TeamsService {
  constructor(private _prisma = prisma) { }

  public getAllTeams = async () => this._prisma.team.findMany();

  public getTeamById = async (id: number) => this._prisma.team.findUnique({
    where: { id },
  });
}
