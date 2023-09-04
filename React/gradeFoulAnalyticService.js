import axios from "axios";
import { API_HOST_PREFIX } from "./serviceHelpers";
const endpoint = { gradeFoulAnalyticsUrl: `${API_HOST_PREFIX}/api/analytics` };
const endpointOne = { seasonsUrl: `${API_HOST_PREFIX}/api/seasons` };

const getFoulsByUser = (conferenceId, seasonId, userId) => {
  const config = {
    method: "GET",
    url: `${endpoint.gradeFoulAnalyticsUrl}/conference/${conferenceId}/season/${seasonId}/user/${userId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getGradesBySeason = (conferenceId, seasonId) => {
  const config = {
    method: "GET",
    url: `${endpoint.gradeFoulAnalyticsUrl}/conference/${conferenceId}/grades/${seasonId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getGradesByFoul = (conferenceId, foulTypeId, seasonId) => {
  const config = {
    method: "GET",
    url: `${endpoint.gradeFoulAnalyticsUrl}/conference/${conferenceId}/grades/foul/${foulTypeId}/season/${seasonId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getFoulsBySeason = (conferenceId, seasonId) => {
  const config = {
    method: "GET",
    url: `${endpoint.gradeFoulAnalyticsUrl}/conference/${conferenceId}/fouls/${seasonId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getTeamFoulsByGame = (gameId) => {
  const config = {
    method: "GET",
    url: `${endpoint.gradeFoulAnalyticsUrl}/teams/${gameId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getSimpleUsers = (conferenceId) => {
  const config = {
    method: "GET",
    url: `${endpoint.gradeFoulAnalyticsUrl}/conference/${conferenceId}/allusers`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getSimpleSeasons = (conferenceId) => {
  const config = {
    method: "GET",
    url: `${endpointOne.seasonsUrl}/conferences/${conferenceId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const gradeFoulAnalyticService = {
  getFoulsByUser,
  getGradesBySeason,
  getGradesByFoul,
  getFoulsBySeason,
  getTeamFoulsByGame,
  getSimpleUsers,
  getSimpleSeasons,
};

export default gradeFoulAnalyticService;
