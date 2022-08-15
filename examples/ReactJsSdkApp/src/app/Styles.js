import React from "react";
import { Box, Container, Paper } from "@mui/material";
import styled from "styled-components";

export const ContainerGrid = styled(Container)`
  display: grid !important;
  gap: 20px;
  grid-template-areas:
    "title title"
    "informations payment"
    "informations kyc"
    "transaction transaction";
`;

export const Title = styled.h1`
  color: #333;
  font-size: 2em;
  font-weight: bold;
  grid-area: title;
  text-align: center;
  text-shadow: 2px 2px 2px #aaa;
`;

export const Section = styled(Paper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  flex-grow: 1;
`;

export const Header = styled.h2`
  align-items: center;
  display: inline-flex;
  font-weight: 900;
  font-size: 20px;
  gap: 5px;
  margin: 10px 0px 10px 0px;
`;
