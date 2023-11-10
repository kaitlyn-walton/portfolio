import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";
const endpoint = { gameUrl: `${API_HOST_PREFIX}/api/games` };

const GetById = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.gameUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const GetBySeasonId = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.gameUrl}/season/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const GetBySeasonWeekId = (id, week) => {
  const config = {
    method: "GET",
    url: `${endpoint.gameUrl}/season/${id}/week${week}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const GetBySeasonIdPaginated = (id, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.gameUrl}/season/pagination/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const DeleteById = (id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.gameUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const Create = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.gameUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const GetBySeasonIdConferenceId = (conferenceId, seasonId) => {
  const config = {
    method: "GET",
    url: `${endpoint.gameUrl}/conference/${conferenceId}/season/${seasonId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const gameService = {
  GetById,
  GetBySeasonId,
  GetBySeasonWeekId,
  GetBySeasonIdPaginated,
  DeleteById,
  Create,
  GetBySeasonIdConferenceId,
};

export default gameService;
