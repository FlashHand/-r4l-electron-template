import { spawn } from 'child_process'

import { platform } from 'os'
class Processor {
	private processorid?: string
	public async getProcessorID() {
		if (platform() != 'win32') {
			return ''
		}
		try {
			if (!this.processorid) {
				this.processorid = await new Promise((resolve, reject) => {
					const w = spawn('wmic')
					const data: string[] = []
					w.stdout.on('data', (d) => {
						data.push(d.toString('utf-8'))
					})
					w.stdout.on('end', () => {
						const [processorid] = data.filter(
							d => {
								return d.toUpperCase().startsWith('PROCESSORID')
							}
						)
						const matched = processorid.toUpperCase()
							.replace('PROCESSORID', '')
							.replace(/\\r\\r\\n/ig, '')
							.replace(/wmic:root\\cli/ig, '')
							.replace(' ', '')
							.replace('>', '')
							.match(/[A-Fa-f0-9]+/ig)
						if (matched) {
							resolve(matched[0])
						} else {
							resolve('')
						}
					})
					w.stderr.on('data', (e) => {
						console.log('stderr', e)
						reject(e)
					})
					w.stdin.end( (err: any) => {
						if (err) {
							reject(err)
						}
					})
				})
			}
		} catch (e) {
			this.processorid = ''
		}
		return this.processorid
	}
}

const processor = new Processor()
export default processor
