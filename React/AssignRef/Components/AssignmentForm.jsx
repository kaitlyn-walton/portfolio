import React, { useState, useEffect } from "react";
import { Card, Row } from "react-bootstrap";
import TitleHeader from "components/general/TitleHeader";
import debug from "sabio-debug";
import gameService from "services/gameService";
import assignmentFormService from "services/assignmentFormService";
import toastr from "toastr";
import "./assignmentform.css";
import AssignmentFormPtTwo from "./AssignmentFormPtTwo";
import PropTypes from "prop-types";

const AssignmentForm = ({ currentUser }) => {
  const _logger = debug.extend("AssignmentForm");

  //#region     ---state values---
  const [gameFormData, setGameFormData] = useState({
    seasonId: "",
  });

  const [gameTableData, setGameTableData] = useState({
    gameId: "",
  });

  const [show, setShow] = useState(false);

  const [dropdownData, setDropdownData] = useState({
    seasons: [],
    mappedSeasons: [],
    games: [],
    mappedGamesSelect: [],
    mappedGameTable: [],
  });
  //#endregion

  //#region     ---useEffects---
  useEffect(() => {
    assignmentFormService
      .getSeasonsByConferenceId(currentUser.conferenceId)
      .then(onGetSeasonsSuccess)
      .catch(onGetSeasonsError);
  }, []);

  useEffect(() => {
    if (gameFormData.seasonId) {
      gameService
        .GetBySeasonIdConferenceId(
          currentUser.conferenceId,
          gameFormData.seasonId
        )
        .then(onGetGameDropdownSuccess)
        .catch(onGetGameDropdownError);
    }
    if (gameTableData.gameId) {
      gameService
        .GetById(gameTableData.gameId)
        .then(onGetGameTableSuccess)
        .catch(onGetGameTableError);
    }
  }, [gameFormData.seasonId, gameTableData.gameId]);
  //#endregion

  //#region     ---onChange Handlers---
  const onSeasonDropdownChange = (event) => {
    setGameTableData((prevState) => {
      let ns = { ...prevState };
      ns.gameId = "";
      return ns;
    });
    setDropdownData((prevState) => {
      const newObject = {
        ...prevState,
        games: [],
        mappedGamesSelect: [],
        mappedGameTable: [],
      };

      return newObject;
    });
    _logger("onChange", { syntheticEvent: event });

    const newValue = event.target.value;
    const newName = event.target.name;

    setGameFormData((prevState) => {
      _logger("updater onChange");
      const newObject = {
        ...prevState,
      };
      newObject[newName] = newValue;
      return newObject;
    });
  };

  const onGameDropdownChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    const newValue = event.target.value;
    const newName = event.target.name;
    setGameTableData((prevState) => {
      _logger("updater onChange");
      const newObject = {
        ...prevState,
      };
      newObject[newName] = newValue;
      return newObject;
    });
  };
  //#endregion

  //#region     ---success/error handlers---
  const onGetSeasonsSuccess = (response) => {
    _logger(response.data.items);
    let newSeason = response.data.items;

    setDropdownData((prevState) => {
      const sd = { ...prevState };
      sd.seasons = newSeason;
      sd.mappedSeasons = newSeason.map(mapSeasons);
      return sd;
    });
  };

  const onGetSeasonsError = (error) => {
    _logger(error);
    toastr.error("Unable to access season data.");
  };

  const onGetGameDropdownSuccess = (response) => {
    _logger(response.items);
    let gameArray = response.items;

    setDropdownData((prevState) => {
      const gd = { ...prevState };
      gd.games = gameArray;
      gd.mappedGamesSelect = gameArray.map(mapGamesDropdown);
      _logger(gd);
      return gd;
    });
  };

  const onGetGameDropdownError = (error) => {
    _logger(error);
    toastr.error("Unable to access game data for this season.");
  };

  const onGetGameTableSuccess = (response) => {
    _logger(response.item);
    let singleGame = response.item;

    setDropdownData((prevState) => {
      const td = { ...prevState };
      td.mappedGameTable = [singleGame].map(mapGamesTable);
      return td;
    });
  };

  const onGetGameTableError = (error) => {
    _logger(error);
    toastr.error("Unable to find game info.");
  };
  //#endregion

  //#region     ---mappers---
  const mapSeasons = (type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  };

  const mapGamesDropdown = (aGame) => {
    let gameDate = aGame.startTime;
    if (gameDate.length > 10) {
      let day = gameDate.slice(5, 10);
      gameDate = day;
    }
    setShow(true);
    return (
      <option key={aGame.id} value={aGame.id}>
        {gameDate} | {aGame.homeTeam.name}
        {" vs. "}
        {aGame.visitingTeam.name}
        {" @ "}
        {aGame.venue.name}
      </option>
    );
  };

  const gameDropdownField = () => {
    return (
      <div>
        <label className="m-1 h5">Game</label>
        <select
          className="form-select text-primary shadow-sm form-select-sm"
          id="gameId"
          name="gameId"
          value={gameTableData.gameId}
          onChange={onGameDropdownChange}
        >
          <option>Select a game</option>
          {dropdownData.mappedGamesSelect}
        </select>
      </div>
    );
  };

  const mapGamesTable = (oneGame) => {
    setShow(true);
    return (
      <AssignmentFormPtTwo
        oneGame={oneGame}
        key={oneGame.id}
        setGameFormData={setGameFormData}
        setGameTableData={setGameTableData}
        currentUser={currentUser}
        setShow={setShow}
        setDropdownData={setDropdownData}
      />
    );
  };
  //#endregion

  return (
    <React.Fragment>
      <TitleHeader title="Assign Personnel" />

      <Card>
        <div className="row row col-lg-12 col-md-12 col-sm-12 px-4 py-2">
          <Card.Body>
            <form className="mb-4">
              <Row className="justify-content-between">
                <div className="col-lg-5 col-md-6 col-sm-12 form-group">
                  <label className="m-1 h5">Season</label>
                  <select
                    className="form-select text-primary shadow-sm form-select-sm"
                    id="seasonId"
                    name="seasonId"
                    value={gameFormData.seasonId}
                    onChange={onSeasonDropdownChange}
                  >
                    <option>Select a season</option>
                    {dropdownData.mappedSeasons}
                  </select>
                </div>

                <div className="col-lg-5 col-md-6 col-sm-12 form-group">
                  {show && gameDropdownField()}
                </div>
              </Row>
            </form>
            <br />
            <div>{show && dropdownData.mappedGameTable}</div>
          </Card.Body>
        </div>
      </Card>
    </React.Fragment>
  );
};

AssignmentForm.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    conferenceId: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
};

export default AssignmentForm;
