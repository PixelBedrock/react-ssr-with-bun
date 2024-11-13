import React from "react";
import { json, useLoaderData } from "react-router-dom";

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
      return <h1>{data.message}</h1>;
    }
  }
];
