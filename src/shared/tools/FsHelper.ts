import fs from 'fs'
import path from 'path'

class FsHelper {
	public static mkdirsSync(dirname: string) {
		console.log('mkdirsSync递归创建路径:' + dirname)
		if (fs.existsSync(dirname)) {
			return true;
		} else {
			if (FsHelper.mkdirsSync(path.dirname(dirname))) {
				fs.mkdirSync(dirname, '777');
				return true;
			}
		}
	}
}

export default FsHelper
