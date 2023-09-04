import axios from "axios";
import { API_HOST_PREFIX } from "./serviceHelpers";
const endpoint = { gradesUrl: `${API_HOST_PREFIX}/api/grades` };

const lookUpGradeTypes = (isReplay) => {
  const config = {
    method: "GET",
    url: `${endpoint.gradesUrl}/types?isReplay=${isReplay}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const addReplayGrade = (payload) =>{
  const config = {
    method: "POST",
    url: `${endpoint.gradesUrl}/batch/replay`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json;" },
  };
  return axios(config);
}

const updateReplayGrade = (payload) =>{
  const config = {
    method: "PUT",
    url: `${endpoint.gradesUrl}/batch/replay`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json;" },
  };
  return axios(config);
}

const addGrade = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.gradesUrl}/batch`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json;" },
  };
  return axios(config);
};

const deleteReplayGrade = (id) =>{
  const config = {
    method: "DELETE",
    url: `${endpoint.gradesUrl}/${id}/replay`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json;" },
  };
  return axios(config);
}

const gradeService = { lookUpGradeTypes, addGrade, addReplayGrade, updateReplayGrade, deleteReplayGrade };

export default gradeService;
