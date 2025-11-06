import React, { useEffect } from 'react'
import { useVietnamAddress } from '../../hooks/useVietnamAddress'

export default function AddressSelector({ 
  wardCode, 
  onChange, 
  provinceCode,
  districtCode,
  onProvinceChange,
  onDistrictChange,
  disabled = false 
}) {
  const { provinces, districts, wards, loading, loadDistricts, loadWards } = useVietnamAddress()

  // Load districts when province changes
  useEffect(() => {
    if (provinceCode) {
      loadDistricts(provinceCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceCode])

  // Load wards when district changes
  useEffect(() => {
    if (districtCode) {
      loadWards(districtCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtCode])

  const handleProvinceChange = (e) => {
    const code = e.target.value
    const province = provinces.find(p => p.code === parseInt(code))
    if (onProvinceChange) {
      onProvinceChange(code, province?.name || '')
    }
  }

  const handleDistrictChange = (e) => {
    const code = e.target.value
    const district = districts.find(d => d.code === parseInt(code))
    if (onDistrictChange) {
      onDistrictChange(code, district?.name || '')
    }
  }

  const handleWardChange = (e) => {
    const code = e.target.value
    const ward = wards.find(w => w.code === parseInt(code))
    if (onChange) {
      onChange(code, ward?.name || '')
    }
  }

  return (
    <>
      {/* Province Select */}
      <div className="col-md-4">
        <label htmlFor="province" className="form-label">
          Tỉnh/Thành phố <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="province"
          value={provinceCode || ''}
          onChange={handleProvinceChange}
          disabled={disabled || loading}
          required
        >
          <option value="">Chọn tỉnh/thành phố</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
        {loading && provinceCode && (
          <small className="text-muted">Đang tải quận/huyện...</small>
        )}
      </div>

      {/* District Select */}
      <div className="col-md-4">
        <label htmlFor="district" className="form-label">
          Quận/Huyện <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="district"
          value={districtCode || ''}
          onChange={handleDistrictChange}
          disabled={disabled || loading || !provinceCode || districts.length === 0}
          required
        >
          <option value="">Chọn quận/huyện</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
        {loading && districtCode && (
          <small className="text-muted">Đang tải phường/xã...</small>
        )}
      </div>

      {/* Ward Select */}
      <div className="col-md-4">
        <label htmlFor="ward" className="form-label">
          Phường/Xã <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="ward"
          value={wardCode || ''}
          onChange={handleWardChange}
          disabled={disabled || loading || !districtCode || wards.length === 0}
          required
        >
          <option value="">Chọn phường/xã</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

