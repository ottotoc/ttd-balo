const asyncHandler = require('../../common/asyncHandler');
const { success } = require('../../common/response');
const https = require('https');
const http = require('http');

const API_BASE_URL = 'https://provinces.open-api.vn/api';

// Helper function to make HTTP requests (Node.js compatible)
function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(jsonData),
          });
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Cache for provinces (rarely changes)
let provincesCache = null;
let provincesCacheTime = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Get all provinces
const getProvinces = asyncHandler(async (req, res) => {
  // Check cache first
  if (provincesCache && provincesCacheTime && (Date.now() - provincesCacheTime) < CACHE_DURATION) {
    return success(res, provincesCache);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/provinces/`);
    if (!response.ok) {
      console.error('Provinces API response not OK:', response.status);
      throw new Error(`Failed to fetch provinces: ${response.status}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Provinces API returned invalid data:', typeof data);
      throw new Error('Invalid provinces data format');
    }
    
    const provinces = data.map(p => ({
      code: p.code,
      name: p.name,
    }));

    console.log(`Loaded ${provinces.length} provinces`);

    // Cache the result
    provincesCache = provinces;
    provincesCacheTime = Date.now();

    success(res, provinces);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw new Error('Failed to fetch provinces: ' + error.message);
  }
});

// Get districts by province code
const getDistricts = asyncHandler(async (req, res) => {
  const { provinceCode } = req.params;

  if (!provinceCode) {
    return res.status(400).json({
      error: {
        message: 'Province code is required',
        statusCode: 400,
      },
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/provinces/${provinceCode}/districts`);
    if (!response.ok) throw new Error('Failed to fetch districts');
    const data = await response.json();
    const districts = data.map(d => ({
      code: d.code,
      name: d.name,
      provinceCode: d.province_code,
    }));

    success(res, districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw new Error('Failed to fetch districts');
  }
});

// Get wards by district code
const getWards = asyncHandler(async (req, res) => {
  const { districtCode } = req.params;

  if (!districtCode) {
    return res.status(400).json({
      error: {
        message: 'District code is required',
        statusCode: 400,
      },
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/districts/${districtCode}/wards`);
    if (!response.ok) throw new Error('Failed to fetch wards');
    const data = await response.json();
    const wards = data.map(w => ({
      code: w.code,
      name: w.name,
      districtCode: w.district_code,
    }));

    success(res, wards);
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw new Error('Failed to fetch wards');
  }
});

module.exports = {
  getProvinces,
  getDistricts,
  getWards,
};

