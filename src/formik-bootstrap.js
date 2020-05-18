import React, { useRef } from "react";
import { useField } from "formik";
import { Form, Overlay, Tooltip, InputGroup, Button } from "react-bootstrap";

export const CheckField = ({ label, ...props }) => {
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

export const MyTextField = ({ label, ...props }) => {
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

      <TooltipField
        message={meta.error}
        target={target.current}
        show={isInvalid}
        placement="right"
      />
    </>
  );
};

export const TooltipField = ({ message, ...props }) => {
  return (
    <Overlay {...props}>
      {(props) => <Tooltip {...props}>{message}</Tooltip>}
    </Overlay>
  );
};

export const InputGroupField = ({
  label,
  normalButton,
  toggleButton,
  ...props
}) => {
  const [fields, meta] = useField(props);

  const disabled =
    (toggleButton ? !toggleButton.value : false) || props.disabled;

  const isInvalid = meta.touched && meta.error && !disabled;
  const target = useRef();

  var buttonValue, ButtonA;
  if (toggleButton) {
    buttonValue = toggleButton.button[toggleButton.value ? 0 : 1];
    ButtonA = typeof buttonValue !== "string" ? buttonValue : Button;
  }

  console.log(typeof ButtonA);
  const toggle = toggleButton ? (
    <InputGroup.Append>
      <ButtonA onClick={() => props.onToggle(!toggleButton.value)}>
        {buttonValue}
      </ButtonA>
    </InputGroup.Append>
  ) : null;

  const normal = normalButton ? (
    <InputGroup.Append>
      <Button onClick={() => props.onClick()}>{normalButton}</Button>
    </InputGroup.Append>
  ) : null;
  return (
    <>
      <InputGroup ref={target}>
        <Form.Control
          disabled={disabled}
          isInvalid={isInvalid}
          {...fields}
          {...props}
        />

        <InputGroup.Append>
          {label ? <InputGroup.Text>{label}</InputGroup.Text> : null}
        </InputGroup.Append>

        {normal}
        {toggle}
      </InputGroup>

      <TooltipField
        message={meta.error}
        target={target.current}
        show={isInvalid}
        placement="right"
      />
    </>
  );
};

export const MySelectField = ({ label, options, ...props }) => {
  const [fields, meta] = useField(props);
  const target = useRef(props);
  const isInvalid = meta.touched && meta.error;
  return (
    <>
      {label ? <label> {label}</label> : null}

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

// export default { MySelectField, MyTextField, CheckField, InputGroupField };
