import React from "react";

export default function Select(props) {
  return (
    <div className={"input-group input-group-sm mw-100 " + props.className}>
      {props.label ? (
        <div className="input-group-prepend">
          <label className="input-group-text">{props.label}</label>
        </div>
      ) : null}
      <select
        className="input-field custom-select custom-select-sm"
        name={props.name}
        // defaultValue={props.default}
        value={props.default}
        onChange={(e) => props.onChange(e)}
        custom="true"
      >
        {/* <option value=""></option> */}
        {props.options ? (
          props.options.map((item, i) => {
            return (
              <option key={props.name + props.keyLoc + i} value={item.name}>
                {item.name}
              </option>
            );
          })
        ) : (
          <option value={"No " + props.name}>No {props.name}</option>
        )}
      </select>
    </div>
  );
}
