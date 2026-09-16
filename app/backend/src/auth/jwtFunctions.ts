import * as jwt from 'jsonwebtoken';
import ILogin from '../interfaces/ILogin';

export default class JWT {
  private _secret: string;
  private _jwtConfig: object;

  constructor() {
    this._secret = 'jwt_secret';
    this._jwtConfig = {
      algorithm: 'HS256',
      expiresIn: '7d',
    };
  }

  public createToken(payload: ILogin) {
    const token = jwt.sign({ data: payload }, this._secret, this._jwtConfig);
    return token;
  }
}
