// Vercel serverless function: /api/turnstile-config
// Serves the PUBLIC Cloudflare Turnstile site key at runtime so the static
// page never ships a placeholder. The site key is public by design (the
// SECRET stays server-side in TURNSTILE_SECRET and is never exposed here).
// Returns { sitekey: null } when unset — the client then renders no widget
// and submissions fail closed server-side until the env var is configured.
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const sitekey = process.env.TURNSTILE_SITE_KEY || null;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ sitekey });
};