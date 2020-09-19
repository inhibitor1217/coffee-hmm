import React from "react";
import "./style.css";

interface MaterialIconProps {
  icon: string;
  size?: number;
  color?: string;
  margin?: string;
}

const MaterialIcon = (props: MaterialIconProps) => {
  return (
    <i
      className="material-icons"
      style={{
        fontSize: props.size || 24,
        color: props.color,
        margin: props.margin,
      }}
    >
      {props.icon}
    </i>
  );
};

export default MaterialIcon;
