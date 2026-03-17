// api/stats.js — Vercel serverless proxy
// Fetches from your HTTP bot and returns it over HTTPS to the browser

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // cache 5 min on Vercel edge

  try {
    const response = await fetch('http://node24.lunes.host:3203/stats', {
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) throw new Error(`Bot returned HTTP ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('[Vercel proxy] Error:', err.message);
    res.status(502).json({ error: 'Bot unreachable', detail: err.message });
  }
}
