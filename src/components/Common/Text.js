import React from "react";

export default function Text(props) {
  return (
    <div className={"input-group input-group-sm mw-100 " + props.className}>
      {props.label ? (
        <div className="input-group-prepend">
          <label className="input-group-text">{props.label}</label>
        </div>
      ) : null}
      <input
        className="input-field form-control form-control-sm"
        type={props.type}
        // as={props.as}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e)}
      />
    </div>
  );
}
