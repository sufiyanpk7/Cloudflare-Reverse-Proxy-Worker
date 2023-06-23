addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const path = url.pathname + url.search;

  if (hostname === 'domain1.example.com') {
    const targetUrl = `https://domain2.target-domain.com/xxxxx{path}`;

    // Modify the request headers
    const headers = new Headers(request.headers);
    headers.set('Host', 'domain2.target-domain.com');

    // Forward the modified request to the target server
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      redirect: 'manual',
    });

    // Modify the response headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

    // Create the response object
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } else {
    // Return a 404 Not Found response for all other hostnames
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }
}
