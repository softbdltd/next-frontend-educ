import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: React.ComponentType<{ className?: string }>;
  selected?: boolean;
}

function SideMenuButton({
  icon: Icon,
  children,
  selected,
  disabled,
  onClick,
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
      className={`side-menu-button ${selected ? "selected" : ""}`}
      {...rest}
    >
      {Icon && <Icon className="menu-icon" />}
      <div>{children}</div>
    </button>
  );
}

export default SideMenuButton;
