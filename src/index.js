/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx) {
// 		return new Response('Hello World!');
// 	},
// };
addEventListener('fetch' , getRequest)
const gemini_api='https://generativelanguage.googleapis.com'
function getRequest(event) {
	event.respondWith(proxyRequest(event.request))
}

async function proxyRequest(request) {
	const requestUrl = new URL(request.url)
	const proxyUrl = new URL(gemini_api)
	proxyUrl.pathname = requestUrl.pathname
	proxyUrl.search = requestUrl.search

	if (requestUrl.pathname === '/status' ) {
		return new Response('Gemini API proxy is running.', {
			status: 200,
			headers: {'Content-Type': 'text/plain'}
		})
	}

	if (requestUrl.pathname === '/') {
		return new Response(`
<!DOCTYPE html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>
`,{
    headers: { 'Content-Type': 'text/html' }
  })
	}
	const goProxyRequest = new Request(proxyUrl, {
		method: request.method,
		headers: request.headers,
		body: request.body
	})
	return fetch(goProxyRequest)
}


