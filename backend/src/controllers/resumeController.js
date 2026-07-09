const multer = require('multer');
const pdf = require('pdf-parse');
const User = require('../models/User');

// Configure Multer memory storage (we parse PDFs on-the-fly and don't save raw files)
const storage = multer.memoryStorage();

// File filter to restrict uploads to PDF format only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF is allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('resume');

// @desc    Upload & Parse Resume PDF
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer Upload Error:', err.message);
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Please upload a PDF file' });
      }

      // Parse PDF buffer to plain text
      const parsedData = await pdf(req.file.buffer);
      
      // Clean up extracted text (remove redundant spaces, lines etc)
      let cleanText = parsedData.text
        .replace(/\r\n/g, '\n')
        .replace(/ +/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

      if (!cleanText || cleanText.length < 50) {
        return res.status(400).json({ error: 'Could not extract sufficient text from the PDF. Please make sure the PDF has readable text (not scanned images).' });
      }

      // Save plain text to user document in database
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { resumeText: cleanText },
        { new: true }
      ).select('-password');

      res.status(200).json({
        message: 'Resume uploaded and parsed successfully',
        resumeText: user.resumeText
      });
    } catch (error) {
      console.error('PDF Parse Error:', error.message);
      res.status(500).json({ error: 'Failed to parse resume PDF. Please try a different file.' });
    }
  });
};

module.exports = {
  uploadResume
};
