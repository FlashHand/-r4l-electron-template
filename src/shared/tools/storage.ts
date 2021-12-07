import { Certificate, Company } from '@/shared/api/local-api/certificate'
import { Area } from '../api/server-api/base-info'

type StorageKey = 'token' | 'cert' | 'company' | 'area' | 'autoExtract'
class Storage {
	private token?: string
	private cert?: Certificate
	private company?: Company
	private area?: Area
	public setCert(cert: Certificate) {
		this.cert = cert
		this.set('cert', JSON.stringify(cert))
	}

	public setToken(token: string) {

		this.token = token
		this.set('token', token)
	}

	public setCompany(company: Company) {

		this.company = company
		this.set('company', JSON.stringify(company))
	}

	public setArea(area: Area) {

		this.area = area
		this.set('area', JSON.stringify(area))
	}

	public setAutoExtract(autoExtract: boolean) {
		this.set('autoExtract', JSON.stringify(autoExtract))
	}

	public getArea(): Area | undefined {

		if (this.area) {
			return this.area
		}
		const areaStr = this.get('area')
		if (areaStr != null) {
			return JSON.parse(areaStr)
		}
	}

	public getToken(): string | null {

		if (this.token) {
			return this.token
		}
		return this.get('token')
	}

	public getCert(): Certificate | undefined {

		if (this.cert) {
			return this.cert
		}
		const certStr = this.get('cert')
		if (certStr != null) {
			return JSON.parse(certStr)
		}
	}

	public getCompany(): Company | undefined {

		if (this.company) {
			return this.company
		}
		const companyStr = this.get('company')
		if (companyStr != null) {
			return JSON.parse(companyStr)
		}
	}

	public getAutoExtract(): boolean {
		const companyStr = this.get('autoExtract')
		if (companyStr != null) {
			return JSON.parse(companyStr)
		}
		return true
	}

	public clear() {
		localStorage.clear()
	}


	private set(key: StorageKey, value: string) {
		localStorage.setItem(key, value)
	}

	private get(key: StorageKey): string | null {
		return localStorage.getItem(key)
	}
}

const storage = new Storage()

export default storage
