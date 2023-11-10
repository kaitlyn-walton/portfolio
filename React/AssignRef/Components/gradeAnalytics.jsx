import React, { useState, useEffect } from "react";
import { Col, Card, Row, Form, Table } from "react-bootstrap";
import ApexCharts from "react-apexcharts";
import debug from "sabio-debug";
import "./gradefoulanalytics.css";
import foulService from "services/foulService";
import toastr from "toastr";
import gradeFoulAnalyticService from "services/gradeFoulAnalyticService";

const GradeAnalytics = () => {
  const _logger = debug.extend("GradeAnalytics");

  //#region     ---state values---
  const [selectData, setSelectData] = useState({
    foul: [],
    mappedFouls: [],
    season: [],
    mappedSeasons: [],
  });

  const [gradeSeasonFormData, setGradeSeasonFormData] = useState({
    seasonIdOne: "5",
  });

  const [gradeSeasonFoulFormData, setGradeSeasonFoulFormData] = useState({
    seasonIdTwo: "5",
    foulTypeId: "3",
  });

  const [gradeSeasonSeries, setGradeSeasonSeries] = useState({
    gradeSeason: [],
    mappedGradeSeasons: [],
    gradeFoul: [],
    mappedGradeFouls: [],
  });
  //#endregion

  //#region     ---useEffect--- populating selects
  useEffect(() => {
    _logger("useEffect firing");

    foulService
      .getFoulTypesDetails()
      .then(onGetFoulSuccess)
      .catch(onGetFoulError);

    gradeFoulAnalyticService
      .getSimpleSeasons()
      .then(onGetSeasonsSuccess)
      .catch(onGetSeasonsError);
  }, []);

  useEffect(() => {
    if (gradeSeasonFormData.seasonIdOne) {
      gradeFoulAnalyticService
        .getGradesBySeason(gradeSeasonFormData.seasonIdOne)
        .then(onGradeSeasonSuccess)
        .catch(onGradeSeasonError);
    }
    if (
      gradeSeasonFoulFormData.seasonIdTwo &&
      gradeSeasonFoulFormData.foulTypeId
    ) {
      gradeFoulAnalyticService
        .getGradesByFoul(
          gradeSeasonFoulFormData.foulTypeId,
          gradeSeasonFoulFormData.seasonIdTwo
        )
        .then(onGetGradeFoulSuccess)
        .catch(onGetGradeFoulError);
    }
  }, [
    gradeSeasonFormData.seasonIdOne,
    gradeSeasonFoulFormData.seasonIdTwo && gradeSeasonFoulFormData.foulTypeId,
  ]);
  //#endregion

  //#region     ---onChange---
  const onFormFieldChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    const target = event.target;
    const newGradeValue = target.value;
    const nameOfField = target.name;

    setGradeSeasonFormData((prevState) => {
      _logger("updater onChange");
      const newGradeObject = {
        ...prevState,
      };
      newGradeObject[nameOfField] = newGradeValue;
      return newGradeObject;
    });
  };

  const onFormTwoFieldChange = (event) => {
    _logger("onChange", { syntheticEvent: event });

    const target = event.target;
    const newGradeFoulValue = target.value;
    const nameOfField = target.name;

    setGradeSeasonFoulFormData((prevState) => {
      _logger("updater onChange");
      const newGradeFoulObject = {
        ...prevState,
      };
      newGradeFoulObject[nameOfField] = newGradeFoulValue;
      return newGradeFoulObject;
    });
  };
  //#endregion

  //#region     ---success/error responses---
  const onGetFoulSuccess = (response) => {
    _logger(response);
    let newFouls = response.items;

    setSelectData((prevState) => {
      const fd = { ...prevState };
      fd.foul = newFouls;
      fd.mappedFouls = newFouls.map(mapFouls);
      _logger(fd);
      return fd;
    });
  };

  const onGetFoulError = (error) => {
    _logger(error);
    toastr.error("Unable to locate foul information.");
  };

  const onGetSeasonsSuccess = (response) => {
    _logger(response.data.items);
    let newSeason = response.data.items;

    setSelectData((prevState) => {
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

  const onGradeSeasonSuccess = (response) => {
    _logger(response.data.items);
    let gradeTotals = response.data.items;

    setGradeSeasonSeries((prevState) => {
      const gss = { ...prevState };
      gss.gradeSeason = gradeTotals;
      gss.mappedGradeSeasons = gradeTotals.map(mapGradeSeasonChart);
      return gss;
    });
  };

  const onGradeSeasonError = (error) => {
    _logger(error);
    toastr.error("Unable to access grade data.");
  };

  const onGetGradeFoulSuccess = (response) => {
    _logger(response.data.items);
    let gradeFoulTotal = response.data.items;

    setGradeSeasonSeries((prevState) => {
      const gsf = { ...prevState };
      gsf.gradeFoul = gradeFoulTotal;
      gsf.mappedGradeFouls = gradeFoulTotal.map(mapGradeFoulChart);
      return gsf;
    });
  };

  const onGetGradeFoulError = (error) => {
    _logger(error);
    toastr.error("Unable to access grade data sorted by fouls.");
  };
  //#endregion

  //#region     ---chart options (settings)---
  const GradesBySeasonOptions = {
    labels: ["Correct Call", "Incorrect Call", "Marginal Call"],
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
    chart: {
      type: "donut",
    },
    colors: ["#754ffe", "#19cb98", "#ffaa46"],
  };

  const GradesBySeasonByFoulOptions = {
    labels: ["Correct Call", "Incorrect Call", "Marginal Call"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "20px",
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
    colors: ["#754ffe", "#19cb98", "#ffaa46"],
    chart: {
      type: "donut",
    },
  };
  //#endregion

  //#region       ---charts---
  const mapGradeSeasonChart = (grade) => {
    let gradeSeries = [grade.ccNumber, grade.icNumber, grade.mcNumber];

    return (
      <Card className="h-80">
        <Card.Body className="p-1">
          <p className="text-center fs-4">Grades for {grade.season.name}</p>
          <ApexCharts
            options={GradesBySeasonOptions}
            series={gradeSeries}
            type="donut"
          />
          <div>
            <Table className="w-100 mt-5 text-nowrap table table-hover">
              <tbody>
                <tr>
                  <td key={grade.total} className="text-dark fw-medium py-1">
                    Total Grades
                  </td>
                  <td>{grade.total}</td>
                </tr>
                <tr>
                  <td key={grade.ccNumber} className="text-dark fw-medium py-1">
                    Correct Calls
                  </td>
                  <td>{grade.ccNumber}</td>
                </tr>
                <tr>
                  <td key={grade.icNumber} className="text-dark fw-medium py-1">
                    Incorrect Calls
                  </td>
                  <td>{grade.icNumber}</td>
                </tr>
                <tr>
                  <td key={grade.mcNumber} className="text-dark fw-medium py-1">
                    Marginal Calls
                  </td>
                  <td>{grade.mcNumber}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const mapGradeFoulChart = (grade) => {
    let gradeFoulSeries = [grade.ccNumber, grade.icNumber, grade.mcNumber];
    return (
      <Card className="h-80">
        <Card.Body className="p-1">
          <p className="text-center fs-4">
            Grades for {grade.foul} in {grade.season.name}
          </p>
          <ApexCharts
            options={GradesBySeasonByFoulOptions}
            series={gradeFoulSeries}
            type="donut"
          />
          <div>
            <Table className="w-100 mt-5 text-nowrap table table-hover">
              <tbody>
                <tr>
                  <td className="text-dark fw-medium py-1">Total Grades</td>
                  <td>{grade.total}</td>
                </tr>
                <tr>
                  <td className="text-dark fw-medium py-1">Correct Calls</td>
                  <td>{grade.ccNumber}</td>
                </tr>
                <tr>
                  <td className="text-dark fw-medium py-1">Incorrect Calls</td>
                  <td>{grade.icNumber}</td>
                </tr>
                <tr>
                  <td className="text-dark fw-medium py-1">Marginal Calls</td>
                  <td>{grade.mcNumber}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    );
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

  const mapFouls = (type) => {
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
            <Card className="h-100">
              <Card.Header>
                <h3>Grades Per Season</h3>
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
                          value={gradeSeasonFormData.seasonIdOne}
                          onChange={onFormFieldChange}
                        >
                          <option>Select a season</option>
                          {selectData.mappedSeasons}
                        </select>
                      </div>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={12} md={12}>
            <Card className="h-100">
              <Card.Header>
                <h3>Grades Per Season By Foul</h3>
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
                          value={gradeSeasonFoulFormData.seasonIdTwo}
                          onChange={onFormTwoFieldChange}
                        >
                          <option>Select a season</option>
                          {selectData.mappedSeasons}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <select
                          className="form-select"
                          id="foulTypeId"
                          name="foulTypeId"
                          value={gradeSeasonFoulFormData.foulTypeId}
                          onChange={onFormTwoFieldChange}
                        >
                          <option>Select a foul</option>
                          {selectData.mappedFouls}
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
          <Col xl={5} lg={12} md={12}>
            {gradeSeasonSeries.mappedGradeSeasons}
          </Col>
          <Col xl={5} lg={12} md={12}>
            {gradeSeasonSeries.mappedGradeFouls}
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default GradeAnalytics;
