const FormData = require('form-data');

const aiClient = require('../utils/aiClient');
const catchAsync = require('../utils/catchAsync');






exports.analyzePortfolio = catchAsync(async (req, res, next) => {
  const form = new FormData();

  form.append('freelancer_id', req.user._id.toString());

  if (req.body.portfolio_text) {
    form.append('portfolio_text', req.body.portfolio_text);
  }

  if (req.body.github_url) {
    form.append('github_url', req.body.github_url);
  }

  if (req.body.portfolio_url) {
    form.append('portfolio_url', req.body.portfolio_url);
  }

  if (req.file) {
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
  }

  const response = await aiClient.post('/analyze-portfolio', form, {
    headers: form.getHeaders(),
  });

  res.status(200).json({
    status: 'success',
    data: response.data,
  });
});