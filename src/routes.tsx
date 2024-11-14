import React from "react";
import { json, Link, useLoaderData } from "react-router-dom";
import styled from "styled-components";

type World = {
  message: string
}

const StyledH1 = styled.h1`
  font-family: system-ui;
`;

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
          <StyledH1>{data.message}</StyledH1>
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
          <StyledH1>{data.message}</StyledH1>
          <Link to={"/"}>link back to the first page</Link>
        </>
      );
    }
  }
];
