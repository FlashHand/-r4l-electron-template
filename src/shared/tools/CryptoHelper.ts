import crypto from 'crypto'

class CryptoHelper {
	public static sha1(text: string) {
		const sha1 = crypto.createHash('sha1')
		sha1.update(text)
		return sha1.digest('hex')
	}
}

export default CryptoHelper
