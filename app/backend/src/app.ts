import express, { Express } from 'express';
import cors from 'cors';
import userRouter from './routers/userRoutes';
import teamsRouter from './routers/teamsRoutes';
import matchesRouter from './routers/matcheRouters';
import leaderboardRouter from './routers/leaderboardRouters';

class App {
  public app: Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));

    this.app.use('/login', userRouter);

    this.app.use('/teams', teamsRouter);

    this.app.use('/matches', matchesRouter);

    this.app.use('/leaderboard', leaderboardRouter);
  }

  private config():void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
