import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import debug from "sabio-debug";
import {
  Card,
  Col,
  Container,
  Row,
  Tab,
  Nav,
  Breadcrumb,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import lendersService from "services/lenderService";
import PropTypes from "prop-types";
import LenderLoans from "components/lenderloan/LenderLoans";
import LenderLocation from "./LenderLocation";

const _logger = debug.extend("lenderInfo");

function LenderInfo(props) {
  const { id } = useParams();
  _logger(props, "should be props");
  const [newLender, setNewLender] = useState({
    id: 0,
    lenderType: {},
    loanType: {},
    statusType: {},
    location: {},
    dateCreated: "",
    dateModified: "",
    name: "",
    description: "",
    logo: "",
    website: "",
    statusId: 0,
    createdBy: 0,
    modifiedBy: 0,
  });

  const { state } = useLocation();
  const roles = props.currentUser.roles;
  _logger(roles, "rolesInInformation");

  useEffect(() => {
    if (state !== null) {
      setNewLender(state);
      _logger(state, "hydrated object");
    } else {
      lendersService.getById(id).then(onGetSuccess).catch(onGetFail);
    }
  }, [state]);

  const onGetSuccess = (response) => {
    _logger(response.data.item, "GetById Object");
    const lender = response.data.item;
    setNewLender({
      id: lender.id,
      lenderType: lender.lenderType,
      loanType: lender.loanType,
      statusType: lender.statusType,
      location: lender.location,
      dateCreated: lender.dateCreated,
      dateModified: lender.dateModified,
      name: lender.name,
      description: lender.description,
      logo: lender.logo,
      website: lender.website,
      statusId: lender.statusType.id,
      createdBy: lender.createdBy.id,
      modifiedBy: lender.modifiedBy.id,
    });
  };
  const onGetFail = (response) => {
    _logger(response);
  };

  return (
    <React.Fragment>
      <Col lg={12} md={12} sm={12}>
        <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
          <div className="mb-3 mb-md-0">
            <Breadcrumb>
              <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item href="/lenders">Lenders</Breadcrumb.Item>
              <Breadcrumb.Item active>Information</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <Link to="/lenders" className="btn btn-primary">
              Back To Lenders
            </Link>
          </div>
        </div>
      </Col>
      {newLender.id === 0 ? (
        <h1 className="text-primary">Loading...</h1>
      ) : (
        <>
          <div className="pt-lg-8 pb-lg-16 pt-8 pb-12 bg-primary">
            <Container>
              <Row className="align-items-center">
                <Col xl={12} lg={12} md={12} sm={12}>
                  <div>
                    <div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-between">
                          <h1 className="text-white display-4 fw-semi-bold px-2">
                            {newLender.name}
                          </h1>
                          {roles.includes("Admin") ? (
                            <Link
                              to={{
                                pathname: `/lender/${newLender.id}/edit/`,
                              }}
                              state={newLender}
                              className="btn btn-white mb-2 ms-10"
                            >
                              Edit
                            </Link>
                          ) : (
                            <Link to="#" className="btn btn-white mb-2 ms-10">
                              Apply!
                            </Link>
                          )}
                        </div>
                        <div>
                          <Image
                            src={newLender.logo}
                            className="rounded bg-primary"
                            alt="LenderLogo"
                            width="250px"
                            height="250px"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-3">
                          <span className="text-white fw-bold h2 me-2 px-2">
                            {newLender.lenderType.name}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-white fw-bold h2 me-2 px-2">
                            {newLender.loanType.name}
                          </span>
                        </div>
                        <div>
                          <p className="text-white mb-6 lead px-2">
                            {newLender.description}
                          </p>
                          <div className="d-flex">
                            <i className="fe fe-award align-middle me-2 text-success px-2"></i>
                            <p className="text-white">Example perk</p>
                            <i className="fe fe-award me-2 align-middle text-success px-2"></i>
                            <p className="text-white">Example perk</p>
                            <i className="fe fe-calendar align-middle me-2 text-info px-2"></i>
                            <p className="text-white">
                              Created: {newLender.dateCreated}
                            </p>
                            <i className="fe fe-clock align-middle me-2 text-warning px-2"></i>
                            <p className="text-white">
                              {newLender.statusType.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="pb-10">
            <Container>
              <Row>
                <Col lg={12} md={12} className="mt-n8 mb-4 mb-lg-0">
                  <Tab.Container defaultActiveKey="contents">
                    <Card>
                      <Nav className="nav-lb-tab justify-content-evenly">
                        {[
                          "Contents",
                          "Description",
                          "Reviews",
                          "Location",
                          "Loans",
                        ].map((item, index) => (
                          <Nav.Item key={index}>
                            <Nav.Link
                              href={`#${item.toLowerCase()}`}
                              eventKey={item.toLowerCase()}
                              className="mb-sm-3 mb-md-0"
                            >
                              {item}
                            </Nav.Link>
                          </Nav.Item>
                        ))}
                      </Nav>
                      <Card.Body className="p-0">
                        <Tab.Content>
                          <Tab.Pane
                            eventKey="contents"
                            className="pb-4 pt-3 px-4"
                          >
                            <h2>Lender Name: {newLender.name}</h2>
                            <h4>Status: {newLender.statusType.name}</h4>
                            <h4>Lender Type: {newLender.lenderType.name}</h4>
                            <h4>Loan Type: {newLender.loanType.name}</h4>
                          </Tab.Pane>
                          <Tab.Pane eventKey="description" className="pb-4 p-4">
                            {/* Description */}
                            <h4>{newLender.description}</h4>
                          </Tab.Pane>
                          <Tab.Pane eventKey="reviews" className="pb-4 p-4">
                            {/* Reviews */}
                            <h4>
                              Any future review component displaying lender
                              company reviews
                            </h4>
                          </Tab.Pane>
                          <Tab.Pane eventKey="location" className="pb-4 p-4">
                            {/* Location */}
                            <LenderLocation
                              location={newLender?.location}
                              key={newLender.id}
                            />
                          </Tab.Pane>
                          <Tab.Pane eventKey="loans" className="pb-4 p-4">
                            {/* Loans */}
                            <LenderLoans roles={roles}></LenderLoans>
                          </Tab.Pane>
                        </Tab.Content>
                      </Card.Body>
                    </Card>
                  </Tab.Container>
                </Col>
              </Row>
            </Container>
          </div>
        </>
      )}
    </React.Fragment>
  );
}

LenderInfo.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
    isLoggedIn: PropTypes.bool,
  }),
};

export default React.memo(LenderInfo);
