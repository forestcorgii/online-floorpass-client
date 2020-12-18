import React from "react";
import { Modal, Button } from "react-bootstrap";
export default function ModalField(props) {
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
            Save
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}
