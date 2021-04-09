import * as CustomerMigration from './addDefaultCustomers';

async function runMigration() {
  await CustomerMigration.run();
}

runMigration();