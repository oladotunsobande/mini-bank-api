import express from 'express';
import * as CustomerController from '../../controllers/customer';
import * as CustomerMiddleware from '../../middlewares/customer';
import * as CustomerValidation from '../../validations/customer';
import * as RateLimitMiddleware from '../../middlewares/rateLimit';

const router = express.Router();

// Create customer
router.post(
  '/create',
  RateLimitMiddleware.rateLimiterMiddleware,
  CustomerValidation.validateCreateCustomer,
  CustomerController.create,
);

// Login
router.post(
  '/login',
  CustomerValidation.validateLogin,
  CustomerController.login,
);

// Authentication and authorization
router.use(CustomerMiddleware.validateCustomerToken);

// Get customer by account number
router.get(
  '/search',
  RateLimitMiddleware.rateLimiterMiddleware,
  CustomerValidation.validateGetCustomerByAccountNumber,
  CustomerController.getCustomerByAccountNumber,
);

export default router;