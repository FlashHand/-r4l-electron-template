import ServerAPI from '../server'

class BaseInfoAPI extends ServerAPI {

	public async getAreaList(): Promise<Area[]> {
		return this.post('/extractInvoice/getAreaList', { areaName: '' })
	}

	public async getCompanyInfo(khsh: string): Promise<CompanyInfo> {
		return this.post<CompanyInfo>('/extractInvoice/getCompanyInfo', { khsh })
	}

	public async saveCompanyInfo(form: CompanyForm): Promise<void> {
		return this.post('/extractInvoice/saveCompanyInfo', form)
	}

	public async tokenInvalid(khsh: string, tokenInvalidFlag: number): Promise<any> {
		return this.post('/token/invalid', { khsh, tokenInvalidFlag })
	}
}

export interface CompanyForm {
	areaId: number,
	certificatePassword: string,
	khsh: string
}

export interface CompanyInfo {
	areaId: number // 地区id
	certificatePassword: string // 证书密码
	companyId: number // 企业id
	khsh: string // 客户税号
	tokenInvalidFlag: number // token失效标识 0：未失效；1：失效
}

export interface Area {
	areaId: number
	areaName: string
	dkLoginUrl: string
}

export const baseInfoAPI = new BaseInfoAPI()
