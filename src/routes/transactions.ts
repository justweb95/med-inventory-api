import { Router } from 'express';
import {
  getTransactions,
  postTransaction,
  validateCreateTransaction,
} from '../controllers/transactionController';

const router = Router();

router.get('/', getTransactions);
router.post('/', validateCreateTransaction, postTransaction);

export default router;
