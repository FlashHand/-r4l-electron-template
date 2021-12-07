/* eslint-disable @typescript-eslint/no-unused-vars */
export function hex_md5(input: string) {
	return binl2hex(
		core_md5(
			str2binl(input),
			input['length'] * 8
		)
	)
}

function binl2hex(input: number[]) {
	const v1 = '0123456789abcdef'
	let v2 = ''
	for (let i = 0; i < input['length'] * 4; i++) {
		v2 += v1['charAt'](input[i >> 0x2] >> i % 0x4 * 0x8 + 0x4 & 0xf) + v1['charAt'](input[i >> 0x2] >> i % 0x4 * 0x8 & 0xf)
	}
	return v2
}

function core_md5(p1: any[], p2: number) {
	p1[p2 >> 0x5] |= 0x80 << p2 % 0x20
	p1[(p2 + 0x40 >>> 0x9 << 0x4) + 0xe] = p2
	let a = 0x67452301
	let b = -0x10325477
	let c = -0x67452302
	let d = 0x10325476
	for (let i = 0x0; i < p1['length']; i += 0x10) {
		const e = a
		const f = b
		const g = c
		const h = d
		a = md5_ff(a, b, c, d, p1[i + 0x0], 0x7, -0x28955b88)
		d = md5_ff(d, a, b, c, p1[i + 0x1], 0xc, -0x173848aa)
		c = md5_ff(c, d, a, b, p1[i + 0x2], 0x11, 0x242070db)
		b = md5_ff(b, c, d, a, p1[i + 0x3], 0x16, -0x3e423112)
		a = md5_ff(a, b, c, d, p1[i + 0x4], 0x7, -0xa83f051)
		d = md5_ff(d, a, b, c, p1[i + 0x5], 0xc, 0x4787c62a)
		c = md5_ff(c, d, a, b, p1[i + 0x6], 0x11, -0x57cfb9ed)
		b = md5_ff(b, c, d, a, p1[i + 0x7], 0x16, -0x2b96aff)
		a = md5_ff(a, b, c, d, p1[i + 0x8], 0x7, 0x698098d8)
		d = md5_ff(d, a, b, c, p1[i + 0x9], 0xc, -0x74bb0851)
		c = md5_ff(c, d, a, b, p1[i + 0xa], 0x11, -0xa44f)
		b = md5_ff(b, c, d, a, p1[i + 0xb], 0x16, -0x76a32842)
		a = md5_ff(a, b, c, d, p1[i + 0xc], 0x7, 0x6b901122)
		d = md5_ff(d, a, b, c, p1[i + 0xd], 0xc, -0x2678e6d)
		c = md5_ff(c, d, a, b, p1[i + 0xe], 0x11, -0x5986bc72)
		b = md5_ff(b, c, d, a, p1[i + 0xf], 0x16, 0x49b40821)
		a = md5_gg(a, b, c, d, p1[i + 0x1], 0x5, -0x9e1da9e)
		d = md5_gg(d, a, b, c, p1[i + 0x6], 0x9, -0x3fbf4cc0)
		c = md5_gg(c, d, a, b, p1[i + 0xb], 0xe, 0x265e5a51)
		b = md5_gg(b, c, d, a, p1[i + 0x0], 0x14, -0x16493856)
		a = md5_gg(a, b, c, d, p1[i + 0x5], 0x5, -0x29d0efa3)
		d = md5_gg(d, a, b, c, p1[i + 0xa], 0x9, 0x2441453)
		c = md5_gg(c, d, a, b, p1[i + 0xf], 0xe, -0x275e197f)
		b = md5_gg(b, c, d, a, p1[i + 0x4], 0x14, -0x182c0438)
		a = md5_gg(a, b, c, d, p1[i + 0x9], 0x5, 0x21e1cde6)
		d = md5_gg(d, a, b, c, p1[i + 0xe], 0x9, -0x3cc8f82a)
		c = md5_gg(c, d, a, b, p1[i + 0x3], 0xe, -0xb2af279)
		b = md5_gg(b, c, d, a, p1[i + 0x8], 0x14, 0x455a14ed)
		a = md5_gg(a, b, c, d, p1[i + 0xd], 0x5, -0x561c16fb)
		d = md5_gg(d, a, b, c, p1[i + 0x2], 0x9, -0x3105c08)
		c = md5_gg(c, d, a, b, p1[i + 0x7], 0xe, 0x676f02d9)
		b = md5_gg(b, c, d, a, p1[i + 0xc], 0x14, -0x72d5b376)
		a = md5_hh(a, b, c, d, p1[i + 0x5], 0x4, -0x5c6be)
		d = md5_hh(d, a, b, c, p1[i + 0x8], 0xb, -0x788e097f)
		c = md5_hh(c, d, a, b, p1[i + 0xb], 0x10, 0x6d9d6122)
		b = md5_hh(b, c, d, a, p1[i + 0xe], 0x17, -0x21ac7f4)
		a = md5_hh(a, b, c, d, p1[i + 0x1], 0x4, -0x5b4115bc)
		d = md5_hh(d, a, b, c, p1[i + 0x4], 0xb, 0x4bdecfa9)
		c = md5_hh(c, d, a, b, p1[i + 0x7], 0x10, -0x944b4a0)
		b = md5_hh(b, c, d, a, p1[i + 0xa], 0x17, -0x41404390)
		a = md5_hh(a, b, c, d, p1[i + 0xd], 0x4, 0x289b7ec6)
		d = md5_hh(d, a, b, c, p1[i + 0x0], 0xb, -0x155ed806)
		c = md5_hh(c, d, a, b, p1[i + 0x3], 0x10, -0x2b10cf7b)
		b = md5_hh(b, c, d, a, p1[i + 0x6], 0x17, 0x4881d05)
		a = md5_hh(a, b, c, d, p1[i + 0x9], 0x4, -0x262b2fc7)
		d = md5_hh(d, a, b, c, p1[i + 0xc], 0xb, -0x1924661b)
		c = md5_hh(c, d, a, b, p1[i + 0xf], 0x10, 0x1fa27cf8)
		b = md5_hh(b, c, d, a, p1[i + 0x2], 0x17, -0x3b53a99b)
		a = md5_ii(a, b, c, d, p1[i + 0x0], 0x6, -0xbd6ddbc)
		d = md5_ii(d, a, b, c, p1[i + 0x7], 0xa, 0x432aff97)
		c = md5_ii(c, d, a, b, p1[i + 0xe], 0xf, -0x546bdc59)
		b = md5_ii(b, c, d, a, p1[i + 0x5], 0x15, -0x36c5fc7)
		a = md5_ii(a, b, c, d, p1[i + 0xc], 0x6, 0x655b59c3)
		d = md5_ii(d, a, b, c, p1[i + 0x3], 0xa, -0x70f3336e)
		c = md5_ii(c, d, a, b, p1[i + 0xa], 0xf, -0x100b83)
		b = md5_ii(b, c, d, a, p1[i + 0x1], 0x15, -0x7a7ba22f)
		a = md5_ii(a, b, c, d, p1[i + 0x8], 0x6, 0x6fa87e4f)
		d = md5_ii(d, a, b, c, p1[i + 0xf], 0xa, -0x1d31920)
		c = md5_ii(c, d, a, b, p1[i + 0x6], 0xf, -0x5cfebcec)
		b = md5_ii(b, c, d, a, p1[i + 0xd], 0x15, 0x4e0811a1)
		a = md5_ii(a, b, c, d, p1[i + 0x4], 0x6, -0x8ac817e)
		d = md5_ii(d, a, b, c, p1[i + 0xb], 0xa, -0x42c50dcb)
		c = md5_ii(c, d, a, b, p1[i + 0x2], 0xf, 0x2ad7d2bb)
		b = md5_ii(b, c, d, a, p1[i + 0x9], 0x15, -0x14792c6f)
		a = safe_add(a, e)
		b = safe_add(b, f)
		c = safe_add(c, g)
		d = safe_add(d, h)
	}
	return [a, b, c, d]
}

