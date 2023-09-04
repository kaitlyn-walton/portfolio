import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";
const endpoint = { seasonsUrl: `${API_HOST_PREFIX}/api/seasons` };
const endpointOne = { crewsUrl: `${API_HOST_PREFIX}/api/crews` };
const endpointTwo = {
  assignmentsUrl: `${API_HOST_PREFIX}/api/assignments/positions`,
};

const getSeasonsByConferenceId = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.seasonsUrl}/conferences/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getFieldPositionsByNumber = (
  crewNumber,
  replayOfficials,
  alternateOfficial
) => {
  const config = {
    method: "GET",
    url: `${endpointOne.crewsUrl}/crewNumber/${crewNumber}/?replayOfficials=${replayOfficials}&alternateOfficial=${alternateOfficial}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addAssignment = (payload) => {
  const config = {
    method: "POST",
    url: endpointTwo.assignmentsUrl,
    withCredentials: true,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
    data: payload,
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const assignmentFormService = {
  getSeasonsByConferenceId,
  getFieldPositionsByNumber,
  addAssignment,
};

export default assignmentFormService;
