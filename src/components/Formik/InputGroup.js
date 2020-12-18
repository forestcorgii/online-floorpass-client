import React, { useRef } from "react";
import { useField } from "formik";
import { Form, InputGroup, Button } from "react-bootstrap";
import Tooltip from "./Tooltip";
export default function MyInputGroup({
  label,
  normalButton,
  toggleButton,
  ...props
}) {
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

  // console.log(typeof ButtonA);
  const toggle = toggleButton ? (
    <InputGroup.Append>
      <ButtonA
        disabled={props.disabled}
        onClick={() => props.onToggle(!toggleButton.value)}
      >
        {buttonValue}
      </ButtonA>
    </InputGroup.Append>
  ) : null;

  const normal = normalButton ? (
    <InputGroup.Append>
      <Button disabled={props.disabled} onClick={() => props.onButtonClick()}>
        {normalButton}
      </Button>
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

      <Tooltip
        message={meta.error}
        target={target.current}
        show={isInvalid}
        placement="right"
      />
    </>
  );
}
