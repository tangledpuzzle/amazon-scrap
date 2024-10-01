// pages/api/Ips/[ip].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';
// Create a new MongoClient
const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI!);

async function connectToDatabase(): Promise<Db> {
  await client.connect();
  const db = client.db('TalkhealthAI');
  return db;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { ip },
  } = req;
  try {
    const db = await connectToDatabase();
    const chats = await db
      .collection('Chat')
      .find({ user_id: ip as string })
      .toArray();;

    res.status(200).json(chats.length/2);
  } catch (error) {
    res.status(500).json({ error: 'Unable to connect to database: '});
  }
}
