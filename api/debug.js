module.exports = (req, res) => {
  res.status(200).json({ 
    has_key: !!process.env.RESEND_API_KEY,
    key_prefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 6) + '...' : 'MISSING'
  });
};
