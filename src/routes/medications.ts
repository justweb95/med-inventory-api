import { Router } from 'express';
import { getMedications, getMedication } from '../controllers/medicationController';

const router = Router();

router.get('/', getMedications);
router.get('/:id', getMedication);

export default router;
