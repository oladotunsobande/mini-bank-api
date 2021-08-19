import express from 'express';
import * as AccountController from '../../controllers/account';
import * as CustomerMiddleware from '../../middlewares/customer';
import * as AccountValidation from '../../validations/account';

const router = express.Router();

// Authentication and authorization
router.use(CustomerMiddleware.validateCustomerToken);

// Create account
router.post(
  '/create',
  AccountValidation.validateCreateAccount,
  AccountController.create,
);

// Get account balances
router.post(
  '/balances',
  AccountValidation.validateGetBalance,
  AccountController.getBalances,
);

// Transfer funds
router.post(
  '/transfer',
  AccountValidation.validateTransferFunds,
  AccountController.transfer,
);

export default router;