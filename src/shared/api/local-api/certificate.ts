import LocalAPI from '../local'

export enum ALG {
	normal = 0,
	sm2 = 1
}

export interface Certificate {
	code: number
	msg: string
	certInfo: string // khsh|company
	alg: ALG
}

export type Company = Certificate

interface ClientAuthForm {
	serverHello: string
	password: string
	alg: ALG
}

interface ClientAuthResponse {
	code: string
	msg: string
	clientAuth: string
}

interface ClientHello {
	code: number
	msg: string
	clientHello: string // 税号
}

class CertificateAPI extends LocalAPI {

	public async getAPIVersion() {
		return this.post('/api/getVersion', { crosFlag: 0 })
	}

	public async verifyPIN(password: string): Promise<ALG> {
		const pinURL = '/api/verifyPin'
		try {
			await this.post(
				pinURL,
				{
					password,
					dwProvType: 2050,
					strContainer: '//SM2/SM2CONTAINER0002'
				}
			)
			return ALG.sm2
		} catch (e) {
			if (e.code == 805306370) {
				// 密码错误
				throw e
			}
			const res: any = await this.post(
				pinURL,
				{
					password,
					dwProvType: 1
				}
			)
			if (res.code == 0) {
				return ALG.normal
			}
			throw res
		}

	}

	public async tryGetCert(): Promise<Certificate> {
		let cert: Certificate
		let alg: ALG
		try {
			alg = ALG.sm2
			cert = await certificateAPI.getCert(alg)
		} catch (e) {
			alg = ALG.normal
			cert = await certificateAPI.getCert(alg)
		}
		cert.alg = alg
		return cert
	}

	private async getCert(alg: ALG): Promise<Certificate> {
		const readCertInfoURL = '/api/readCertInfo'
		const params = alg == ALG.normal ?
			{
				certInfoNo: 71,
				dwProvType: 1
			} :
			{
				certInfoNo: 71,
				dwProvType: 2050,
				strContainer: '//SM2/SM2CONTAINER0002'
			}
		return this.post(readCertInfoURL, params)
	}

	public async getCompany(alg: ALG): Promise<Company> {
		const readCertInfoURL = '/api/readCertInfo'
		const params = alg == ALG.normal ?
			{
				certInfoNo: 27,
				dwProvType: 1
			} :
			{
				certInfoNo: 27,
				dwProvType: 2050,
				strContainer: '//SM2/SM2CONTAINER0002'
			}
		return this.post(readCertInfoURL, params)
	}

	public async clientHello(alg: ALG): Promise<ClientHello> {
		const clientHelloURL = '/api/clientHello'
		const params = alg == ALG.normal ?
			{
				authType: 0,
				dwProvType: 1
			} :
			{
				authType: 0,
				dwProvType: 2050,
				strContainer: '//SM2/SM2CONTAINER0002'
			}
		return this.post(clientHelloURL, params)
	}

	public async clientAuthApi(form: ClientAuthForm): Promise<ClientAuthResponse> {
		const params = form.alg == ALG.normal ?
			{
				password: form.password,
				serverHello: form.serverHello,
				dwProvType: 1
			} :
			{
				password: form.password,
				serverHello: form.serverHello,
				dwProvType: 2050,
				strContainer: '//SM2/SM2CONTAINER0002'
			}
		return this.post('/api/clientAuth', params)
	}

}

export const certificateAPI = new CertificateAPI()
