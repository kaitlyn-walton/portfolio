import React, { useState, useEffect, Fragment } from "react";
import { useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import toastr from "toastr";
import Swal from "sweetalert2";
import debug from "sabio-debug";
import {
  Card,
  Col,
  Row,
  Image,
  ListGroup,
  Breadcrumb,
  Container,
  Tab,
  Nav,
  Button,
} from "react-bootstrap";
import courseService from "../../services/courseService";
import * as usersService from "../../services/userService";
import Ratings from "components/ratings/Ratings";
import * as lectureService from "../../services/lectureService";
import * as DateFormat from "../../utils/dateFormater";
import Icon from "@mdi/react";
import {
  mdiBookOpenPageVariant,
  mdiHumanMaleBoard,
  mdiClockOutline,
} from "@mdi/js";
import "./course.css";
import CourseAccordion from "./CourseAccordion";
import LoginModal from "components/user/LoginModal";
import ratingsService from "services/ratingsService";

const _logger = debug.extend("CourseDetail");

const CourseInfo = ({ currentUser, loginSuccess }) => {
  const [courseDetail, setCourseDetail] = useState({
    id: 0,
    title: "",
    subject: "",
    description: "",
    instructor: "",
    lectureType: [],
    coverImageUrl: "",
    statusName: "",
    createdBy: 0,
    dateCreated: "",
    modifiedBy: 0,
    dateModified: "",
  });
  const [ratingInfo, setRatingInfo] = useState({
    ratingId: null,
    ratingVal: null,
    render: false,
  });
  const { courseId } = useParams();

  const [pageData, setPageData] = useState({
    lecturesArray: [],
    userRoles: currentUser.roles,
    admin: false,
    subscribers: [],
    mappedSubscribers: [],
  });

  _logger(pageData.userRoles);

  const { state } = useLocation();

  const [buttonStatus, setButtonStatus] = useState({
    button: "",
    disabled: false,
  });

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (state !== null) {
      setCourseDetail({
        id: state.id,
        title: state.title,
        subject: state.subject,
        description: state.description,
        duration: state.duration,
        instructorId: state.instructor.id,
        instructorFirstName: state.instructor.firstName,
        instructorLastName: state.instructor.lastName,
        instructorAvatarUrl: state.instructor.avatarUrl,
        lectureTypeId: state.lectureType.id,
        lectureTypeName: state.lectureType.name,
        coverImageUrl: state.coverImageUrl,
        statusId: state.statusName.id,
        statusName: state.statusName.name,
        createdBy: state.createdBy,
        dateCreated: state.dateCreated,
        modifiedBy: state.modifiedBy,
        dateModified: state.dateModified,
      });
      ratingsService
        .getIndvRating(state.lectureType.id, state.id, currentUser.id)
        .then(onGetIndvRatingSuccess)
        .catch(onGetIndvRatingError);
    } else {
      courseService
        .getCourseById(courseId)
        .then(onGetCourseIdSuccess)
        .catch(onGetCourseIdError);
    }
    lectureService
      .getLecturesByCourseId(courseId)
      .then(onGetLectureSuccess)
      .catch(onGetLectureError);
    if (!currentUser.isLoggedIn) {
      setButtonStatus((prevState) => {
        const bs = { ...prevState };
        bs.button = "Login";
        return bs;
      });
    } else {
      courseService
        .checkWebSubscription()
        .then(onCheckSubscriptionSuccess)
        .catch(onCheckSubscriptionError);
    }
  }, [currentUser, ratingInfo.ratingId, courseDetail.instructor]);

  useEffect(() => {
    courseService
      .checkCourseSubscription(courseId)
      .then(onCheckCourseSubscriptionSuccess)
      .catch(onCheckCourseSubscriptionError);
    if (courseDetail !== null) {
      ratingsService
        .getIndvRating(
          courseDetail.lectureTypeId,
          courseDetail.id,
          currentUser.id
        )
        .then(onGetIndvRatingSuccess)
        .catch(onGetIndvRatingError);
    }
    const adminCheck = pageData.userRoles.some((ur) => ur === "Admin");
    _logger(adminCheck);
    if (adminCheck) {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.admin = true;
        return pd;
      });
      courseService
        .getCourseSubscribers(courseDetail.id)
        .then(onGetSubscriberSuccess)
        .catch(onGetSubscriberError);
    }
  }, [courseDetail]);

  const onGetIndvRatingSuccess = (response) => {
    _logger("Get individual rating success: ", response);
    setRatingInfo((prevState) => {
      const pd = { ...prevState };
      pd.ratingId = response.item.id;
      pd.ratingVal = response.item.ratingVal;
      pd.render = true;
      return pd;
    });
  };

  const onGetIndvRatingError = (error) => {
    _logger(error);
    setRatingInfo((prevState) => {
      const pd = { ...prevState };
      pd.render = true;
      return pd;
    });
  };

  const onGetSubscriberSuccess = (response) => {
    _logger(response.items);
    let users = response.items;

    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.subscribers = users;
      pd.mappedSubscribers = users.map(mapSubscribers);
      return pd;
    });
  };

  const onGetSubscriberError = (error) => {
    _logger(error);
  };

  const onGetLectureSuccess = (response) => {
    _logger("lecture data for cards", response.items);
    let ajaxLectures = response.items;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.lecturesArray = ajaxLectures;
      return pd;
    });
  };

  const mapSubscribers = (sub) => {
    _logger(sub);
    return (
      <Container>
        <Tab.Pane eventKey="users">
          <ul className="list-group">
            <Row>
              <li className="list-group-item">
                <Image
                  src={sub.avatarUrl}
                  className="rounded-circle avatar"
                  alt=""
                />{" "}
                {sub.firstName} {sub.mi} {sub.lastName} {""}
              </li>
            </Row>
          </ul>
        </Tab.Pane>
      </Container>
    );
  };

  const onGetLectureError = (err) => {
    _logger(err);
  };

  const onGetCourseIdSuccess = (response) => {
    _logger("Course detail: ", response);
    const courseDetailFromAjax = response.item;
    setCourseDetail({
      id: courseDetailFromAjax.id,
      title: courseDetailFromAjax.title,
      subject: courseDetailFromAjax.subject,
      description: courseDetailFromAjax.description,
      duration: courseDetailFromAjax.duration,
      instructorId: courseDetailFromAjax.instructor.id,
      instructorFirstName: courseDetailFromAjax.instructor.firstName,
      instructorLastName: courseDetailFromAjax.instructor.lastName,
      instructorAvatarUrl: courseDetailFromAjax.instructor.avatarUrl,
      lectureTypeId: courseDetailFromAjax.lectureType.id,
      lectureTypeName: courseDetailFromAjax.lectureType.name,
      coverImageUrl: courseDetailFromAjax.coverImageUrl,
      statusId: courseDetailFromAjax.statusName.id,
      statusName: courseDetailFromAjax.statusName.name,
      createdBy: courseDetailFromAjax.createdBy,
      dateCreated: courseDetailFromAjax.dateCreated,
      modifiedBy: courseDetailFromAjax.modifiedBy,
      dateModified: courseDetailFromAjax.dateModified,
    });
  };

  const onGetCourseIdError = (err) => {
    _logger(err);
    toastr.error("Course not found. Please check the course requested.");
  };

  const navigate = useNavigate();

  const onClickAccess = (e) => {
    e.preventDefault();

    if (!currentUser.isLoggedIn) {
      openModal();
    }
    if (buttonStatus.button === "Access Course") {
      courseService
        .addCourseSubscription(courseId)
        .then(onAddCourseSubscriptionSuccess)
        .catch(onCheckSubscriptionError);
    }
    if (buttonStatus.button === "Subscribe to MoneFi") {
      navigate(`/subscriptions`);
    }
  };

  const onClickUnsubscribe = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure you want to unsubscribe?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        courseService
          .removeCourse(currentUser.id, courseDetail.id)
          .then(onUnsubscribeSuccess)
          .catch(onUnsubscribeError);
      } else {
        Swal.fire("Cancelled", "", "error");
      }
    });
  };

  const onUnsubscribeSuccess = () => {
    _logger(
      `${currentUser.firstName} is unsubscribed from ${courseDetail.title}`
    );
    Swal.fire({
      text: `You have successfully unsubscribed from the ${courseDetail.title} course.`,
      icon: "success",
      confirmButtonText: "Close",
    }).then(closeModal());
    setShow(false);
    setButtonStatus((prevState) => {
      const bs = { ...prevState };
      bs.button = "Access Course";
      bs.disabled = false;
      return bs;
    });
    if (pageData.admin) {
      courseService
        .getCourseSubscribers(courseDetail.id)
        .then(onGetSubscriberSuccess)
        .catch(onGetSubscriberError);
    }
  };

  const onUnsubscribeError = (error) => {
    _logger(error);
  };

  const onAddCourseSubscriptionSuccess = () => {
    _logger("Enrolled in course");
    setButtonStatus((prevState) => {
      const bs = { ...prevState };
      bs.button = "Enrolled";
      bs.disabled = true;
      return bs;
    });
    Swal.fire({
      title: `Congrats!`,
      text: `You are now enrolled in the ${courseDetail.title} course`,
      icon: "success",
      confirmButtonText: "Close",
    }).then(closeModal());
    setShow(true);
    if (pageData.admin) {
      courseService
        .getCourseSubscribers(courseDetail.id)
        .then(onGetSubscriberSuccess)
        .catch(onGetSubscriberError);
    }
  };

  const onCheckSubscriptionSuccess = (data) => {
    var subscribed = data.item;
    if (!subscribed) {
      setButtonStatus((prevState) => {
        const bs = { ...prevState };
        bs.button = "Subscribe to MoneFi";
        return bs;
      });
    } else {
      courseService
        .checkCourseSubscription(courseId)
        .then(onCheckCourseSubscriptionSuccess)
        .catch(onCheckCourseSubscriptionError);
    }
  };

  const onCheckSubscriptionError = (err) => {
    _logger(err);
  };

  const onCheckCourseSubscriptionSuccess = (data) => {
    let subStatus = data.item;
    if (subStatus === true) {
      setButtonStatus((prevState) => {
        const bs = { ...prevState };
        bs.button = "Enrolled";
        bs.disabled = true;
        return bs;
      });
      setShow(true);
    } else {
      setButtonStatus((prevState) => {
        const bs = { ...prevState };
        bs.button = "Access Course";
        bs.disabled = false;
        return bs;
      });
      setShow(false);
    }
  };

  const onCheckCourseSubscriptionError = (err) => {
    _logger(err);
  };

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onLoginClicked = (values) => {
    _logger("from login Fx", values);
    usersService.login(values).then(onLoginSuccess).catch(onLoginError);
  };

  const onLoginSuccess = (response) => {
    let name = response;
    _logger("from login success", name);
    Swal.fire({
      title: `Welcome Back`,
      text: "The name will go here",
      icon: "success",
      confirmButtonText: "Close",
    }).then(closeModal());

    usersService.getCurrent().then(getSuccess).catch(onLoginError);
  };

  const onLoginError = () => {
    Swal.fire({
      title: "Something is not Right",
      text: "Unable to signin, please check your credentials and try again. If you have forgotten your password you may reset it below",
      confirmButtonColor: "#7cd1f9",
      confirmButtonText: `<a className="text-white" href="/resetpassword">Reset Password</a>`,
      showCancelButton: true,
      cancelButtonText: "Try Again",
    });
  };

  const getSuccess = (response) => {
    _logger("Get Current User Success:" + response);
    const currentUser = {
      ...response.item,
    };

    currentUser.isLoggedIn = true;
    loginSuccess(currentUser);
  };
  _logger(CourseAccordion, "Accordion");

  return (
    <Fragment>
      <Row className="mx-2 my-2">
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom mb-2 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Course Details</h1>
              <Breadcrumb>
                <Breadcrumb.Item
                  href={
                    currentUser.roles.length < 1
                      ? "/coursesoffered"
                      : "/courses"
                  }
                >
                  Courses Offered
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Current Course</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className="pt-lg-8 pb-lg-16 pt-8 pb-12 bg-primary">
            <Container>
              <Row className="align-items-center">
                <Col xl={7} lg={7} md={12} sm={12}>
                  <div>
                    <h1 className="text-white display-4 fw-semi-bold">
                      {courseDetail.title}
                    </h1>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="pb-10">
            <Container>
              <Row>
                <Col lg={8} md={12} sm={12} className="mt-n8 mb-4 mb-lg-0">
                  <Tab.Container defaultActiveKey="contents">
                    <Card>
                      <Nav className="nav-lb-tab">
                        {["Contents", "Description"].map((item, index) => (
                          <Nav.Item key={index} className="mb-sm-3 mb-md-0">
                            <Nav.Link eventKey={item.toLowerCase()}>
                              {item}
                            </Nav.Link>
                          </Nav.Item>
                        ))}
                        {pageData.admin && (
                          <Nav.Item key={courseDetail.id}>
                            <Nav.Link eventKey="users">{"Admin"}</Nav.Link>
                          </Nav.Item>
                        )}
                      </Nav>
                      <Card.Body className="p-0">
                        <Tab.Content>
                          <Tab.Pane
                            eventKey="contents"
                            className="pb-4 pt-3 px-4"
                          >
                            <CourseAccordion
                              lectures={pageData.lecturesArray}
                            ></CourseAccordion>
                          </Tab.Pane>
                          <Tab.Pane eventKey="description" className="pb-4 p-4">
                            {courseDetail.description}
                          </Tab.Pane>
                          {pageData.admin && (
                            <div>{pageData.mappedSubscribers}</div>
                          )}
                        </Tab.Content>
                      </Card.Body>
                    </Card>
                  </Tab.Container>
                </Col>
                <Col lg={4} md={12} sm={12} className="mt-lg-n22">
                  <Card className="mt-2 mb-4 card-hover courseCardDetailBody">
                    <Row className="g-0">
                      <div className="row justify-content-end">
                        <span className="courseDetailBodyBadge">
                          {courseDetail.subject}
                        </span>
                      </div>

                      <img
                        src={courseDetail.coverImageUrl}
                        alt="..."
                        className="bg-cover img-left-rounded courseDetailCourseImage"
                      />

                      <Row className="pt-3 justify-content-center">
                        <div className="col-auto">
                          <LoginModal
                            isOpen={isOpen}
                            getCloseHandler={closeModal}
                            clickAccess={onClickAccess}
                            buttonStatus={buttonStatus}
                            setShow={openModal}
                            onLoginClicked={onLoginClicked}
                          />
                        </div>
                        {show && (
                          <div className="col-auto">
                            <Button
                              className="btn btn-success"
                              onClick={onClickUnsubscribe}
                            >
                              Unsubscribe
                            </Button>
                          </div>
                        )}
                      </Row>

                      <Col lg={12} md={12} sm={12}>
                        <Card.Body className="courseCardDetail">
                          <p className="mb-2 text-truncate-line-2 ">
                            {courseDetail.title}
                          </p>
                          <ListGroup
                            as="ul"
                            bsPrefix="list-inline"
                            className="mb-2"
                          >
                            <ListGroup.Item
                              as="li"
                              bsPrefix="list-inline-item"
                              className="mb-2"
                            >
                              <Icon path={mdiBookOpenPageVariant} size={1} />{" "}
                              {courseDetail.description}
                            </ListGroup.Item>
                          </ListGroup>
                          <ListGroup
                            as="ul"
                            bsPrefix="list-inline"
                            className=""
                          >
                            <ListGroup.Item
                              as="li"
                              bsPrefix="list-inline-item"
                              className="mb-2"
                            >
                              <Icon path={mdiHumanMaleBoard} size={1} />{" "}
                              {courseDetail.lectureTypeName}
                            </ListGroup.Item>
                            <ListGroup.Item as="li" bsPrefix="list-inline-item">
                              <Icon path={mdiClockOutline} size={1} />{" "}
                              {courseDetail.duration}
                            </ListGroup.Item>
                            <ListGroup.Item
                              as="li"
                              bsPrefix="list-item"
                              className="h5"
                            >
                              Added by: {courseDetail.createdBy.firstName}{" "}
                              {courseDetail.createdBy.lastName} on{" "}
                              {DateFormat.formatDate(courseDetail.dateCreated)}
                            </ListGroup.Item>
                            <ListGroup.Item
                              as="li"
                              bsPrefix="list-item"
                              className="h4"
                            >
                              Status: {courseDetail.statusName}
                            </ListGroup.Item>
                          </ListGroup>
                          <Row className="align-items-center g-0">
                            <Col className="col-auto">
                              <Image
                                src={courseDetail.instructorAvatarUrl}
                                className="rounded-circle avatar"
                                sizes="72px"
                                alt=""
                              />
                            </Col>
                            <Col className="col ms-2">
                              <span className="h4">
                                {courseDetail.instructorFirstName}{" "}
                                {courseDetail.instructorLastName}
                              </span>
                            </Col>
                            <Col></Col>
                          </Row>
                          <div className="ratings-container">
                            {ratingInfo.render && (
                              <Ratings
                                setRatingInfo={setRatingInfo}
                                ratingId={ratingInfo.ratingId}
                                ratingVal={ratingInfo.ratingVal}
                                entityId={+courseId}
                                entityTypeId={courseDetail.lectureTypeId}
                              />
                            )}
                            <p>Click to Submit Rating</p>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};
CourseInfo.propTypes = {
  currentUser: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    id: PropTypes.number.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  loginSuccess: PropTypes.func.isRequired,
};
export default CourseInfo;
