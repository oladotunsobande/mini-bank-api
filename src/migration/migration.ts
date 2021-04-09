import fs from 'fs';
import appRoot from 'app-root-path';
import { logger } from '../util/logger';
import CustomerRepository from '../repositories/CustomerRepository';

async function run() {
  const data = fs.readFileSync(`${appRoot}/src/migration/customers.json`, 'utf8');
  const customers = JSON.parse(data);

  const count = await CustomerRepository.count();
  if (count == 0) {
    await CustomerRepository.createMany(customers);
    logger.info('Migration of customers successful!');
  }
}

run();