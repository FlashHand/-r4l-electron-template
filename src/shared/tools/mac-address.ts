import getMac from 'getmac'
class Mac {

	private mac?: string

	public get(): string {
		if (this.mac) {
			return this.mac
		}
		this.mac = getMac().toUpperCase().replace(/:/gi, '-')
		return this.mac
	}

}

export const mac = new Mac()