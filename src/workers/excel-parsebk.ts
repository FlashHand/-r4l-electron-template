import xlsx from 'xlsx'
import { Open } from 'unzipper'
import { Invoice } from '@/shared/model/invoice'
import { Goods } from '@/shared/model/goods'
interface ExcelData {
	invoiceInfo: Invoice.DownloadRecord[]
	goodsInfo: Goods.DownloadRecord[]
}

const ctx: Worker = self as any

ctx.addEventListener('message', async (event) => {
	const { id, buf, fplx, jymm } = event.data
	await parseData(id, buf, fplx, jymm)
})

async function parseData(id: number, buf: Buffer, fplx: Invoice.InvoiceType, jymm: string): Promise<ExcelData | undefined> {
	try {
		let invoiceInfo: Invoice.DownloadRecord[] = []
		let goodsInfo: Goods.DownloadRecord[] = []
		const dir = await Open.buffer(buf)
		for (const file of dir.files) {
			const extract = await file.buffer(jymm)
			const webbook = xlsx.read(extract)
			for (const name of webbook.SheetNames) {
				const sheet = webbook.Sheets[name]
				const data: string[][] = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' })
				data.splice(0, 2)
				const filtered = data.filter(d => { return !!d[0] })
				if (name == '发票信息') {
					const invoices = filtered.map((v: any) => new Invoice.DownloadRecord(v, fplx))
					invoiceInfo = invoiceInfo.concat(invoices)
				}
				if (name == '货物信息') {
					const goods = filtered.map((v: any) => new Goods.DownloadRecord(v, fplx))
					goodsInfo = goodsInfo.concat(goods)
				}
			}
		}
		ctx.postMessage({
			id,
			type: 'data',
			data: {
				invoiceInfo,
				goodsInfo
			}
		})
		return
	} catch (e) {
		ctx.postMessage({
			id,
			type: 'error',
			data: e
		})
	}

}
