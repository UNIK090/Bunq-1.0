export async function searchVideos(query: string) {
try {
if (!query) return [];
// OPTION A: call your own backend which proxies YouTube Data API (recommended for keeping API key secret)
// const res = await fetch(`/api/searchYouTube?q=${encodeURIComponent(query)}`);
// return await res.json();


// OPTION B: direct browser call (requires exposing key, not recommended in production)
const KEY = process.env.VITE_YOUTUBE_API_KEY;
if (!KEY) return [];
const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(query)}&key=${KEY}`;
const r = await fetch(url);
const json = await r.json();
return (json.items || []).map((it: any) => ({ id: it.id.videoId, title: it.snippet.title, channelTitle: it.snippet.channelTitle }));
} catch (err) {
console.error(err);
return [];
}
}