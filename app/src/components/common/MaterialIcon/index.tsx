import React from "react";
import "./style.css";

interface MaterialIconProps {
  icon: string;
}

const MaterialIcon = (props: MaterialIconProps) => {
  return <i className="material-icons">{props.icon}</i>;
};

export default MaterialIcon;
