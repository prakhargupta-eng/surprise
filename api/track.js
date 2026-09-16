// Vercel serverless function: POST /api/track
// Saves name guesses, quiz answers, and gift pledges to a Supabase table.
//
// Env vars required (set these in Vercel → Project → Settings → Environment Variables):
//   SUPABASE_URL          - your Supabase project URL
//   SUPABASE_SERVICE_KEY  - your Supabase service_role key (server-side only, never expose to the browser)

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { type, payload } = req.body || {};
    const allowedTypes = ['name_entry', 'quiz', 'gift'];

    if (!type || !allowedTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid or missing "type". Must be one of: ' + allowedTypes.join(', ') });
      return;
    }

    const { error } = await supabase
      .from('birthday_events')
      .insert({ type, payload: payload || {} });

    if (error) throw error;

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('track.js error:', err);
    res.status(500).json({ error: 'Could not save event' });
  }
};
