import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import charityAddSchema from "schemas/charitableFundsSchema";
import charitableFundsService from "services/charitableFundsService";
import toastr from "toastr";
import { useLocation, useNavigate } from "react-router-dom";
import UploadFile from "../files/UploadFile";
import { Link } from "react-router-dom";
import { Card, Row } from "react-bootstrap";

const _logger = debug.extend("CharitableFundsForm");
function CharitableFundsForm() {
  const [charityForm, setCharityForm] = useState({
    name: "",
    description: "",
    url: "",
    isDeleted: false,
    imageUrl: "",
  });
  _logger("hi", charityForm);

  const navigate = useNavigate();

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state?.type === "charity_card") {
      const charity = state.payload;
      setCharityForm((prevState) => {
        const newState = { ...prevState };
        newState.name = charity.name;
        newState.description = charity.description;
        newState.url = charity.url;
        newState.imageUrl = charity.imageUrl;
        newState.isDeleted = charity.isDeleted;
        return charity;
      });
    }
  }, []);

  const onAddCharitableFundsSubmit = (values) => {
    _logger("hiiiiii", values);
    const updateCard = {
      name: values.name,
      description: values.description,
      url: values.url,
      imageUrl: values.imageUrl,
      isDeleted: Boolean(values.isDeleted),
    };

    if (values.id) {
      charitableFundsService
        .update(values.id, updateCard)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    } else {
      charitableFundsService
        .addCharitableFunds(updateCard)
        .then(onAddCharitableFundsSuccess)
        .catch(onAddCharitableFundsError);
    }
  };

  const onAddCharitableFundsSuccess = (response) => {
    setCharityForm((prevState) => {
      const item = { ...prevState };
      item.id = response.item;
      return item;
    });
    toastr.success("New Charitable Fund added successfully");
    navigate(`/charitablefunds/list`);
  };

  const onAddCharitableFundsError = (err) => {
    _logger(err, "onAddCharitableFundsError");
    toastr.error("Please try again, not able to add Charitable Fund");
  };

  const onUpdateSuccess = (data) => {
    _logger(data);
    toastr.success("Update Successful");
    navigate(`/charitablefunds/list`);
  };
  const onUpdateError = (err) => {
    _logger(err);
    toastr.error("Update Not Successful");
  };

  return (
    <React.Fragment>
      <h2 className="text-center">
        {charityForm.id ? "Update Charitable Fund" : "Create Charitable Fund"}
      </h2>
      <div className="container d-flex justify-content-center align-items-center">
        <Card>
          <Card.Body className="p-lg-6">
            <Formik
              enableReinitialize={true}
              validationSchema={charityAddSchema}
              onSubmit={onAddCharitableFundsSubmit}
              initialValues={charityForm}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="form-control"
                      id="name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="has-error charitableFormikErrors"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label ">
                      Description/Model
                    </label>
                    <Field
                      type="text"
                      name="description"
                      className="form-control "
                      id="description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="has-error charitableFormikErrors"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="url" className="form-label">
                      Site Url
                    </label>
                    <Field
                      type="text"
                      name="url"
                      className="form-control"
                      id="url"
                    />
                    <ErrorMessage
                      name="url"
                      component="div"
                      className="has-error charitableFormikErrors"
                    />
                  </div>
                  <div className="w-50 mx-18">
                    <label>Upload your image here</label>
                    <UploadFile
                      getResponseFile={(arr) => {
                        setFieldValue("imageUrl", arr[0].url);
                      }}
                    />
                  </div>
                  <br />
                  <Row>
                    <div>
                      <Link
                        to="/charitablefunds/list"
                        type="button"
                        className="cancel-button"
                      >
                        Back
                      </Link>
                      <button
                        type="submit"
                        className="submit-button charitable-edit-Button"
                      >
                        {charityForm.id ? "Update" : "Create"}
                      </button>
                    </div>
                  </Row>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>
    </React.Fragment>
  );
}
export default CharitableFundsForm;
