import React from "react";
import Header from "./common/Header";

interface PageTemplateProps {
  children: React.ReactNode;
}

const PageTemplate = (props: PageTemplateProps) => {
  return (
    <>
      <Header />
      <main>{props.children}</main>
      <footer></footer>
    </>
  );
};

export default PageTemplate;
