import mongo from 'mongodb';
import * as models from '../models';

export async function deleteCollections(db: mongo.Db): Promise<void[]> {
  return Promise.all(
    Object.values(db.collections).map((coll) => coll.deleteMany()),
  );
}

export async function createAllIndexes(): Promise<void[]> {
  return Promise.all([
    models.Account.createIndexes(),
    models.Transaction.createIndexes(),
    models.Customer.createIndexes(),
  ]);
}
