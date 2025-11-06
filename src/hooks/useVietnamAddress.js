import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = 'https://provinces.open-api.vn/api'

// Cache for provinces to avoid reloading
let provincesCache = null
let provincesLoading = false

export function useVietnamAddress() {
  const [provinces, setProvinces] = useState(provincesCache || [])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load provinces (only once, cached)
  const loadProvinces = useCallback(async () => {
    if (provincesCache) {
      setProvinces(provincesCache)
      return
    }

    if (provincesLoading) return

    try {
      provincesLoading = true
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/provinces/`)
      if (!response.ok) throw new Error('Failed to load provinces')
      const data = await response.json()
      provincesCache = data
      setProvinces(data)
    } catch (err) {
      console.error('Error loading provinces:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      provincesLoading = false
    }
  }, [])

  useEffect(() => {
    loadProvinces()
  }, [loadProvinces])

  const loadDistricts = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setDistricts([])
      setWards([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/provinces/${provinceCode}/districts`)
      if (!response.ok) throw new Error('Failed to load districts')
      const data = await response.json()
      setDistricts(data)
      setWards([]) // Reset wards when province changes
    } catch (err) {
      console.error('Error loading districts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadWards = useCallback(async (districtCode) => {
    if (!districtCode) {
      setWards([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/districts/${districtCode}/wards`)
      if (!response.ok) throw new Error('Failed to load wards')
      const data = await response.json()
      setWards(data)
    } catch (err) {
      console.error('Error loading wards:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    provinces,
    districts,
    wards,
    loading,
    error,
    loadDistricts,
    loadWards,
  }
}

