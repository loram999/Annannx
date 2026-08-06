// Cloudflare Worker entry point.
//
// What this does:
//  1. Try to serve the requested path from the static assets exactly as-is.
//  2. If that 404s, retry with a lowercased pathname so URLs like
//     /home/AllLotteryGames/WinGo/ still resolve to home/alllotterygames/wingo/.
//  3. Append /index.html for any directory-style request that didn't match.
//  4. Otherwise return whatever Cloudflare's assets binding gave us (typically 404).
//
// Total bundle size: ~1 KiB — well under the 1 MiB Worker script limit.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const variants = [
      url.pathname,                                    // /home/AllLotteryGames/WinGo/
      url.pathname.toLowerCase(),                      // /home/alllotterygames/wingo/
      url.pathname.toLowerCase().replace(/\/?$/, "/index.html"), // /home/alllotterygames/wingo/index.html
      url.pathname.replace(/\/?$/, "/index.html"),     // /home/AllLotteryGames/WinGo/index.html
    ];

    for (const pathname of variants) {
      const tryUrl = new URL(url);
      tryUrl.pathname = pathname;
      const res = await env.ASSETS.fetch(new Request(tryUrl, request));
      if (res.status !== 404) return res;
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  },
};
