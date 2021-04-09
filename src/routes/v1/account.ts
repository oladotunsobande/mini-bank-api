import express from 'express';
import * as AccountController from '../../controllers/account';
import * as CustomerMiddleware from '../../middlewares/customer';
import * as AccountValidation from '../../validations/account';

const router = express.Router();

// Create account
router.post(
  '/create',
  CustomerMiddleware.validateCustomerExistence,
  AccountValidation.validateCreateAccount,
  AccountController.create,
);

// Get account balances
router.post(
  '/balances',
  CustomerMiddleware.validateCustomerExistence,
  AccountValidation.validateGetBalance,
  AccountController.getBalances,
);

// Transfer funds
router.post(
  '/transfer',
  CustomerMiddleware.validateCustomerExistence,
  AccountValidation.validateTransferFunds,
  AccountController.transfer,
);

export default router;