import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  constructor(public userService = new UserService()) { }

  public login = async (req: Request, res: Response): Promise<object> => {
    const token = await this.userService.login(req.body);
    if (!token) {
      return res.status(401)
        .json({ message: 'Incorrect email or password' });
    }
    return res.status(200).json({ token });
  };

  public getRole = async (req: Request, res: Response) => {
    const { email } = req.body.user.data;
    const { type } = await this.userService.getRole(email);
    if (!type) {
      return res.status(401).json({ message: 'email incorreto' });
    }
    return res.status(200).json({ role: type });
  };
}
