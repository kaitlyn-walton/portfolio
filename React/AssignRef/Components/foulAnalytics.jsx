import React, { useState, useEffect } from "react";
import { Col, Card, Row, Form } from "react-bootstrap";
import debug from "sabio-debug";
import "./gradefoulanalytics.css";
import toastr from "toastr";
import gradeFoulAnalyticService from "services/gradeFoulAnalyticService";

const FoulAnalytics = () => {
  const _logger = debug.extend("FoulAnalytics");

  //#region     ---state values---
  const [dropdownData, setDropdownData] = useState({
    season: [],
    mappedSeasons: [],
    user: [],
    mappedUsers: [],
  });

  const [foulSeasonFormData, setFoulSeasonFormData] = useState({
    seasonIdOne: "5",
  });

  const [foulSeasonUserFormData, setFoulSeasonUserFormData] = useState({
    seasonIdTwo: "5",
    userId: "8",
  });

  const [foulTotal, setFoulTotal] = useState({
    total: [],
    mappedTotal: [],
    userFoulTotal: [],
    mappedUserFoulTotal: [],
  });
  //#endregion

  //#region     ---useEffect---
  useEffect(() => {
    _logger("useEffect firing");

    gradeFoulAnalyticService
      .getSimpleSeasons()
      .then(onGetSeasonsSuccess)
      .catch(onGetSeasonsError);

    gradeFoulAnalyticService
      .getSimpleUsers()
      .then(onGetUserSuccess)
      .catch(onGetUserError);
  }, []);

  const onGetSeasonsSuccess = (response) => {
    _logger(response.data.items);
    let newSeason = response.data.items;

    setDropdownData((prevState) => {
      const sd = { ...prevState };
      sd.season = newSeason;
      sd.mappedSeasons = newSeason.map(mapSeasons);
      _logger(sd);
      return sd;
    });
  };

  useEffect(() => {
    if (foulSeasonFormData.seasonIdOne) {
      gradeFoulAnalyticService
        .getFoulsBySeason(foulSeasonFormData.seasonIdOne)
        .then(onGetFoulSeasonSuccess)
        .catch(onGetFoulSeasonError);
    }
    if (foulSeasonUserFormData.seasonIdTwo && foulSeasonUserFormData.userId) {
      gradeFoulAnalyticService
        .getFoulsByUser(
          foulSeasonUserFormData.seasonIdTwo,
          foulSeasonUserFormData.userId
        )
        .then(onGetFoulUserSuccess)
        .catch(onGetFoulUserError);
    }
  }, [
    foulSeasonFormData.seasonIdOne,
    foulSeasonUserFormData.seasonIdTwo && foulSeasonUserFormData.userId,
  ]);
  //#endregion

  //#region     ---onChange---
  const onFormFieldChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    const target = event.target;
    const newFoulValue = target.value;
    const nameOfField = target.name;

    setFoulSeasonFormData((prevState) => {
      _logger("updater onChange");
      const newFoulObject = {
        ...prevState,
      };
      newFoulObject[nameOfField] = newFoulValue;
      return newFoulObject;
    });
  };

  const onFormTwoFieldChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    const target = event.target;
    const newFoulUserValue = target.value;
    const nameOfField = target.name;

    setFoulSeasonUserFormData((prevState) => {
      _logger("updater onChange");
      const newFoulUserObject = {
        ...prevState,
      };
      newFoulUserObject[nameOfField] = newFoulUserValue;
      return newFoulUserObject;
    });
  };
  //#endregion

  //#region     ---success/error responses---
  const onGetSeasonsError = (error) => {
    _logger(error);
    toastr.error("Unable to access season data.");
  };

  const onGetUserSuccess = (response) => {
    _logger(response.data.items);
    let newUser = response.data.items;

    setDropdownData((prevState) => {
      const ud = { ...prevState };
      ud.user = newUser;
      ud.mappedUsers = newUser.map(mapUsers);
      _logger(ud);
      return ud;
    });
  };

  const onGetUserError = (error) => {
    _logger(error);
    toastr.error("Unable to access officials' data.");
  };

  const onGetFoulSeasonSuccess = (response) => {
    _logger(response.data.items);
    let totalFouls = response.data.items;

    setFoulTotal((prevState) => {
      const ft = { ...prevState };
      ft.total = totalFouls;
      ft.mappedTotal = totalFouls.map(mapFoulCard);
      return ft;
    });
  };

  const onGetFoulSeasonError = (error) => {
    _logger(error);
    toastr.error("Unable to access season foul data.");
  };

  const onGetFoulUserSuccess = (response) => {
    _logger(response.data.items);
    let foulUser = response.data.items;

    setFoulTotal((prevState) => {
      const fut = { ...prevState };
      fut.userFoulTotal = foulUser;
      fut.mappedUserFoulTotal = foulUser.map(mapUserFoulCard);
      return fut;
    });
  };

  const onGetFoulUserError = (error) => {
    _logger(error);
    toastr.error("Unable to access Officials' foul data.");
  };
  //#endregion

  //#region     ---mappers---
  const mapUserFoulCard = (userFoul) => {
    return (
      <Card className="h-100">
        <Card.Body>
          <p className="text-center fs-3">
            Fouls called by {userFoul.user.firstName} {userFoul.user.mi}{" "}
            {userFoul.user.lastName} for {userFoul.season.name}:
          </p>
          <p className="text-center fs-2"> {userFoul.total} </p>
        </Card.Body>
      </Card>
    );
  };

  const mapFoulCard = (foul) => {
    return (
      <Card className="h-100">
        <Card.Body>
          <p className="text-center fs-3">Fouls for {foul.season.name}: </p>
          <br />
          <p className="text-center fs-2"> {foul.total} </p>
        </Card.Body>
      </Card>
    );
  };

  const mapUsers = (aUser) => {
    return (
      <option key={aUser.id} value={aUser.id}>
        {aUser.firstName} {aUser.mi} {aUser.lastName}
      </option>
    );
  };

  const mapSeasons = (type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  };
  //#endregion

  return (
    <React.Fragment>
      <div className="container">
        <br />
        <Row>
          <Col xl={6} lg={12} md={12}>
            <Card>
              <Card.Header>
                <h3>Fouls Per Season</h3>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <div className="col-12">
                      <div className="form-group">
                        <select
                          className="form-select"
                          id="seasonIdOne"
                          name="seasonIdOne"
                          value={foulSeasonFormData.seasonIdOne}
                          onChange={onFormFieldChange}
                        >
                          <option>Select a season</option>
                          {dropdownData.mappedSeasons}
                        </select>
                      </div>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={12} md={12}>
            <Card>
              <Card.Header>
                <h3>Fouls Per Season By Official</h3>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <div className="col-6">
                      <div className="form-group">
                        <select
                          className="form-select"
                          id="seasonIdTwo"
                          name="seasonIdTwo"
                          value={foulSeasonUserFormData.seasonIdTwo}
                          onChange={onFormTwoFieldChange}
                        >
                          <option>Select a season</option>
                          {dropdownData.mappedSeasons}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <select
                          className="form-select"
                          id="userId"
                          name="userId"
                          value={foulSeasonUserFormData.userId}
                          onChange={onFormTwoFieldChange}
                        >
                          <option>Select an Official</option>
                          {dropdownData.mappedUsers}
                        </select>
                      </div>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
        <Row className="justify-content-center">
          <Col xl={3} lg={12} md={12}>
            {foulTotal.mappedTotal}
          </Col>
          <Col xl={3} lg={12} md={12}>
            {foulTotal.mappedUserFoulTotal}
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default FoulAnalytics;
