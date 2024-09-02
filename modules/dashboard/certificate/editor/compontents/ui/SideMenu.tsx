import React from "react";

interface Props {
  children: React.ReactNode;
}

function SideMenu({ children }: Props) {
  return <div className="side-menu">{children}</div>;
}

export default SideMenu;
