import { connectDatabase, getDocuments } from "../../../src/utils/db-util";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed." });
    return;
  }

  if (req.method === "GET") {
    try {
      const documents = await getDocuments(
        client,
        "recipes",
        {},
        {
          name: 1,
        }
      );
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: "GET request failed." + error });
    }
  }

  client.close();
}

export default handler;
