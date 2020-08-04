import React from "react";

interface PageTemplateProps {
  children: React.ReactNode;
}

const PageTemplate = (props: PageTemplateProps) => {
  return (
    <>
      <header></header>
      <main>{props.children}</main>
      <footer></footer>
    </>
  );
};

export default PageTemplate;
