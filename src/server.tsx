import { createStaticHandler, createStaticRouter, StaticRouterProvider, type StaticHandlerContext } from "react-router-dom/server";
import routes from "./routes";
import createFetchRequest from "./request";
import { renderToReadableStream } from "react-dom/server";
import React from "react";

const hydrationBuilds = await Bun.build({
  entrypoints: ["./src/client.tsx"],
  target: "browser",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  minify: true,
  naming: "[name]-[hash].[ext]"
});

let handler = createStaticHandler(routes);

Bun.serve({
  async fetch(req, _server) {
    if (new URL(req.url).pathname === hydrationBuilds.outputs[0].path.substring(1)) {
      let uin8 = await Bun.readableStreamToBytes(hydrationBuilds.outputs[0].stream());
      let gzip = Bun.gzipSync(uin8);
      return new Response(gzip, {
        headers: {
          "Cache-Control": "max-age=31536000",
          "Content-Encoding": "gzip",
          "Content-Type": hydrationBuilds.outputs[0].type
        }
      });
    }

    if (new URL(req.url).pathname === "/robots.txt")
      return new Response("User-Agent: *\nDisallow:", {
        headers: {
          "Content-Type": "text"
        }
      });

    let fetchRequest = createFetchRequest(req);
    let context = await handler.query(fetchRequest) as StaticHandlerContext;

    let router = createStaticRouter(handler.dataRoutes, context);

    let stream = await renderToReadableStream(
      <html lang="en">
        <head>
          <title>SSR with React and react-router</title>
          <meta name="description" content="SSR with React and react-router" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <StaticRouterProvider router={router} context={context} />
        </body>
      </html>,
      {
        bootstrapModules: [hydrationBuilds.outputs[0].path.substring(1)]
      }
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    });
  }
});
