import multer from 'multer';

const allowedMimes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/dicom',
  'application/octet-stream',
]);

// Vercel Functions reject request bodies above 4.5MB. Large medical files
// should use the signed-upload flow instead of multipart upload through Vercel.
const maxMultipartSize = process.env.VERCEL
  ? 4 * 1024 * 1024
  : 50 * 1024 * 1024;

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!allowedMimes.has(file.mimetype)) {
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: maxMultipartSize,
    files: 20,
  },
});

export const uploadMultiple = upload.array('files', 20);
export const uploadSingle = upload.single('file');
export const uploadOperationFiles = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'files', maxCount: 20 },
]);
