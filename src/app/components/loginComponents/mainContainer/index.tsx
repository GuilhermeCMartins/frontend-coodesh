import React, { ReactNode } from "react";
import * as s from "./style";

interface Props {
  children: ReactNode;
}

const SectionLogin = ({ children }: Props) => {
  return <s.LoginContainer>{children}</s.LoginContainer>;
};
export default SectionLogin;
