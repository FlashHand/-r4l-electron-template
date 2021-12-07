enum ALG {
	normal = 0,
	sm2 = 1
}
class ReadComReq{
	certInfoNo = 27;//读取税号的必填参数
	dwProvType: 2050 | 1;
	strContainer: '//SM2/SM2CONTAINER0002' | undefined;
	constructor(alg:ALG) {
		this.dwProvType = 1;
		this.strContainer = undefined;
		switch (alg){
			case ALG.normal:
				this.dwProvType = 1;
				break;
			case ALG.sm2:
				this.dwProvType = 2050;
				this.strContainer = '//SM2/SM2CONTAINER0002';
				break;
			default:
				break;
		}
	}
}

export default ReadComReq;

