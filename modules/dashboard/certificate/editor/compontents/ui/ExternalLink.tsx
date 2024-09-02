import React from "react";

interface Props
  extends Omit<
    React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "href"
  > {
  to: string;
  newTab?: boolean;
  className?: string;
}

const ExternalLink = ({ children, to, className, newTab, ...rest }: Props) => {
  const additional = newTab
    ? {
        target: "_blank",
      }
    : {};
  return (
    <a
      {...additional}
      {...rest}
      href={to}
      className={`external-link ${className ? className : ""}`}
    >
      {children || to}
    </a>
  );
};

export default ExternalLink;
