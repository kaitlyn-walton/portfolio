import React, { useEffect, useState, memo } from "react";
import transferWiseService from "services/transferWiseService";
import debug from "sabio-debug";
import { Col, Row, Button } from "react-bootstrap";
import cc from "currency-codes/data";
import SelectCurrency from "./SelectCurrency";
import { BiTransferAlt } from "react-icons/bi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { labelFunc } from "../transferWiseUtils";
import toastr from "toastr";
import { useNavigate, useLocation } from "react-router-dom";
import { quoteSchema } from "../../../schemas/transferWiseSchema";
import "../transferwise.css";
const _logger = debug.extend("QuoteForm");
function QuoteForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const exchange = location.state;
  _logger(exchange, "received exchange data");

  const initialInput = {
    sourceAmount: 0,
  };
  const [pageData, setPageData] = useState({
    profiles: [],
    profileOptions: [],
    profileId: "",
    currencies: cc,
  });
  const [sourceCurrency, setSource] = useState({
    label: labelFunc("USD", "US Dollar"),
    value: "USD",
  });
  const [targetCurrency, setTarget] = useState({
    label: labelFunc("MXN", "Mexican Peso"),
    value: "MXN",
  });
  useEffect(() => {
    transferWiseService
      .getProfiles()
      .then(OnGetProfileSuccess)
      .catch(onGetProfileError);
    if (location.state !== null) {
      setTarget((prevState) => {
        const ps = { ...prevState };
        ps.label = labelFunc(location.state.code, location.state.currency);
        ps.value = location.state.code;
        _logger(ps);
        return ps;
      });
    }
  }, []);
  const OnGetProfileSuccess = (res) => {
    _logger("Response from get profiles", res);
    const profiles = res.item;
    setPageData((prevState) => {
      let newState = { ...prevState };
      newState.profiles = profiles;
      newState.profileOptions = profiles.map(mapProfileOptions);
      return newState;
    });
  };
  const onGetProfileError = (err) => {
    _logger("Error from get profiles", err);
  };
  const onSelectChange = (e) => {
    setPageData((prevState) => {
      let newState = { ...prevState };
      newState.profileId = e.target.value;
      return newState;
    });
  };
  const onQuoteSubmit = (values) => {
    toastr.info("Loading...");
    const payload = {
      sourceCurrency: sourceCurrency.value,
      targetCurrency: targetCurrency.value,
      sourceAmount: values.sourceAmount,
      profileId: pageData.profileId,
    };
    transferWiseService
      .createQuote(payload)
      .then(onCreateQuoteSuccess)
      .catch(onCreateQuoteFail);
  };
  const onCreateQuoteSuccess = (res) => {
    toastr.remove();
    const resObject = res.item;
    let payload = resObject;
    if (
      !resObject.targetAmountAllowed ||
      resObject.paymentOptions?.length === 0
    ) {
      //redefine payload if the response from the api is a quote that's not allowed
      payload = {
        sourceCurrency: sourceCurrency.value,
        targetCurrency: targetCurrency.value,
      };
    }
    let sendState = { type: "QUOTE_INFO", payload: payload };
    navigate("./new", { state: sendState });
  };
  const onCreateQuoteFail = (err) => {
    const errorMsg =
      err.response.data.errors[0] || "Error while creating a new quote";
    _logger("error", errorMsg);
    toastr.remove();
    toastr.error(errorMsg);
  };
  const onSwitchClick = () => {
    setSource(() => targetCurrency);
    setTarget(() => sourceCurrency);
  };
  function mapProfileOptions(option) {
    return (
      <option value={option.id} key={option.id}>
        {option.type.toUpperCase()}
      </option>
    );
  }
  return (
    <>
      <Row>
        <Col>
          <div className="border-bottom pb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-1 fw-bold">
              <h2 className="mb-1 fw-bold">Transfers</h2>
              <p className="text-secondary fs-6">
                Seamless International Transfers
              </p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="py-4 justify-content-center">
        <Col className="wise-container">
          <div className="card px-4 py-3">
            <Row className="py-4 d-md-flex align-items-center justify-content-between">
              <Col className="mb-1 fw-bold col-md-7 col-12">
                <p className="text-primary fs-5">
                  From which account would you like to make your transfer?
                </p>
              </Col>
              <Col className="form-group col-md-5 col-12 px-2">
                <label className="text-dark">Choose account</label>
                <select
                  id="profileId"
                  className="form-select text-dark fw-bold"
                  onChange={onSelectChange}
                >
                  <option value={""} disabled={pageData.profileId}>
                    Choose account...
                  </option>
                  {pageData.profileOptions}
                </select>
              </Col>
            </Row>
            <Row className="mb-4">
              <SelectCurrency
                setValue={setSource}
                value={sourceCurrency}
                label={"From"}
              />
              <div className="col-md-2 col-12 mt-4 d-flex justify-content-center align-items-end">
                <div role="button" onClick={onSwitchClick}>
                  <BiTransferAlt
                    size={"3.3em"}
                    className="rounded-circle border monefipay-icon-color p-2"
                  />
                </div>
              </div>
              <SelectCurrency
                setValue={setTarget}
                value={targetCurrency}
                label={"To"}
              />
            </Row>
            <Formik
              enableReinitialize={true}
              initialValues={initialInput}
              onSubmit={onQuoteSubmit}
              validationSchema={quoteSchema}
            >
              <Form className="formik-form">
                <Row className="align-items-center d-flex justify-content-center">
                  <Col className="col-md-5 col-12">
                    <label className="fw-bold mb-3 monefi-text-color">
                      Amount to send
                    </label>
                    <div className="input-group my-2">
                      <Field
                        type="number"
                        className="form-control "
                        name="sourceAmount"
                      />
                      <span className="input-group-text" id="basic-addon2">
                        {sourceCurrency.value}
                      </span>
                    </div>
                    <ErrorMessage
                      name="sourceAmount"
                      component="div"
                      className="formik-has-error"
                    />
                  </Col>
                </Row>
                <Row className="align-items-center d-flex justify-content-center">
                  <Col className="col-md-5 d-flex justify-content-center">
                    <Button
                      type="submit"
                      disabled={!pageData.profileId}
                      className="monefi-gradient mt-5"
                    >
                      Generate Quote
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Formik>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default memo(QuoteForm);
