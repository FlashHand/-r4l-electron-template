import {BasicClient} from 'r-networking';
import errHandler from '@/shared/networking/mws/local/invoiceHelper/errHandler';

const bc = new BasicClient({
	baseURL: 'http://api.ttshitu.com'
}, [], [errHandler]);
const ocrCode = (image: string, typeid='3') => bc.createPostJSON('/predict', {
	username:'rys_tjdm',
	password: 'Rpa_Ocr_Tjdm',
	image,
	typeid
});
const ocrCalc = (image: string) => bc.createPostJSON('/predict', {
	username:'rys_tjdm',
	password: 'Rpa_Ocr_Tjdm',
	image,
	typeid:'11',
	remark:'填写计算结果'
});
const ocrMatch = (image: string, typeid='21',remark?:string) => bc.createPostJSON('/predict', {
	username:'rys_tjdm',
	password: 'Rpa_Ocr_Tjdm',
	image,
	remark,
	typeid
});
const ocrDrag = (image: string,imageBack?:string,typeid='18') => bc.createPostJSON('/predict', {
	username:'rys_tjdm',
	password: 'Rpa_Ocr_Tjdm',
	image,
	imageBack,
	typeid
});

export default {
	ocrCode,
	ocrMatch,
	ocrDrag,
	ocrCalc

}
