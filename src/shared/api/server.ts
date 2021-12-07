import axios, {AxiosInstance} from 'axios'
import logger from '../logger'
import env from '../tools/env'

export default abstract class ServerAPI {

	protected instance: AxiosInstance

	constructor() {
		const baseURL = `${process.env.API_ROOT}/irc`;


		// if (env.isProd) {
		// 	baseURL = 'https://uaa-gateway.rys.com/irc'
		// 	// baseURL = 'https://test2-uaa.rys.cn/irc'
		//
		// } else if (env.isPre) {
		// 	baseURL = 'https://pre-uaa.rys.com/irc'
		// } else {
		// 	baseURL = 'https://uaa-gateway.rys.com/irc'
		// }

		this.instance = axios.create({baseURL})
		this.instance.interceptors.request.use(
			config => {
				if (process.env.TOKEN){
					config.headers! = {token: process.env.TOKEN}
				}
				return config
			},
			error => Promise.reject(error)
		)
		this.instance.interceptors.response.use(
			response => {
				if (response.status != 200) {
					throw `http error: ${response.status}`
				}
				if (!response.data.success) {
					logger.warn('server-api-error', response.request.responseURL, response.data)
					throw response.data
				}
				return response.data
			},
			error => Promise.reject(error)
		)

	}

	protected async post<T>(url: string, data: any): Promise<T> {
		const res = await this.instance.post<T>(url, data)
		return res.data
	}

	protected async get<T>(url: string): Promise<T> {
		const res = await this.instance.get<T>(url)
		return res.data
	}

}
