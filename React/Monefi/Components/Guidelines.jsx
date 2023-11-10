import React, { Fragment } from "react";
import { Container, Row, Breadcrumb } from "react-bootstrap";
import { guidesResourcesData } from "./guidelinesData";
import GuideCard from "./GuideCard";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import "./guide.css";

const GuideLines = (props) => {
  const _logger = debug.extend("Guidelines");
  const user = props.currentUser;
  _logger("user data", user);

  const guideSingleMap = (guideCardData) => {
    return (
      <div
        className="p-2 col-md-6 col-xs-12"
        key={"GuidesA-" + guideCardData.id}
      >
        <GuideCard guide={guideCardData} />
      </div>
    );
  };
  const guide = guidesResourcesData.map(guideSingleMap);

  return (
    <Fragment>
      <div className="py-8 guides-gradient-header">
        <div className="container px-10">
          <Row className="align-center">
            <h1>Guides & Resources</h1>
          </Row>
        </div>
      </div>
      <br />
      <Container className="px-10">
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/helpcenter">Help Center</Breadcrumb.Item>
            <Breadcrumb.Item active>Guides & Resources</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <br />
        <Row className="grid gap-0 row-gap-3">{guide}</Row>
      </Container>
    </Fragment>
  );
};

GuideLines.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isConfirmed: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
};

export default GuideLines;
