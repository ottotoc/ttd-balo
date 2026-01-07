import { useState, useEffect, useCallback } from 'react'

// Sử dụng API công khai về địa chỉ Việt Nam
// API: https://provinces.open-api.vn/api/v1
const API_BASE_URL = 'https://provinces.open-api.vn/api/v1'

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
      
      // Thử format URL mới với /v1/
      let response = await fetch(`${API_BASE_URL}/p/`)
      
      // Nếu không được, thử không có trailing slash
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/p`)
      }
      
      // Fallback: thử format cũ (nếu API chưa update)
      if (!response.ok) {
        response = await fetch('https://provinces.open-api.vn/api/provinces/')
      }
      
      if (!response.ok) {
        // Nếu tất cả đều fail, log chi tiết để debug
        console.error(`Provinces API failed: ${response.status} ${response.statusText}`)
        throw new Error(`Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.`)
      }
      
      const data = await response.json()
      
      // Xử lý format dữ liệu khác nhau
      let provincesData = []
      if (Array.isArray(data)) {
        provincesData = data
      } else if (data.data && Array.isArray(data.data)) {
        provincesData = data.data
      } else if (data.provinces && Array.isArray(data.provinces)) {
        provincesData = data.provinces
      } else {
        console.error('Unexpected provinces data format:', data)
        throw new Error('Định dạng dữ liệu tỉnh/thành phố không hợp lệ')
      }
      
      provincesCache = provincesData
      setProvinces(provincesData)
    } catch (err) {
      console.error('Error loading provinces:', err)
      setError(err.message || 'Failed to load provinces')
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
      
      // Thử format mới trước
      let response = await fetch(`${API_BASE_URL}/p/${provinceCode}?depth=2`)
      
      if (!response.ok) {
        // Fallback: thử endpoint cũ
        response = await fetch(`${API_BASE_URL}/provinces/${provinceCode}/districts`)
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load districts: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Xử lý format dữ liệu khác nhau
      let districtsData = []
      if (data.districts && Array.isArray(data.districts)) {
        districtsData = data.districts
      } else if (Array.isArray(data)) {
        districtsData = data
      } else {
        throw new Error('Invalid districts data format')
      }
      
      setDistricts(districtsData)
      setWards([]) // Reset wards when province changes
    } catch (err) {
      console.error('Error loading districts:', err)
      setError(err.message || 'Failed to load districts')
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
      
      // Thử format mới trước
      let response = await fetch(`${API_BASE_URL}/d/${districtCode}?depth=2`)
      
      if (!response.ok) {
        // Fallback: thử endpoint cũ
        response = await fetch(`${API_BASE_URL}/districts/${districtCode}/wards`)
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load wards: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Xử lý format dữ liệu khác nhau
      let wardsData = []
      if (data.wards && Array.isArray(data.wards)) {
        wardsData = data.wards
      } else if (Array.isArray(data)) {
        wardsData = data
      } else {
        throw new Error('Invalid wards data format')
      }
      
      setWards(wardsData)
    } catch (err) {
      console.error('Error loading wards:', err)
      setError(err.message || 'Failed to load wards')
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
