import {rysClient} from '@/shared/networking/clients';

interface FetchTokenReq {
	khsh: string,
	tokenInvalidFlag: number;
}

const fetchToken = (params: FetchTokenReq) => {
	return rysClient.createPostJSON('/irc/token/invalid', params);
}
export default {
	fetchToken
}