function md5_ff(a: number, b: number, c: number, d: number, e: any, f: number, g: number) {
	return md5_cmn(b & c | ~b & d, a, b, e, f, g)
}

function md5_gg(a: number, b: number, c: number, d: number, e: any, f: number, g: number) {
	return md5_cmn(b & d | c & ~d, a, b, e, f, g)
}

function md5_hh(a: number, b: number, c: number, d: number, e: any, f: number, g: number) {
	return md5_cmn(b ^ c ^ d, a, b, e, f, g)
}

function md5_ii(a: number, b: number, c: number, d: number, e: any, f: number, g: number) {
	return md5_cmn(c ^ (b | ~d), a, b, e, f, g)
}

function md5_cmn(a: number, b: any, c: any, d: any, e: any, f: any) {
	return safe_add(bit_rol(safe_add(safe_add(b, a), safe_add(d, f)), e), c)
}

function safe_add(p1: number, p2: number) {
	const a = (p1 & 0xffff) + (p2 & 0xffff)
	const b = (p1 >> 0x10) + (p2 >> 0x10) + (a >> 0x10)
	return b << 0x10 | a & 0xffff
}

function bit_rol(p1: number, p2: number) {
	return p1 << p2 | p1 >>> 0x20 - p2
}

function str2binl(input: string) {
	const a: number[] = []
	const b = (0x1 << 8) - 0x1
	for (let i = 0x0; i < input['length'] * 8; i += 8)
		a[i >> 0x5] |= (input['charCodeAt'](i / 8) & b) << i % 0x20
	return a
}