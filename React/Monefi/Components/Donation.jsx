import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import "./donation.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import lookUpService from "services/lookUpService";
import debug from "sabio-debug";
import { useLocation } from "react-router";

function Donation() {
  const _logger = debug.extend("donation");
  const [charityNames, setCharityNames] = useState({
    data: [],
    charity: [],
    selectedMessage: "",
  });
  const [selectedOption, setSelectedOption] = useState(null);

  const location = useLocation();
  const state = location.state;
  _logger(state);

  useEffect(() => {
    lookUpService
      .getTypes3Col(["CharityTypes"])
      .then(onSuccessCharity)
      .catch(onErrorCharity);

    if (location.state !== null) {
      setSelectedOption(location.state.id);
    }
  }, []);

  const onSuccessCharity = (response) => {
    _logger("Success", response);
    setCharityNames((prevState) => {
      const dono = { ...prevState };
      dono.data = response.item.charityTypes;
      dono.charity = response.item.charityTypes.map(mapOptions);
      return dono;
    });
  };

  const onErrorCharity = (err) => {
    _logger("Error", err);
  };

  const mapOptions = (element) => {
    return (
      <option key={element.id} value={element.id}>
        {element.name}
      </option>
    );
  };

  const onSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);

    setCharityNames((prevState) => {
      const dono = { ...prevState };

      const index = dono.data.findIndex(
        (aProgram) => aProgram.id === selectedId
      );
      if (index >= 0) {
        dono.selectedMessage = dono.data[index].code;
      }

      return dono;
    });

    setSelectedOption(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="container d-flex justify-content-center align-items-center">
        <Card className="donation-card">
          <Card.Body className="p-lg-6">
            <form>
              <div className="mb-3">
                <label htmlFor="donation" className="form-label donation-title">
                  Donate
                </label>
                <div className="donation-intro">
                  Donating to charities is a powerful act that can make a
                  significant difference in the lives of others. It provides an
                  opportunity to alleviate human suffering by supporting
                  initiatives that tackle pressing social issues like poverty,
                  hunger, and education inequality. Charities work tirelessly to
                  create lasting change by addressing the root causes of these
                  problems and promoting sustainable solutions. By contributing,
                  individuals become catalysts for positive transformation,
                  helping to build stronger, healthier, and more equitable
                  communities for everyone.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="donate" className="form-label">
                  Select program to donate to:
                </label>
                <select
                  name="donate"
                  id="donate"
                  className="form-select"
                  value={selectedOption}
                  onChange={onSelectChange}
                >
                  <option>Select Charity Fund...</option>
                  {charityNames.charity}
                </select>
              </div>
              <div className="donations-description">
                {charityNames.selectedMessage}
              </div>
              <PayPalScriptProvider options={{ clientId: "test" }}>
                <PayPalButtons style={{ layout: "horizontal" }} />
              </PayPalScriptProvider>
            </form>
          </Card.Body>
        </Card>
      </div>
    </React.Fragment>
  );
}

export default Donation;
