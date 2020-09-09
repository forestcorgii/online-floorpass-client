import React from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";

export default function Check ({ label, ...props })  {
    const [fields, meta] = useField(props);
    return (
      <>
        <Form.Check {...fields} {...props} label={label} />
  
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </>
    );
  };