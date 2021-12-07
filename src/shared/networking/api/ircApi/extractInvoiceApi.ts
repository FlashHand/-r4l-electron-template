import {ResClass, rysClient} from '@/shared/networking/clients';
import {Area, CompanyForm} from '@/shared/api/server-api/base-info';

interface GetCompanyReq {
	khsh: string
}

const getCompanyInfo = (params: GetCompanyReq) => {
	return rysClient.createPostJSON('/irc/extractInvoice/getCompanyInfo', params);
}
const getAreaList = (): Promise<ResClass<Area[]>> => {
	return rysClient.createPostJSON('/irc/extractInvoice/getAreaList', {areaName: ''});
}
const saveCompanyInfo = (params:CompanyForm): Promise<ResClass<[Area?]>> => {
	return rysClient.createPostJSON('/irc/extractInvoice/saveCompanyInfo', params);
}
// /irc/extractInvoice/getCompanyInfo
export default {
	getCompanyInfo,
	getAreaList,
	saveCompanyInfo
}
