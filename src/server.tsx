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
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true
  }
});

let handler = createStaticHandler(routes);

Bun.serve({
  async fetch(req, _server) {
    if (new URL(req.url).pathname === "/client.js")
      return new Response(hydrationBuilds.outputs[0].stream(), {
        headers: {
          "Content-Type": hydrationBuilds.outputs[0].type
        }
      });

    let fetchRequest = createFetchRequest(req);
    let context = await handler.query(fetchRequest) as StaticHandlerContext;

    let router = createStaticRouter(handler.dataRoutes, context);

    let stream = await renderToReadableStream(
      <html>
        <head>
        </head>
        <body>
          <StaticRouterProvider router={router} context={context} />
        </body>
      </html>,
      {
        bootstrapModules: ["./client.js"]
      }
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    });
  }
});
