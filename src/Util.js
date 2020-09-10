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
    <Form.Group as={Col} style={props.style}>
      {props.label ? <Form.Label>{props.label}</Form.Label> : null}
      <Form.Control
        size="sm"
        type={props.type}
        as={props.as}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e)}
      ></Form.Control>
      {props.label ? (
        <Form.Text className="text-muted">{props.message}</Form.Text>
      ) : null}
    </Form.Group>
  );
}

export function Select(props) {
  return (
    <Form.Group as={Col}>
      {props.label ? <Form.Label>{props.label}</Form.Label> : null}
      <Form.Control
        as="select"
        size="sm"
        name={props.name}
        defaultValue={props.default}
        onChange={(e) => props.onChange(e)}
        custom
      >
        <option value=""></option>
        {props.options ? (
          props.options.map((item) => {
            return (
              <option
                key={props.componentName + item.name}
                value={item.name.toUpperCase()}
              >
                {item.name.toUpperCase()}
              </option>
            );
          })
        ) : (
            <option value={"No " + props.name}>No {props.name}</option>
          )}
      </Form.Control>
    </Form.Group>
  );
}

export function ModalField(props) {
  // console.log(props);
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
    <div>
      {!props.data.isLoading && props.data.logs && props.headerInfo ? (
        <Table size="sm" bordered hover>
          <thead>
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
        </Table>
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
