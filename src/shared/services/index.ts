import { Client } from 'pg';
import {Injectable} from "@nestjs/common";
import * as process from "process";

@Injectable()
export class DBConnectionService {

    async runQuery(query: string) {
        console.log('DBConnectionService: ', query);

        try {
            const client = new Client({
                host: 'rds-instance-1.clbtbdynueca.us-east-1.rds.amazonaws.com',
                port: 5432,
                database: 'postgres',
                user: process.env.dbLogin,
                password: process.env.dbPassword,
            })

            await client.connect((err) => {
                if (err) {
                    console.error('connection error', err.stack)
                } else {
                    console.log('connected')
                }
            })

            const res = await client.query(query)
            await client.end();

            return res.rows;
        } catch (error) {
            console.log(error);
        }
    }
}
