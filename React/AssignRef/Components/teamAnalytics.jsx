import React, { useState, useEffect } from "react";
import { Col, Card, Row, Form, Table } from "react-bootstrap";
import ApexCharts from "react-apexcharts";
import debug from "sabio-debug";
import "./gradefoulanalytics.css";
import toastr from "toastr";
import gradeFoulAnalyticService from "services/gradeFoulAnalyticService";
import gameService from "services/gameService";

const TeamAnalytics = () => {
  const _logger = debug.extend("TeamAnalytics");

  //#region     ---state values--
  const [dropdown, setDropdown] = useState({
    season: [],
    mappedSeasons: [],
    game: [],
    mappedGames: [],
  });

  const [searchSeasonFormData, setSearchSeasonFormData] = useState({
    seasonId: "5",
  });

  const [gameFormData, setGameFormData] = useState({
    gameId: "11",
  });

  const [gameSeries, setGameSeries] = useState({
    gameFoul: [],
    visitingTeamName: "",
    homeTeamName: "",
  });
  //#endregion

  //#region     ---useEffect---
  useEffect(() => {
    _logger("useEffect firing");

    gradeFoulAnalyticService
      .getSimpleSeasons()
      .then(onGetSeasonsSuccess)
      .catch(onGetSeasonsError);
  }, []);

  useEffect(() => {
    if (searchSeasonFormData.seasonId) {
      gameService
        .GetBySeasonId(searchSeasonFormData.seasonId)
        .then(onSearchGameSuccess)
        .catch(onSearchGameError);
    }
    if (gameFormData.gameId) {
      gameService
        .GetById(gameFormData.gameId)
        .then(onGetTeamSuccess)
        .catch(onGetTeamError);

      gradeFoulAnalyticService
        .getTeamFoulsByGame(gameFormData.gameId)
        .then(onGetTeamFoulSuccess)
        .catch(onGetTeamFoulError);
    }
  }, [searchSeasonFormData.seasonId, gameFormData.gameId]);

  //#endregion

  //#region     ---onChange---
  const onFormFieldChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    const target = event.target;
    const newSearchValue = target.value;
    const nameOfField = target.name;

    setSearchSeasonFormData((prevState) => {
      _logger("updater onChange");
      const newSearchObject = {
        ...prevState,
      };
      newSearchObject[nameOfField] = newSearchValue;
      return newSearchObject;
    });
  };

  const onFormTwoFieldChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    const target = event.target;
    const newGameValue = target.value;
    const nameOfField = target.name;

    setGameFormData((prevState) => {
      _logger("updater onChange");
      const newGameObject = {
        ...prevState,
      };
      newGameObject[nameOfField] = newGameValue;
      return newGameObject;
    });
  };
  //#endregion

  //#region     ---success/error responses--
  const onGetSeasonsSuccess = (response) => {
    _logger(response.data.items);
    let newSeason = response.data.items;

    setDropdown((prevState) => {
      const sd = { ...prevState };
      sd.season = newSeason;
      sd.mappedSeasons = newSeason.map(mapSeasons);
      _logger(sd);
      return sd;
    });
  };

  const onGetSeasonsError = (error) => {
    _logger(error);
    toastr.error("Unable to access season data.");
  };

  const onSearchGameSuccess = (response) => {
    _logger(response);
    let gamesSeason = response.items;

    setDropdown((prevState) => {
      const gd = { ...prevState };
      gd.game = gamesSeason;
      gd.mappedGames = gamesSeason.map(mapGames);
      _logger(gd);
      return gd;
    });
  };

  const onSearchGameError = (error) => {
    _logger(error);
    toastr.error("Unable to find games for this season.");
  };

  const onGetTeamFoulSuccess = (response) => {
    let teamFouls = response.data.items;
    _logger(teamFouls);

    setGameSeries((prevState) => {
      const gs = { ...prevState };
      gs.gameFoul = teamFouls;
      return gs;
    });
  };

  const onGetTeamFoulError = (error) => {
    _logger(error);
    toastr.error("Unable to find game data.");
  };

  const onGetTeamSuccess = (response) => {
    _logger("onGetTeamSuccess", response.item);
    let teamData = response.item;
    let visiting = teamData.visitingTeam;
    let home = teamData.homeTeam;

    setGameSeries((prevState) => {
      const st = { ...prevState };
      st.homeTeamName = home.name;
      st.visitingTeamName = visiting.name;
      _logger(st);
      return st;
    });
  };

  const onGetTeamError = (error) => {
    _logger(error);
    toastr.error("Unable to find teams.");
  };
  //#endregion

  //#region     ---chart---
  const TeamFoulOptions = {
    labels: ["Home Team", "Visiting Team"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "18px",
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      showForNullSeries: true,
      showForZeroSeries: true,
      fontSize: "15px",
      position: "bottom",
    },
    colors: ["#19cb98", "#ffaa46"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Fouls",
            },
          },
        },
      },
    },
  };

  const mapApexChart = React.useCallback(() => {
    let teamData = gameSeries.gameFoul;
    if (gameSeries.gameFoul.length === 0) {
      return;
    }
    let TeamFoulSeries = [teamData[0].homeTeam, teamData[0].visitingTeam];

    return (
      <Card className="h-100">
        <Card.Body className="p-1">
          <p className="text-center fs-3">
            {gameSeries.homeTeamName} vs. {gameSeries.visitingTeamName}
          </p>
          <ApexCharts
            options={TeamFoulOptions}
            series={TeamFoulSeries}
            type="donut"
          />
          <div>
            <Table className="w-100 mt-5 text-nowrap table table-hover">
              <tbody>
                <tr>
                  <td className="text-dark fw-medium py-1">
                    Home Team : {gameSeries.homeTeamName}
                  </td>
                  <td>{teamData[0].homeTeam} fouls</td>
                </tr>
                <tr>
                  <td className="text-dark fw-medium py-1">
                    Visiting Team : {gameSeries.visitingTeamName}
                  </td>
                  <td>{teamData[0].visitingTeam} fouls</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    );
  }, [
    gameSeries.homeTeamName,
    gameSeries.visitingTeamName,
    gameSeries.gameFoul,
  ]);
  //#endregion

  //#region     ---mappers---
  const mapGames = (aGame) => {
    let gameDate = aGame.startTime;
    if (gameDate.length > 10) {
      let time = gameDate.slice(5, 10);
      gameDate = time;
    }
    _logger(gameDate);
    return (
      <option key={aGame.id} value={aGame.id}>
        {gameDate} | {aGame.homeTeam.name} vs. {aGame.visitingTeam.name}
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
        <Row className="justify-content-center">
          <Col xl={5} lg={12} md={12}>
            <Card>
              <Card.Header>
                <Row>
                  <div className="col-8">
                    <h3>Home Team vs Visiting Team Fouls By Game</h3>
                  </div>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <div className="col-12">
                      <div className="form-group">
                        <select
                          className="form-select"
                          id="seasonId"
                          name="seasonId"
                          value={searchSeasonFormData.seasonId}
                          onChange={onFormFieldChange}
                        >
                          <option>Select a season</option>
                          {dropdown.mappedSeasons}
                        </select>
                      </div>
                    </div>
                  </Row>
                  <br />
                  <Row>
                    <div className="col-12">
                      <div className="form-group">
                        <select
                          className="form-select"
                          id="gameId"
                          name="gameId"
                          value={gameFormData.gameId}
                          onChange={onFormTwoFieldChange}
                        >
                          <option>Select a game</option>
                          {dropdown.mappedGames}
                        </select>
                      </div>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <br />
          <Col xl={5} lg={12} md={12}>
            {mapApexChart()}
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default TeamAnalytics;
