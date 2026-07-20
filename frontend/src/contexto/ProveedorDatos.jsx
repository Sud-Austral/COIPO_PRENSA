import { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { cargarNoticias } from '../servicios/datos.js'

export const ContextoDatos = createContext()

export function ProveedorDatos({ children }) {
  const [noticias, setNoticias] = useState(null)
  const [secciones, setSecciones] = useState([])
  const [generadoEn, setGeneradoEn] = useState(null)
  const [historico, setHistorico] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true

    const cargar = async () => {
      try {
        const datos = await cargarNoticias()
        if (activo) {
          setNoticias(datos.noticias)
          setSecciones(datos.secciones)
          setGeneradoEn(datos.generadoEn)
          setError(null)
        }
      } catch (err) {
        if (activo) {
          setError(err.message)
          setNoticias([])
          setSecciones([])
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [])

  // Carga lazy del histórico (solo cuando se necesita)
  const cargarHistorico = useCallback(async () => {
    if (historico !== null) return historico

    try {
      const url = `${import.meta.env.BASE_URL}data/historico.json?t=${Date.now()}`
      const respuesta = await fetch(url, { cache: 'no-store' })
      if (!respuesta.ok) return null
      const datos = await respuesta.json()
      setHistorico(datos)
      return datos
    } catch {
      return null
    }
  }, [historico])

  return (
    <ContextoDatos.Provider
      value={{
        noticias,
        secciones,
        generadoEn,
        historico,
        cargando,
        error,
        cargarHistorico,
      }}
    >
      {children}
    </ContextoDatos.Provider>
  )
}

export function useDatos() {
  const contexto = useContext(ContextoDatos)
  if (!contexto) {
    throw new Error('useDatos debe usarse dentro de ProveedorDatos')
  }
  return contexto
}
