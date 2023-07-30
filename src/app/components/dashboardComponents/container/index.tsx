import React, { ReactNode } from "react";
import * as s from "./style";

interface Props {
  children: ReactNode;
  type: "navbar" | "transactions" | "filters";
}

const DashboardCards = ({ children, type }: Props) => {
  return <s.Cards type={type}>{children}</s.Cards>;
};
export default DashboardCards;
