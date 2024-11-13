import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { hydrateRoot } from "react-dom/client";
import React from "react";

let router = createBrowserRouter(routes);
hydrateRoot(document.body, <RouterProvider router={router} />);
