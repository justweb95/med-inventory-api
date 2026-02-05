import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import medicationsRouter from './routes/medications';
import transactionsRouter from './routes/transactions';
import auditLogRouter from './routes/auditLog';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/medications', medicationsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/audit-log', auditLogRouter);

app.use(errorHandler);

export default app;
