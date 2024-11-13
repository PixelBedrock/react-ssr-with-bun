import React from "react";
import { json, Link, useLoaderData } from "react-router-dom";

type World = {
  message: string
}

export default [
  {
    path: "/",
    loader() {
      return json({ message: "Welcome to React Router!" });
    },
    Component() {
      let data: World = useLoaderData() as World;
      return (
        <>
          <h1>{data.message}</h1>
          <Link to={"/a-second-page"}>link to another page</Link>
        </>
      );
    }
  },
  {
    path: "/a-second-page",
    loader() {
      return json({ message: "it's a second page!" });
    },
    Component() {
      let data: World = useLoaderData() as World;
      return (
        <>
          <h1>{data.message}</h1>
          <Link to={"/"}>link back to the first page</Link>
        </>
      );
    }
  }
];
