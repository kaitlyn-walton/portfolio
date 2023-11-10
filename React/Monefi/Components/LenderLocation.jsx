import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Row } from "react-bootstrap";

const LenderLocation = ({ location }) => {
  const _logger = debug.extend("LenderLocation");
  const newLocation = location;
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

  _logger(newLocation);

  const [center, setCenter] = useState({
    lat: "",
    lng: "",
  });

  const googleMapSize = {
    height: "50vh",
    width: "100%",
  };

  useEffect(() => {
    setCenter({
      lat: newLocation?.latitude,
      lng: newLocation?.longitude,
    });
  }, [location]);

  return (
    <React.Fragment>
      <Row className="align-items-center">
        <div className="col-6 ">
          <h4>
            Address: {newLocation.lineOne} {newLocation.lineTwo}
          </h4>
          <h4>City: {newLocation.city}</h4>
          <h4>State: {newLocation.state}</h4>
          <h4>Zipcode: {newLocation.zip}</h4>
          <br />
          <br />
          <p className="fs-4">
            <a
              href={`https://www.google.com/maps/dir/${newLocation?.latitude},${newLocation?.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </p>
        </div>
        <div className="col-6">
          <LoadScript googleMapsApiKey={apiKey}>
            {center && apiKey && (
              <GoogleMap
                mapContainerStyle={googleMapSize}
                zoom={10}
                center={center}
                defaultCenter={center}
              >
                <Marker position={center} />
              </GoogleMap>
            )}
          </LoadScript>
        </div>
      </Row>
    </React.Fragment>
  );
};

LenderLocation.propTypes = {
  location: PropTypes.shape({
    city: PropTypes.string.isRequired,
    createdBy: PropTypes.number.isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isDeleted: PropTypes.bool.isRequired,
    latitude: PropTypes.number.isRequired,
    lineOne: PropTypes.string.isRequired,
    lineTwo: PropTypes.string,
    locationTypeId: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    modifiedBy: PropTypes.number,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string,
  }).isRequired,
};

export default LenderLocation;
