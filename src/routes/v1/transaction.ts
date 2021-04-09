import express from 'express';
import * as TransactionController from '../../controllers/transaction';
import * as CustomerMiddleware from '../../middlewares/customer';
import * as TransactionValidation from '../../validations/transaction';

const router = express.Router();

// Get transactions
router.post(
  '/',
  CustomerMiddleware.validateCustomerExistence,
  TransactionValidation.validateGetTransactions,
  TransactionController.getTransactions,
);

export default router;