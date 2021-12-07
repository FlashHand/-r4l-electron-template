import {localClient} from '@/shared/networking/clients';
import ReadCertReq from '@/shared/networking/req/local/ReadCertReq';
import ReadComReq from '@/shared/networking/req/local/ReadComReq';
import ReadCertRes from '@/shared/networking/res/local/ReadCertRes';
import ReadComRes from '@/shared/networking/res/local/ReadComRes';
import ALG from '@/renderers/invoice/stores/enums/ALG';
interface ClientHello {
	code: number
	msg: string
	clientHello: string // 税号
}
interface ClientAuthForm {
	fpdkServerHello: string
	password: string
	alg: ALG
}
interface ClientAuthRes {
	code: string
	msg: string
	clientAuth: string
}
/**
 * @desc 读取税号
 * @param {ReadCertReq} params
 */
const readCertInfo = (params:ReadCertReq):Promise<ReadCertRes>=>{
	return localClient.createPostJSON('/api/readCertInfo',params);
}
/**
 * 读取公司名称
 * @param {ReadComReq} params
 */
const readCompanyName = (params:ReadComReq):Promise<ReadComRes>=>{
	return localClient.createPostJSON('/api/readCertInfo',params);
}
const  clientHello = (alg: ALG): Promise<ClientHello> =>{
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
	return localClient.createPostJSON('/api/clientHello',params);
}
//把从服务端拿到的凭证fpdkServerHello传给28000
const clientAuth = (form: ClientAuthForm):Promise<ClientAuthRes>=>{
	const params = form.alg == ALG.normal ?
		{
			password: form.password,
			serverHello: form.fpdkServerHello,
			dwProvType: 1
		} :
		{
			password: form.password,
			serverHello: form.fpdkServerHello,
			dwProvType: 2050,
			strContainer: '//SM2/SM2CONTAINER0002'
		}
	return localClient.createPostJSON('/api/clientAuth',params);
}
export default {
	readCertInfo,
	readCompanyName,
	clientHello,
	clientAuth
}
