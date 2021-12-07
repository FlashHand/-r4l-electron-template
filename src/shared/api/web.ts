import qs from 'qs'
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import logger from '../logger'
import store, {GlobalMutations, LoginMutations} from '@/renderers/invoice/store'

// WebAPI is only used for invoice website ajax jsonp request
export enum WebErrorKey {
	IlegalToken = '111',
	InvalidToken = 'w4000000',
	NoAuthority = 'w4000002',
	Timeout = 'w4000004'
}

export default class WebAPI {

	protected instance: AxiosInstance
	protected version: string // web api version always equal to ymbb

	constructor(baseURL: string, version: string) {
		this.version = version

		this.instance = axios.create({
			baseURL,
			withCredentials: true,
			headers: {
				'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
				'X-Requested-With': 'XMLHttpRequest',
				'Acess-Control-Allow-Origin': '*',
				'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Pragma': 'no-cache',
				'Server': 'gwwebs',
			},
			method: 'POST',
		})

		this.instance.interceptors.response.use(
			response => {
				response.data = this.serializeJSON(response.data)
				if (typeof response.data == 'object') {
					if (response.data.key1 === WebErrorKey.InvalidToken ||
						response.data.key1 === WebErrorKey.NoAuthority ||
						response.data.key1 === WebErrorKey.Timeout ||
						response.data.key1 === WebErrorKey.IlegalToken
					) {
						if (response.data.key1 === WebErrorKey.InvalidToken || response.data.key1 === WebErrorKey.IlegalToken) {
							store.commit(GlobalMutations.TokenInvalid, true)
							store.commit(LoginMutations.ToggleLoginConfirm)
							throw response.data.key1
						}
						logger.error('web-api-error', response.request.responseURL, response.data)
						throw response.data.key1
					}
				}
				return response.data
			},
			error => Promise.reject(error)
		)
	}

	protected async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
		const res = await this.instance.post<T>(url, qs.stringify(data), config)
		return res as any
	}

	protected async download(url: string, data: any): Promise<Buffer> {
		const res: any = await this.instance({
			url,
			method: 'POST',
			responseType: 'blob',
			data: qs.stringify(data)
		})
		if ('key1' in res) {
			throw res.key2
		}
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => {
				resolve(Buffer.from(reader.result as ArrayBuffer))
			}
			reader.onerror = (err) => {
				reject(err)
			}
			reader.readAsArrayBuffer(res as any)
		})
	}

	protected serializeJSON(jsonp: any) {
		if (typeof jsonp == 'string') {
			return JSON.parse(jsonp.replace(/null\(|\)/gi, ''))
		}
		return jsonp
	}
}
