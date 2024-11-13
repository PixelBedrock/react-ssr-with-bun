type RequestInit = {
  body?: ReadableStream<Uint8Array> | null,
  method: string,
  headers: Headers,
  signal: AbortSignal
}

export default function createFetchRequest(req: Request) {
  let reqURL = new URL(req.url);

  let origin = `${reqURL.protocol}//${req.headers.get("host")}`;
  let url = new URL(req.url, origin);

  let headers = new Headers();

  for (let [key, values] of Object.entries(req.headers.toJSON())) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  let init: RequestInit = {
    method: req.method,
    headers,
    signal: req.signal
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
