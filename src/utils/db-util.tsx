import { MongoClient } from "mongodb";

export async function connectDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  return client;
}

export async function getDocuments(
  client: any,
  collection: any,
  find: any,
  sort: any
) {
  const db = client.db();

  const documents = await db
    .collection(collection)
    .find(find)
    .sort(sort)
    .toArray();

  return documents;
}
