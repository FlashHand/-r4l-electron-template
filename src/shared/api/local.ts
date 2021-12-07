import { Agent } from 'https'
import axios, { AxiosInstance } from 'axios'

export default class LocalAPI {

	private agent: Agent

	protected instance: AxiosInstance

	constructor() {

		this.agent = new Agent({ rejectUnauthorized: false })

		this.instance = axios.create({
			baseURL: 'https://127.0.0.1:28000',
		})

		this.instance.interceptors.request.use(
			config => {
				return config
			},
			error => Promise.reject(error)
		)

		this.instance.interceptors.response.use(
			response => {
				if (response.data.code !== 0) {
					throw response.data.msg
				}
				return response
			},
			error => Promise.reject(error)
		)

	}

	protected async post<T>(url: string, data: any): Promise<T> {
		const res = await this.instance.post<T>(url, data, { httpsAgent: this.agent })
		return res.data
	}

	protected async get<T>(url: string): Promise<T> {
		const res = await this.instance.get<T>(url, { httpsAgent: this.agent })
		return res.data
	}

}
