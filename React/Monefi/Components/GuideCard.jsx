import PropTypes from "prop-types";
import debug from "sabio-debug";
import { Card, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiArrowRight } from "@mdi/js";
import { Link } from "react-router-dom";

const _logger = debug.extend("guideCard");

const GuideCard = (props) => {
  const guide = props.guide;
  _logger("guide data", guide);
  const [guideArticles, setGuideArticles] = useState({
    articles: guide.articles,
    mappedArticles: [],
  });
  _logger(guideArticles);

  useEffect(() => {
    setGuideArticles((prevState) => {
      let ps = { ...prevState };
      ps.mappedArticles = ps.articles.map(mapArticles);
      return ps;
    });
  }, []);

  const mapArticles = (guidelines) => {
    return (
      <div>
        <Row>
          <div key={guidelines.id}>
            <Icon path={mdiArrowRight} size={1} id={guidelines.id} />
            {guidelines.articleTitle}
          </div>
        </Row>
        <br />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Card className="h-100">
        <Card.Body>
          <Row>
            <Card.Title>
              <h2>{guide?.title}</h2>
            </Card.Title>
          </Row>
          <Row>
            <Card.Text>
              <p className="fs-4">{guide?.description} </p>
            </Card.Text>
          </Row>
          <br />

          <Card.Text>{guideArticles.mappedArticles}</Card.Text>
        </Card.Body>
        <Card.Footer className="bg-secondary bg-opacity-10">
          <Card.Text>
            <Link to="/faqs"> {guide?.totalArticles} articles</Link>
          </Card.Text>
        </Card.Footer>
      </Card>
    </React.Fragment>
  );
};

GuideCard.propTypes = {
  guide: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    articles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    totalArticles: PropTypes.number.isRequired,
  }).isRequired,
};

export default GuideCard;
