import React from "react";
import debug from "sabio-debug";
import { useNavigate, Link } from "react-router-dom";
import "./charitableFunds.css";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { Row } from "react-bootstrap";

function CharityFundsCardTemplate(props) {
  const _logger = debug.extend("CharityFundsCardTemplate");

  const charity = props.fund;
  _logger({ charity });

  const navigate = useNavigate();

  const onEditClicked = () => {
    const card = {
      type: "charity_card",
      payload: charity,
    };
    navigate(`/charitablefunds/${charity.id}/update/`, { state: card });
  };

  return (
    <div className="col mb-3">
      <Card className="h-100">
        <img src={charity.imageUrl} className="p-3 h-40" alt="imageUrl" />
        <Card.Body className="h-40 overflow-auto">
          <a href={charity.url} target="charity">
            <Card.Text className="charitable-titleCard text-center">
              {charity.name}
            </Card.Text>
          </a>
          <br />
          <Card.Text>{charity.description}</Card.Text>
        </Card.Body>
        <Row className="row-cols-2 p-3">
          <div className="col">
            <Link
              to="/donate"
              state={charity}
              type="button"
              className="submit-button"
            >
              Donate
            </Link>
          </div>
          <div className="col">
            <button
              type="button"
              onClick={onEditClicked}
              className="cancel-button float-end"
            >
              Edit
            </button>
          </div>
        </Row>
      </Card>
    </div>
  );
}

CharityFundsCardTemplate.propTypes = {
  fund: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default CharityFundsCardTemplate;
