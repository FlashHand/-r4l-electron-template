import aliOSS from 'ali-oss'
class OssHelper {
	private ossClient?: aliOSS
	private invoiceClient?: aliOSS

	public get client(): aliOSS {
		if (!this.ossClient) {
			this.ossClient = new aliOSS({
				region: 'region',
				accessKeyId: 'accessKeyId',
				accessKeySecret: 'accessKeySecret',
				bucket: 'bucket'
			})
		}
		return this.ossClient
	}

	public get invoice(): aliOSS {
		if (!this.invoiceClient) {
			this.invoiceClient = new aliOSS({
				region: 'region',
				accessKeyId: 'accessKeyId',
				accessKeySecret: 'accessKeySecret',
				bucket: 'accessKeySecret'
			})
		}
		return this.invoiceClient;
	}

	public async listDist(timeout?: number, maxKeys?: number): Promise<aliOSS.ObjectMeta[]> {
		const res = await this.client.list(
			{ 'prefix': 'desktop/asar/dist/', 'max-keys': maxKeys || 100 },
			{ timeout }
		)
		return res.objects
	}
}

const ossHelper = new OssHelper()
export default ossHelper
