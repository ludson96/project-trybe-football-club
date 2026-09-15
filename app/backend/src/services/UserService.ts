import * as bcrypt from 'bcryptjs';
import ILogin from '../interfaces/ILogin';
import prisma from '../database/client';
import JWT from '../auth/jwtFunctions';

const jwt = new JWT();

export default class UsersService {
  constructor(private _prisma = prisma) {}

  public async login(user: ILogin) {
    const { email, password } = user;

    const newLogin = await this._prisma.user.findUnique({ where: { email } });

    if (!newLogin) {
      return undefined;
    }
    const passwordValid = await bcrypt.compare(password, newLogin.password);

    if (!passwordValid) {
      return undefined;
    }

    const token = jwt.createToken(user);

    return token;
  }

  public async getRole(email: string) {
    const selectedUser = await this._prisma.user.findUnique({ where: { email } });

    if (!selectedUser) {
      return { type: undefined };
    }
    return { type: selectedUser.role };
  }
}
