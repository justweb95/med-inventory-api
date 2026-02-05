import { Router } from 'express';
import { getAuditLog } from '../controllers/auditLogController';

const router = Router();

router.get('/', getAuditLog);

export default router;
