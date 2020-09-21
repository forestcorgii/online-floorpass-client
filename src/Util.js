import React from "react";
import { Form, Table, Col, Modal, Button } from "react-bootstrap";

function fillNumber(nm) {
  return nm < 10 ? "0" + nm : nm;
}

export function formatTime(date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return (
    year +
    "-" +
    fillNumber(month) +
    "-" +
    fillNumber(day) +
    " " +
    fillNumber(hour) +
    ":" +
    fillNumber(minute) +
    ":" +
    fillNumber(second)
  );
}

// function ValidateName()

export function ParseName(raw) {
  return `${raw.last_name}, ${raw.first_name}`;
}

export function Text(props) {
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

export function Select(props) {
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
        defaultValue={props.default}
        value={props.default}
        onChange={(e) => props.onChange(e)}
        custom
      >
        <option value=""></option>
        {props.options ? (
          props.options.map((item) => {
            return (
              <option key={props.componentName + item.name} value={item.name}>
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

export function ModalField(props) {
  return (
    <Modal show={props.show} onHide={() => props.onExit()}>
      <Modal.Header>{props.header}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      {props.onClick || props.onExit ? (
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              props.onExit();
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            variant="primary"
            onClick={() => props.onSubmit()}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}

export function Log(props) {
  return (
    <div className="table-responsive">
      {!props.data.isLoading && props.data.logs && props.headerInfo ? (
        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              {props.headerInfo.headers.map((header) => {
                return <th key={props.name + header}>{header}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {props.data.logs.map((item, i) => {
              return (
                <tr
                  className="table-light"
                  key={props.name + i}
                  onClick={props.onClick ? () => props.onClick(item) : null}
                >
                  {props.headerInfo.headers.map((rawHeader, j) => {
                    const header = rawHeader.toLowerCase();
                    const subHeader = props.headerInfo.subHeaders[header];
                    return (
                      <td key={props.name + i + j}>
                        {subHeader && item[header]
                          ? item[header].reverse().map((sItem, k) => {
                              return (
                                <p key={props.name + i + j + k}>
                                  {sItem[subHeader]}
                                </p>
                              );
                            })
                          : item[header]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}

// export function ListField({as, ...props}){
//   const L = as;

//   return ({})
// }
