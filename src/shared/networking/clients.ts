import {BasicClient, RysClient, client, ClientConfig} from 'r-networking';
// import env from '@/shared/tools/env';

export const localClient = new BasicClient({baseURL: 'https://127.0.0.1:28000'}, [], []);
const ircConfig:ClientConfig = {baseURL: process.env.API_ROOT, timeout: 120000}
if (process.env.TOKEN){
	ircConfig.headers! = {token: process.env.TOKEN}
}
export const rysClient = new RysClient(ircConfig, [], []);

export interface ResClass<T> {
	success: boolean;
	code: number;
	msg: string;
	data: T;
}




