/**
 * Convert Vietnamese text to URL-friendly slug
 * @param {string} text - Text to convert
 * @returns {string} - Slugified text
 */
export function slugify(text) {
  if (!text) return ''
  
  // Convert to lowercase
  let slug = text.toLowerCase()
  
  // Remove Vietnamese accents
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Replace đ with d
  slug = slug.replace(/đ/g, 'd')
  slug = slug.replace(/Đ/g, 'd')
  
  // Replace spaces and special chars with dashes
  slug = slug.replace(/[^a-z0-9]+/g, '-')
  
  // Remove leading/trailing dashes
  slug = slug.replace(/^-+|-+$/g, '')
  
  // Replace multiple dashes with single dash
  slug = slug.replace(/-+/g, '-')
  
  return slug
}

/**
 * Generate unique slug by appending number if needed
 * @param {string} baseSlug - Base slug
 * @param {number} counter - Counter for uniqueness
 * @returns {string} - Unique slug
 */
export function generateUniqueSlug(baseSlug, counter = 0) {
  if (counter === 0) return baseSlug
  return `${baseSlug}-${counter}`
}

export default slugify

