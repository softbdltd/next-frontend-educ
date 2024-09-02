import React, { forwardRef } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  children: React.ReactNode;
  noScroll?: boolean;
}

const MainArea = forwardRef<HTMLElement, Props>(
  ({ children, className = "relative", noScroll, ...rest }, ref) => {
    return (
      <main className="main-area-containner" {...rest} ref={ref}>
        {children}
      </main>
    );
  }
);

export default MainArea;
