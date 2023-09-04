import React, { useEffect, useState, useRef } from "react";
import { Table, Row, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./assignmentform.css";
import debug from "sabio-debug";
import assignmentFormService from "services/assignmentFormService";
import officialsService from "services/officialsService";
import * as dateService from "../../utils/dateFormater";
import toastr from "toastr";
import Swal from "sweetalert2";

const AssignmentFormPtTwo = ({
  oneGame,
  currentUser,
  setGameFormData,
  setGameTableData,
  setShow,
  setDropdownData,
}) => {
  const _logger = debug.extend("AssignmentFormPtTwo");

  //#region     ---state values---
  const [positionNumberData, setPositionNumberData] = useState({
    crewNumber: 0,
    replayOfficials: false,
    alternateOfficial: false,
  });

  const [fieldPositionsTable, setFieldPositionTable] = useState({
    positions: [],
    positionsTable: [],
    allOfficials: [],
    mappedOfficials: [],
  });

  const [assignmentFormData, setAssignmentFormData] = useState({
    gameId: oneGame.id,
    assignmentTypeId: "1",
    officialData: [],
    fee: "",
  });
  //#endregion

  const replayCheckRef = useRef();
  const alternateCheckRef = useRef();
  const crewNumberRef = useRef();

  //#region     ---useEffects---
  useEffect(() => {
    officialsService
      .getByConferenceId(currentUser.conferenceId)
      .then(onGetOfficialsSuccess)
      .catch(onGetOfficialsError);
  }, []);

  useEffect(() => {
    assignmentFormService
      .getFieldPositionsByNumber(
        positionNumberData.crewNumber,
        positionNumberData.replayOfficials,
        positionNumberData.alternateOfficial
      )
      .then(onGetFieldPositionSuccess)
      .catch(onGetFieldPositionError);
  }, [positionNumberData]);
  //#endregion

  //#region     ---onChange Handlers---
  const onFormFieldChangeSelect = (event) => {
    _logger("onChangeSelect", { syntheticEvent: event });
    _logger("crewnumber ref: ", crewNumberRef.current.value);

    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (
      crewNumberRef.current.value === "0" &&
      replayCheckRef.current.checked === false &&
      alternateCheckRef.current.checked === false
    ) {
      setFieldPositionTable((prevState) => {
        const fp = { ...prevState };
        fp.positions = [];
        fp.positionsTable = [];
        return fp;
      });
    }

    _logger({ name, value });

    setPositionNumberData((prevState) => {
      const newSelectData = { ...prevState };
      newSelectData[name] = value;
      return newSelectData;
    });
  };

  const onFormFieldChangeCheckbox = (event) => {
    _logger("Replay Check: ", replayCheckRef.current.checked);
    _logger("Alternate Check: ", alternateCheckRef.current.checked);
    _logger("onChangeCheckbox", { syntheticEvent: event });

    const target = event.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    _logger({ name, value });

    if (
      replayCheckRef.current.checked === false &&
      alternateCheckRef.current.checked === false
    ) {
      setFieldPositionTable((prevState) => {
        const fp = { ...prevState };
        fp.positions = [];
        fp.positionsTable = [];
        return fp;
      });
    }

    setPositionNumberData((prevState) => {
      const newCheckboxData = { ...prevState };
      newCheckboxData[name] = value;
      return newCheckboxData;
    });
  };

  const onAssignmentDataChange = (event, pos) => {
    _logger("onAssignmentDataChange", { syntheticEvent: event });

    const target = event.target;
    const value = target.value;

    const offObj = {
      positionId: pos.id,
      userId: value,
      assignmentStatusId: 1,
    };
    let positions = assignmentFormData.officialData.map(
      (item) => item.positionId
    );

    if (positions.includes(pos.id)) {
      setAssignmentFormData((prevState) => {
        const newDataOff = { ...prevState };

        let index = prevState.officialData.findIndex(
          (item) => item.positionId === parseInt(pos.id)
        );

        newDataOff.officialData[index].userId = offObj.userId;

        return newDataOff;
      });
    } else {
      setAssignmentFormData((prevState) => {
        const newDataOff = {
          ...prevState,
        };
        newDataOff.officialData.push(offObj);
        _logger("new state", newDataOff);
        return newDataOff;
      });
    }
  };

  const onFeeFieldChange = (event) => {
    _logger("onChangeThree", { syntheticEvent: event });
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setAssignmentFormData((prevState) => {
      const newData = { ...prevState };
      newData[name] = value;
      return newData;
    });
  };
  //#endregion

  //#region     ---success/error handlers---
  const onGetOfficialsSuccess = (response) => {
    let newOfficials = response.items;
    _logger(newOfficials);
    let users = newOfficials.map(mapNewOfficialInfo);
    _logger(users);

    setFieldPositionTable((prevState) => {
      const o = { ...prevState };
      o.allOfficials = users;
      o.mappedOfficials = users.map(mapOfficials);
      _logger(o);
      return o;
    });
  };

  const mapNewOfficialInfo = (off) => {
    let aNewOfficial = {
      user: off.user,
    };
    return aNewOfficial;
  };

  const onGetOfficialsError = (error) => {
    _logger(error);
    toastr.error("Unable to find officials for this conference.");
  };

  const onGetFieldPositionSuccess = (response) => {
    _logger("received field positions");
    _logger(response.items);
    let newFieldPositions = response.items;

    setFieldPositionTable((prevState) => {
      const fp = { ...prevState };
      fp.positions = newFieldPositions;
      fp.positionsTable = newFieldPositions.map(mapPositionsTable);
      return fp;
    });
  };

  const onGetFieldPositionError = (error) => {
    _logger(error);
  };
  //#endregion

  //#region     ---mappers---
  const mapOfficials = (aOfficial) => {
    return (
      <option key={aOfficial.user.id} value={aOfficial.user.id}>
        {aOfficial.user.firstName} {aOfficial.user.lastName}
      </option>
    );
  };

  const mapPositionsTable = (aPosition, index) => {
    const onOfficialChange = (e) => onAssignmentDataChange(e, aPosition);

    return (
      <tr key={index} className="py-2">
        <td className="my-auto text-start">
          <div className="form-group">
            {aPosition.name}
            <input
              className="form-control-plaintext"
              type="hidden"
              id="positionId"
              name="positionId"
              value={aPosition.id}
              readOnly
            />
          </div>
        </td>
        <td className="field-position-table-column p-1">
          <div className="form-group">
            <select
              className="form-select assignment-form-control shadow-sm form-select-sm text-primary"
              id="userId"
              name="userId"
              value={assignmentFormData.officialData.userId}
              onChange={onOfficialChange}
              required
            >
              <option>Select an Official</option>
              {fieldPositionsTable.mappedOfficials}
            </select>
          </div>
        </td>
      </tr>
    );
  };

  //#endregion

  //#region     ---form submit---
  const onSubmitClicked = (e) => {
    e.preventDefault();
    _logger(assignmentFormData, "Submit button clicked");

    const payload = {
      gameId: assignmentFormData.gameId,
      assignmentTypeId: assignmentFormData.assignmentTypeId,
      officialData: assignmentFormData.officialData,
      fee: assignmentFormData.fee,
    };

    assignmentFormService
      .addAssignment(payload)
      .then(onAssignmentFormSubmitSuccess)
      .catch(onAssignmentFormSubmitError);
  };

  const onAssignmentFormSubmitSuccess = (response) => {
    _logger(response);
    Swal.fire({
      title: "Assignment has been added!",
      icon: "success",
    });
    resetForm();
  };

  const resetGameForm = () => {
    setGameFormData((prevState) => {
      const gf = { ...prevState };
      gf.seasonId = "";
      return gf;
    });
  };

  const resetGameTable = () => {
    setGameTableData((prevState) => {
      const gt = { ...prevState };
      gt.gameId = "";
      return gt;
    });
  };

  const resetDropdowns = () => {
    setDropdownData((prevState) => {
      const dd = { ...prevState };
      dd.games = [];
      dd.mappedGamesSelect = [];
      dd.mappedGameTable = [];
      return dd;
    });
  };

  const resetPosition = () => {
    setPositionNumberData((prevState) => {
      const pn = { ...prevState };
      pn.crewNumber = "";
      pn.replayOfficials = false;
      pn.alternateOfficial = false;
      return pn;
    });
  };

  const resetPositionTable = () => {
    setFieldPositionTable((prevState) => {
      const fp = { ...prevState };
      fp.positions = [];
      fp.positionsTable = [];
      fp.allOfficials = [];
      fp.mappedOfficials = [];
      return fp;
    });
  };

  const resetAssignmentForm = () => {
    setAssignmentFormData((prevState) => {
      const newForm = { ...prevState };
      newForm.gameId = "";
      newForm.assignmentTypeId = "1";
      newForm.officialData = [];
      newForm.fee = "";
      return newForm;
    });
  };

  const resetForm = () => {
    resetGameForm();
    resetGameTable();
    resetPosition();
    setShow(false);
    resetDropdowns();
    resetPositionTable();
    resetAssignmentForm();
  };

  const onAssignmentFormSubmitError = (error) => {
    _logger(error);
    Swal.fire({
      title: "Unable to add assignment. Please try again.",
      icon: "error",
    });
  };
  //#endregion

  return (
    <React.Fragment>
      <Row>
        <div className="table-responsive mb-4">
          <Table className="table-bordered align-middle text-center ">
            <thead className="table-light">
              <tr className="assignment-table-header-row align-middle">
                <th>Date</th>
                <th>Time</th>
                <th>Home Team</th>
                <th>Visiting Team</th>
                <th>Venue</th>
                <th>Conference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-middle">
                <td>
                  {" "}
                  <h5 className="my-0 text-secondary">
                    {dateService.formatDateShort(oneGame?.startTime)}
                  </h5>
                </td>
                <td>
                  {" "}
                  <h5 className="my-0 text-secondary">
                    {dateService.formatTime(oneGame?.startTime)}{" "}
                  </h5>
                </td>
                <td>
                  <h5 className="my-0 text-secondary">
                    <img
                      className="avatar-md me-2 assignment-table-team-images"
                      src={oneGame.homeTeam.logo}
                    />
                    {oneGame.homeTeam.name}
                  </h5>
                </td>
                <td>
                  <h5 className="my-0 text-secondary">
                    <img
                      className="avatar-md me-2 assignment-table-team-images"
                      src={oneGame.visitingTeam.logo}
                    />

                    {oneGame.visitingTeam.name}
                  </h5>
                </td>
                <td>
                  {" "}
                  <h5 className="my-0 text-secondary">{oneGame.venue.name} </h5>
                </td>
                <td>
                  <h5 className="my-0 text-secondary">
                    <img
                      className="avatar-sm me-3 assignment-table-team-images"
                      src={oneGame.conference.logo}
                    />
                    {oneGame.conference.code}{" "}
                  </h5>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Row>
      <Row className="mb-3">
        <form className="px-4">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Select Crew Size</label>
            <div className="col-sm-2 my-auto ps-0 pe-4">
              <select
                className="form-select form-select-sm text-primary shadow-sm"
                id="crewNumber"
                name="crewNumber"
                value={positionNumberData.crewNumber}
                onChange={onFormFieldChangeSelect}
                ref={crewNumberRef}
              >
                <option value={0}>Crew size</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
              </select>
            </div>

            <div className="form-check col-sm-2 my-auto">
              <input
                className="form-check-input shadow-sm me-2"
                type="checkbox"
                id="replayOfficials"
                name="replayOfficials"
                checked={positionNumberData.replayOfficials}
                onChange={onFormFieldChangeCheckbox}
                ref={replayCheckRef}
              />
              <label className="form-check-label">Replay Officials</label>
            </div>
            <div className="form-check col-sm-2 my-auto">
              <input
                className="form-check-input shadow-sm"
                type="checkbox"
                id="alternateOfficial"
                name="alternateOfficial"
                checked={positionNumberData.alternateOfficial}
                onChange={onFormFieldChangeCheckbox}
                ref={alternateCheckRef}
              />
              <label className="form-check-label">Alternate Official</label>
            </div>
            <div className="form-check col-sm-2 my-auto">
              <input
                className="form-check-input shadow-sm"
                type="checkbox"
                id="alternateOfficial"
                name="alternateOfficial"
                checked={positionNumberData.alternateOfficial}
                onChange={onFormFieldChangeCheckbox}
                ref={alternateCheckRef}
              />
              <label className="form-check-label">Game Day Personnel</label>
            </div>
          </div>
        </form>
      </Row>

      <form>
        <Row>
          <div className="col-4">
            <Table className="table-bordered align-middle text-center">
              <tbody>{fieldPositionsTable.positionsTable}</tbody>
            </Table>
          </div>
          <div className="col-2" />
          <div className="col-auto">
            <div className="form-group">
              <p className="fw-light fs-4">Fee</p>
              <input
                className="form-control assignment-form-control shadow-sm"
                type="number"
                id="fee"
                name="fee"
                value={assignmentFormData.fee}
                onChange={onFeeFieldChange}
              />
            </div>
          </div>
        </Row>
        <br />
        <Row className="d-flex justify-content-end">
          <div className="col-auto">
            <Button
              className="btn btn-danger"
              type="button"
              onClick={resetForm}
            >
              Clear
            </Button>
          </div>
          <div className="col-auto">
            <Button
              className="site-theme-purple"
              type="submit"
              onClick={onSubmitClicked}
            >
              Submit
            </Button>
          </div>
          <div className="col-1" />
        </Row>
      </form>
    </React.Fragment>
  );
};

AssignmentFormPtTwo.propTypes = {
  oneGame: PropTypes.shape({
    id: PropTypes.number.isRequired,
    gameStatus: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    season: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
    week: PropTypes.number.isRequired,
    conference: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    homeTeam: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    visitingTeam: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    startTime: PropTypes.string.isRequired,
    isNonConference: PropTypes.bool.isRequired,
    venue: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.shape({
        id: PropTypes.number.isRequired,
        locationType: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
        lineOne: PropTypes.string.isRequired,
        lineTwo: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
        }).isRequired,
        zip: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        long: PropTypes.number.isRequired,
      }).isRequired,
      primaryImageUrl: PropTypes.string.isRequired,
    }).isRequired,
  }),
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    conferenceId: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  setGameFormData: PropTypes.func.isRequired,
  setGameTableData: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
  setDropdownData: PropTypes.func.isRequired,
};

export default AssignmentFormPtTwo;
