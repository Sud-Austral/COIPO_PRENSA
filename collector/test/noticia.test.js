import { describe, expect, it } from 'vitest'
import { canonicalizarUrl, crearNoticia, parsearFecha } from '../src/dominio/noticia.js'

const MEDIO = { id: 'la-tercera', nombre: 'La Tercera', tipo: 'escrita' }

describe('canonicalizarUrl', () => {
  it('elimina parámetros de rastreo, conservando los demás', () => {
    expect(
      canonicalizarUrl('https://medio.cl/nota?utm_source=rss&utm_medium=feed&id=7'),
    ).toBe('https://medio.cl/nota?id=7')
    expect(canonicalizarUrl('https://medio.cl/nota?fbclid=abc123')).toBe(
      'https://medio.cl/nota',
    )
  })

  it('elimina el fragmento', () => {
    expect(canonicalizarUrl('https://medio.cl/nota#comentarios')).toBe('https://medio.cl/nota')
  })

  it('normaliza el slash final (salvo la raíz)', () => {
    expect(canonicalizarUrl('https://medio.cl/nota/')).toBe('https://medio.cl/nota')
    expect(canonicalizarUrl('https://medio.cl/')).toBe('https://medio.cl/')
  })

  it('pone el host en minúsculas', () => {
    expect(canonicalizarUrl('https://Medio.CL/Nota')).toBe('https://medio.cl/Nota')
  })

  it('tres variantes de la misma URL canonicalizan igual', () => {
    const limpia = canonicalizarUrl('https://medio.cl/a/b')
    expect(canonicalizarUrl('https://medio.cl/a/b/')).toBe(limpia)
    expect(canonicalizarUrl('https://medio.cl/a/b?utm_campaign=x#frag')).toBe(limpia)
  })

  it('devuelve el texto tal cual ante una URL inválida', () => {
    expect(canonicalizarUrl('no-es-una-url')).toBe('no-es-una-url')
    expect(canonicalizarUrl(null)).toBe('')
  })
})

describe('parsearFecha', () => {
  it('convierte fechas RFC-822 de RSS a ISO', () => {
    expect(parsearFecha('Mon, 13 Jul 2026 10:30:00 -0400')).toBe('2026-07-13T14:30:00.000Z')
  })

  it('devuelve null ante valores inválidos', () => {
    expect(parsearFecha('fecha inválida')).toBe(null)
    expect(parsearFecha('')).toBe(null)
    expect(parsearFecha(undefined)).toBe(null)
    expect(parsearFecha(new Date('rota'))).toBe(null)
  })
})

describe('crearNoticia', () => {
  const base = {
    medio: MEDIO,
    titular: '  Incendio controlado  ',
    url: 'https://medio.cl/nota?utm_source=rss',
    fechaMedio: '2026-07-13T10:00:00.000Z',
    fechaDeteccion: '2026-07-13T11:00:00.000Z',
    extracto: [{ texto: 'hola', resaltado: false }],
  }

  it('normaliza titular, usa URL canónica como id y denormaliza el medio', () => {
    const noticia = crearNoticia(base)
    expect(noticia).toMatchObject({
      id: 'https://medio.cl/nota',
      url: 'https://medio.cl/nota?utm_source=rss',
      medioId: 'la-tercera',
      medioNombre: 'La Tercera',
      seccionId: 'escrita',
      titular: 'Incendio controlado',
      fecha: '2026-07-13T10:00:00.000Z',
    })
  })

  it('usa la fecha de detección cuando la del medio falta o es inválida', () => {
    expect(crearNoticia({ ...base, fechaMedio: undefined }).fecha).toBe(
      '2026-07-13T11:00:00.000Z',
    )
    expect(crearNoticia({ ...base, fechaMedio: 'basura' }).fecha).toBe(
      '2026-07-13T11:00:00.000Z',
    )
  })

  it('rechaza ítems sin titular o sin URL', () => {
    expect(crearNoticia({ ...base, titular: '   ' })).toBe(null)
    expect(crearNoticia({ ...base, url: '' })).toBe(null)
  })
})
