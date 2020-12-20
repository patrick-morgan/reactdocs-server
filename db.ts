import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://dev:${process.env.db_pass}@cluster0.xbsum.mongodb.net/reactdocs`;

let cachedDb = null;

export default async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = await client.db("reactdocs");

  cachedDb = db;
  return db;
}
