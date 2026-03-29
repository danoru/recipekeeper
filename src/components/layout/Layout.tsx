import { Fragment } from "react";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Fragment>
      <Navbar />
      <main>{children}</main>
    </Fragment>
  );
}
