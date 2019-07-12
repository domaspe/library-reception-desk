function getDefaultOptions(method, body) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      pragma: 'no-cache',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    },
    body: body ? JSON.stringify(body) : undefined
  };
}

export default function(url, method = 'GET', body = null) {
  return fetch(url, getDefaultOptions(method, body)).then(response => {
    const contentType = response.headers.get('content-type');
    return contentType && contentType.indexOf('application/json') !== -1
      ? response.json()
      : response.text();
  });
}
