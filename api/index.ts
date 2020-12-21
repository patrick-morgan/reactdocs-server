import { NowRequest, NowResponse } from '@vercel/node';

import { MongoClient } from 'mongodb';
import getDBConnection from '../db';

export default async (req: NowRequest, res: NowResponse) => {
    const db = await getDBConnection();
    const cursor = await db.collection("docs").find();
    if (await cursor.count() == 0) {
        res.send({
            success: false
        });
    } else {
        // Re-format json data
        const data = await cursor.toArray();
        const docs = {};
        for (const { name, link, docstring } of data) {
            docs[name] = { link, docstring };
        }
        res.send({
            success: true,
            data: docs
        });
    }
};
