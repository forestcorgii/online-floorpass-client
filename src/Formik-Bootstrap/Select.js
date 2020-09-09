import React, { useRef } from "react";
import { useField } from "formik";
import { Form, Overlay, Tooltip } from "react-bootstrap";


export default function Select  ({  options,label, ...props })  {
    const [fields, meta] = useField(props);
    const target = useRef(props);
    const isInvalid = meta.touched && meta.error;
    return (
      <>
        {label ? <label> {props.label}</label> : null}
  
        <Form.Control
          inline
          custom
          {...fields}
          {...props}
          as="select"
          ref={target}
          isInvalid={isInvalid}
        >
          <option value=""></option>
          {options ? (
            options.map((item) => {
              // console.log(item);
              return (
                <option
                  key={label.componentName + item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              );
            })
          ) : (
            <option value={"No " + props.name}>No {props.name}</option>
          )}
        </Form.Control>
        <Overlay target={target.current} show={isInvalid} placement="right">
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              {meta.error}
            </Tooltip>
          )}
        </Overlay>
      </>
    );
  };