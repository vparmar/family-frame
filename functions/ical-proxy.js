export async function onRequest(context) {
  const url = new URL(context.request.url).searchParams.get('url');
  if (!url) return new Response('Missing url param', { status: 400 });

  // Only allow Google Calendar iCal URLs
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('google.com') && !parsed.hostname.endsWith('calendar.google.com')) {
      return new Response('Only Google Calendar URLs are allowed', { status: 403 });
    }
  } catch (e) {
    return new Response('Invalid URL', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FamilyFrame/1.0)' }
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      }
    });
  } catch (e) {
    return new Response('Proxy fetch failed: ' + e.message, { status: 502 });
  }
}
