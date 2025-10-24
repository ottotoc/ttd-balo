const { Storage } = require('@google-cloud/storage');
const { GCP_BUCKET, GCP_KEY_FILE } = require('../../config/env');
const asyncHandler = require('../../common/asyncHandler');
const { success } = require('../../common/response');
const { BadRequestError } = require('../../common/errors');

let storage;
let bucket;

// Initialize GCS only if credentials are provided
try {
  if (GCP_KEY_FILE && GCP_BUCKET) {
    storage = new Storage({ keyFilename: GCP_KEY_FILE });
    bucket = storage.bucket(GCP_BUCKET);
  }
} catch (error) {
  console.warn('GCS not configured:', error.message);
}

// Get signed URL for uploading
const getUploadUrl = asyncHandler(async (req, res) => {
  if (!storage || !bucket) {
    throw new BadRequestError('File upload service not configured');
  }

  const { filename, contentType } = req.body;

  if (!filename || !contentType) {
    throw new BadRequestError('Filename and content type are required');
  }

  // Validate content type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(contentType)) {
    throw new BadRequestError('Invalid content type. Only images are allowed.');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const objectName = `uploads/${timestamp}-${sanitizedFilename}`;

  const file = bucket.file(objectName);

  // Generate signed URL for upload (valid for 15 minutes)
  const [uploadUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  // Public URL (will be accessible after upload)
  const publicUrl = `https://storage.googleapis.com/${GCP_BUCKET}/${objectName}`;

  success(res, {
    uploadUrl,
    publicUrl,
    objectName,
  });
});

// Get signed URL for reading (if bucket is private)
const getReadUrl = asyncHandler(async (req, res) => {
  if (!storage || !bucket) {
    throw new BadRequestError('File service not configured');
  }

  const { objectName } = req.body;

  if (!objectName) {
    throw new BadRequestError('Object name is required');
  }

  const file = bucket.file(objectName);

  // Generate signed URL for reading (valid for 1 hour)
  const [readUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  success(res, { readUrl });
});

// Delete file
const deleteFile = asyncHandler(async (req, res) => {
  if (!storage || !bucket) {
    throw new BadRequestError('File service not configured');
  }

  const { objectName } = req.body;

  if (!objectName) {
    throw new BadRequestError('Object name is required');
  }

  const file = bucket.file(objectName);
  await file.delete();

  success(res, { message: 'File deleted successfully' });
});

module.exports = {
  getUploadUrl,
  getReadUrl,
  deleteFile,
};

