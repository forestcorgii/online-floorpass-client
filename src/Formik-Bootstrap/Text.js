import React, { useRef } from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";
import Tooltip from "./Tooltip";

export default function  Text  ({ label, ...props })  {
    const [fields, meta] = useField(props);
    const target = useRef(null);
    const isInvalid = meta.touched && meta.error;
    //   console.log(meta);
    //   console.log(props);
    //   console.log(fields);
    return (
      <>
        {label ? <label> {label}</label> : null}
  
        <Form.Control ref={target} {...fields} {...props} isInvalid={isInvalid} />
  
        <Tooltip
          message={meta.error}
          target={target.current}
          show={isInvalid}
          placement="right"
        />
      </>
    );
  };