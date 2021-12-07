import {rysClient} from '@/shared/networking/clients';
// import ReqInvoiceSave from '@/shared/networking/req/irc/dkInvoice/ReqInvoiceSave';
const save = (params: any) => {
	return rysClient.createPostJSON('/irc/dkInvoice/save', params);
}
const uploadDownloaded = (params: any)=>{
	return rysClient.createPostJSON('/irc/dkInvoice/downloaddeal', params);
}
export default {
	save,
	uploadDownloaded
}
