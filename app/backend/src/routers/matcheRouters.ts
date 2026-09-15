import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import validateJwt from '../auth/validateJwt';

const router = Router();

const matchesController = new MatchesController();

router.get('/', matchesController.getMatches);

router.post('/', validateJwt.validateToken, matchesController.createMatche);

router.patch('/:id', matchesController.updateMatche);

router.patch('/:id/finish', matchesController.finish);

export { matchesController };
export default router;
