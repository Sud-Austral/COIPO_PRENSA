import { describe, expect, it } from 'vitest'
import { extraerImagen } from '../src/adaptadores/enriquecedor-imagenes.js'

const BASE = 'https://medio.cl/2026/07/nota'

describe('extraerImagen', () => {
  it('extrae og:image con content después de property', () => {
    const html = `<meta property="og:image" content="https://cdn.medio.cl/foto.jpg">`
    expect(extraerImagen(html, BASE)).toBe('https://cdn.medio.cl/foto.jpg')
  })

  it('extrae og:image con content antes de property', () => {
    const html = `<meta content="https://cdn.medio.cl/foto.jpg" property="og:image"/>`
    expect(extraerImagen(html, BASE)).toBe('https://cdn.medio.cl/foto.jpg')
  })

  it('cae en twitter:image si no hay og:image', () => {
    const html = `<meta name="twitter:image" content="https://cdn.medio.cl/tw.png">`
    expect(extraerImagen(html, BASE)).toBe('https://cdn.medio.cl/tw.png')
  })

  it('completa URLs con esquema relativo al protocolo (//cdn…)', () => {
    const html = `<meta property="og:image" content="//cdn.laopinon.cl/img/foto.jpg">`
    expect(extraerImagen(html, BASE)).toBe('https://cdn.laopinon.cl/img/foto.jpg')
  })

  it('resuelve rutas relativas contra la URL del artículo', () => {
    const html = `<meta property="og:image" content="/media/foto.jpg">`
    expect(extraerImagen(html, BASE)).toBe('https://medio.cl/media/foto.jpg')
  })

  it('decodifica entidades HTML en la URL (resizers con &#038;)', () => {
    const html = `<meta property="og:image" content="https://medio.cl/resizer/?t=0&#038;c=abc">`
    expect(extraerImagen(html, BASE)).toBe('https://medio.cl/resizer/?t=0&c=abc')
  })

  it('fuerza https en imágenes http (evita bloqueo por contenido mixto)', () => {
    const html = `<meta property="og:image" content="http://cdn.medio.cl/foto.jpg">`
    expect(extraerImagen(html, BASE)).toBe('https://cdn.medio.cl/foto.jpg')
  })

  it('devuelve null si no hay imagen social', () => {
    expect(extraerImagen('<html><head><title>x</title></head></html>', BASE)).toBe(null)
  })

  it('devuelve null ante una URL de imagen inválida', () => {
    const html = `<meta property="og:image" content="javascript:alert(1)">`
    expect(extraerImagen(html, BASE)).toBe(null)
  })
})
