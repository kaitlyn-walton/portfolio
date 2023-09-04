import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import GradeAnalytics from "./gradeAnalytics";
import FoulAnalytics from "./foulAnalytics";
import TeamAnalytics from "./teamAnalytics";
import "./gradefoulanalytics.css";

const GradeFoulAnalytics = () => {
  return (
    <React.Fragment>
      <div className="container">
        <Tabs className="justify-content-center grade-foul-nav-tabs">
          <Tab eventKey="GradeAnalytics" title="Grade Analytics">
            <GradeAnalytics />
          </Tab>
          <Tab eventKey="FoulAnalytics" title="Foul Analytics">
            <FoulAnalytics />
          </Tab>
          <Tab eventKey="TeamAnalytics" title="Team Analytics">
            <TeamAnalytics />
          </Tab>
        </Tabs>
      </div>
    </React.Fragment>
  );
};

export default GradeFoulAnalytics;
