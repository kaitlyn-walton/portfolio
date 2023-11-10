import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import loginSchema from "schemas/loginSchema";
import PropTypes from "prop-types";

function LoginModal(props) {
  const [loginCred] = useState({
    email: "",
    password: "",
  });

  const { openModal, clickAccess, onLoginClicked, buttonStatus } = props;

  const closeModal = () => {
    props.getCloseHandler();
  };

  return (
    <React.Fragment>
      <Button onClick={clickAccess} disabled={buttonStatus.disabled}>
        {buttonStatus.button}
      </Button>
      <Modal show={openModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={loginCred}
            enableReinitialize={true}
            onSubmit={onLoginClicked}
            validationSchema={loginSchema}
          >
            <Form className="form-group">
              <div className="form-group">
                <Field
                  type="text"
                  name="email"
                  placeHolder="Enter Email"
                  id="email"
                  className="form-control m-2"
                />
                <ErrorMessage name="email" component="div" />
              </div>
              <div className="form-group">
                <Field
                  type="password"
                  placeHolder="Enter Password"
                  id="password"
                  name="password"
                  className="form-control m-2"
                />
                <ErrorMessage name="userPassword" component="div" />
              </div>
              <div>
                <Button type="submit">Sign in</Button>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
LoginModal.propTypes = {
  openModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
  }).isRequired,
  getCloseHandler: PropTypes.func.isRequired,
  clickAccess: PropTypes.func.isRequired,
  onLoginClicked: PropTypes.func.isRequired,
  buttonStatus: PropTypes.shape({
    button: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
  }).isRequired,
};
export default LoginModal;
