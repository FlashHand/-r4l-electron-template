interface CompanyInfo {
	areaCode: string;
	areaId: number // 地区id
	certificatePassword: string // 证书密码
	companyId: number // 企业id
	khsh: string // 客户税号
	tokenInvalidFlag: number // token失效标识 0：未失效；1：失效
}

export default CompanyInfo;
