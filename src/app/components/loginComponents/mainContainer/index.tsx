import React, { ReactNode } from "react";
import * as s from "./style";

interface Props {
  children: ReactNode;
}

const SectionLogin = ({ children }: Props) => {
  return <s.Container>{children}</s.Container>;
};
export default SectionLogin;
