import express from 'express';
import * as LogController from '../../controllers/logs';
import * as LogValidation from '../../validations/logs';
import * as RateLimitMiddleware from '../../middlewares/rateLimit';

const router = express.Router();

// Download log file
router.get(
  '/:category/download',
  RateLimitMiddleware.rateLimiterMiddleware,
  LogValidation.validateDownloadLog,
  LogController.getLogFile,
);

export default router;