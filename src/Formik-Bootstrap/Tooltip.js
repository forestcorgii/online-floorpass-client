import React from "react";
import {  Overlay, Tooltip } from "react-bootstrap";

export default  function MyTooltip ({ message, ...props })  {
    return (
      <Overlay {...props}>
        {(props) => <Tooltip {...props}>{message}</Tooltip>}
      </Overlay>
    );
  };