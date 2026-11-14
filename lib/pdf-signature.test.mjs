import assert from 'node:assert/strict'
import { test } from 'node:test'
import pdfSignature from './pdf-signature.cjs'

const { hasPdfSignature } = pdfSignature

test('accepts a PDF header in an ArrayBuffer', () => {
  const body = Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]).buffer

  assert.equal(hasPdfSignature(body), true)
})

test('accepts a PDF header in a typed-array view with an offset', () => {
  const backing = Buffer.from('x%PDF-1.7')
  const view = new Uint8Array(backing.buffer, backing.byteOffset + 1, 5)

  assert.equal(hasPdfSignature(view), true)
})

test('rejects HTML error pages and other non-PDF responses', () => {
  assert.equal(hasPdfSignature(Buffer.from('<html>not a PDF</html>')), false)
  assert.equal(hasPdfSignature(Buffer.from([0x50, 0x4b, 0x03, 0x04])), false)
})

test('rejects empty, truncated, and unsupported values', () => {
  assert.equal(hasPdfSignature(new ArrayBuffer(0)), false)
  assert.equal(hasPdfSignature(Buffer.from('%PDF')), false)
  assert.equal(hasPdfSignature(null), false)
  assert.equal(hasPdfSignature('%PDF-1.7'), false)
})
