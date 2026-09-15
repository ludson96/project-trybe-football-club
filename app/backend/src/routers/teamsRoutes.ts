import { Router } from 'express';
import TeamsController from '../controllers/TeamsController';

const router = Router();

const teamsController = new TeamsController();

router.get('/', teamsController.getAllTeams);

router.get('/:id', teamsController.getTeamById);

export { teamsController };
export default router;
