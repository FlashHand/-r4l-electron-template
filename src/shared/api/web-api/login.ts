import { ALG } from '../local-api/certificate'
import WebAPI from '../web'

interface LoginForm {
    clientHello: string
    alg: ALG
}

interface LoginResponse {
    key1: string
    key2: string // serverHello
    key3: string // serverRandom
}

interface MMType {
    page: string
    ts: number
}

interface AuthLoginForm {
    clientAuthCode: string
    serverRandom: string
    alg: ALG
    password: string
    cert: string
}

interface AuthLoginResponse {
    key1: string // status
    key2: string // token
    key3: string // nsrmc company name
    key4: string // dqrq
    key5: string // wdqbz
    timestamp: string
}

interface qrgycxForm {
    cert: string
    token: string
}

export default class LoginAPI extends WebAPI {

	constructor(baseURL: string, version: string) {
		super(baseURL, version)
	}
	// obtain serverHello and serverRandom
	public async firstLogin(form: LoginForm): Promise<LoginResponse> {
		const res: any = await this.post(
			'/NSbsqWW/login.do',
			{
				type: 'CLIENT-HELLO',
				...form,
				ymbb: this.version,
			}
		)
		return this.serializeJSON(res)
	}

	public async queryMmtype(cert: string): Promise<MMType> {
		const res: any = await this.post(
			'/NSbsqWW/querymm.do',
			{
				cert,
				funType: '01'
			}
		)
		return this.serializeJSON(res)
	}

	public async authLogin(form: AuthLoginForm): Promise<AuthLoginResponse> {
		const res: any = await this.post(
			'/NSbsqWW/login.do',
			{
				type: 'CLIENT-AUTH',
				ymbb: this.version,
				currdate: Date.now(),
				...form
			}
		)
		const loginRes: AuthLoginResponse = this.serializeJSON(res)
		if (loginRes.key1 == '03') {
			loginRes.key3 = decodeURI(loginRes.key3)
		}
		return loginRes
	}

	public async qrgycx(form: qrgycxForm) {
		const res: any = await this.post(
			'/NSbsqWW/qrgycx.do',
			{
				id: 'cxcxfprz',
				ymbb: this.version,
				...form
			}
		)
		return this.serializeJSON(res)
	}

}

