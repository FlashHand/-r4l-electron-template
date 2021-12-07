import {AxiosResponse} from 'axios';
import {Message} from 'element-ui';
const fullfilled = (response: AxiosResponse) => {
	if (response.data.code == 0){
		return response;
	}else{
		const errMsg = response.data.msg || '异常错误';
		Message.error(errMsg);
		return Promise.reject(new Error(errMsg));
	}
}
const rejected = (error: Error) => {
	return error;
}
export default {fullfilled, rejected}
