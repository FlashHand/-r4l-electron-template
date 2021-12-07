import pkg from '@root/package.json'

interface Package {
	name: string
	version: string
	description: string
}

const packageInfo: Package = pkg
export default packageInfo