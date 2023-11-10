import axios from "axios";
import * as helper from "../services/serviceHelpers";
import debug from "sabio-debug";
const _logger = debug.extend("courseService");
let { REACT_APP_API_HOST_PREFIX: API } = process.env;
_logger(API);

var coursesEndpoint = {
  endpoint: `${helper.API_HOST_PREFIX}/api/courses`,
};

//Service call to fetch the course data
let getCourses = (pageIndex, pageSize, query, selectedFilter) => {
  const config = {
    method: "GET",
    url:
      coursesEndpoint.endpoint +
      `/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}&lecturetypeid=${selectedFilter}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

//Service call to fetch a course by ID
let getCourseById = (id) => {
  const config = {
    method: "GET",
    url: coursesEndpoint.endpoint + `/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

//Service call to fetch all unique course subjects
let getCourseSubjects = () => {
  const config = {
    method: "GET",
    url: coursesEndpoint.endpoint,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

//Service call to edit/delete a course
let editCourse = (courseId, editCourseData) => {
  const config = {
    method: "PUT",
    url: coursesEndpoint.endpoint + `/${courseId}`,
    data: editCourseData,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

//Service call to add a course
let addCourse = (addCourseData) => {
  const config = {
    method: "POST",
    url: coursesEndpoint.endpoint,
    data: addCourseData,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

let checkCourseSubscription = (courseId) => {
  const config = {
    method: "GET",
    url: coursesEndpoint.endpoint + `/check/?courseId=${courseId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

let checkWebSubscription = () => {
  const config = {
    method: "GET",
    url: coursesEndpoint.endpoint + `/check/web`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addCourseSubscription = (courseId) => {
  const config = {
    method: "POST",
    url: coursesEndpoint.endpoint + `/subscribe/?courseId=${courseId}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

let removeCourse = (userId, courseId) => {
  const config = {
    method: "DELETE",
    url: coursesEndpoint.endpoint + `/${userId}/${courseId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

let getCourseSubscribers = (courseId) => {
  const config = {
    method: "GET",
    url: coursesEndpoint.endpoint + `/subscribers/${courseId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

let getAllCourseSubscribers = () => {
  const config = {
    method: "GET",
    url: coursesEndpoint.endpoint + `/allsubscribers`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const courseService = {
  getCourses,
  getCourseById,
  getCourseSubjects,
  editCourse,
  addCourse,
  addCourseSubscription,
  checkWebSubscription,
  checkCourseSubscription,
  removeCourse,
  getCourseSubscribers,
  getAllCourseSubscribers,
};
export default courseService;
