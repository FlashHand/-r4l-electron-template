// aix
// darwin
// freebsd
// linux
// openbsd
// sunos
// win32
// android (Experimental, according to the link)
const isWin = ():boolean=>{
	return process.platform === 'win32';
}
export default {
	isWin
}
