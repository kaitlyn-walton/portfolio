import React, { useEffect, useState } from "react";
import debug from "sabio-debug";
import courseService from "../../services/courseService";
import { Card, Container, Table, Row, Image, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

const CourseAdminPage = () => {
  const _logger = debug.extend("Course Admin");

  const [pageData, setPageData] = useState({
    subscribers: [],
    mappedData: [],
    mappedSubscribers: [],
  });

  useEffect(() => {
    courseService
      .getAllCourseSubscribers()
      .then(onGetSubscribersSuccess)
      .catch(onGetSubscribersError);
  }, []);

  const onGetSubscribersSuccess = (response) => {
    _logger(response.items, "received subscibers");
    let allSub = response.items;

    setPageData((prevState) => {
      const pd = { ...prevState };
      let md = allSub.map(mapData);
      pd.subscribers = allSub;
      pd.mappedData = md;
      pd.mappedSubscribers = md.map(mapAllSubscribers);
      _logger(pd);
      return pd;
    });
  };

  const onGetSubscribersError = (error) => {
    _logger(error);
  };

  const mapData = (data) => {
    let courses = data.courseNames;
    let courseArray = courses.split(", ");
    let courseInfo = data.courseIds;
    let infoArray = courseInfo.split(", ").map(Number);

    let courseArr = infoArray.map((arr, index) => ({
      courseId: arr,
      name: courseArray[index],
    }));

    let aSubscriber = { user: data.user, courses: courseArr };

    _logger(aSubscriber);

    return aSubscriber;
  };

  const mapAllSubscribers = (aSub) => {
    _logger(aSub);
    let cou = aSub.courses;
    let allCourses = cou.map(mapCourseList);

    return (
      <tr>
        <td>
          <Image
            src={aSub.user.avatarUrl}
            className="rounded-circle avatar"
            alt=""
          />{" "}
          {aSub.user.firstName} {aSub.user.mi} {aSub.user.lastName}
        </td>
        <td>
          <Stack>{allCourses}</Stack>
        </td>
      </tr>
    );
  };

  const mapCourseList = (co) => {
    return (
      <div className="p-2" key={co.courseId}>
        <Link to={`/course/${co.courseId}/detail/`}>{co.name}</Link>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Container>
        <Row>
          <h3>Course Subscribers</h3>
        </Row>
        <Card>
          <Card.Body>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Courses</th>
                </tr>
              </thead>
              <tbody>{pageData.mappedSubscribers}</tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default CourseAdminPage
