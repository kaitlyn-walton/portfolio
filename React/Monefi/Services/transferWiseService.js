import axios from "axios";
import { API_HOST_PREFIX } from "./serviceHelpers";
import debug from "sabio-debug";
import * as helper from "./serviceHelpers";
const _logger = debug.extend("transferWiseService");

const transferWiseService = {
  endpoint: `${API_HOST_PREFIX}/api/transfers`,
};

transferWiseService.getProfiles = () => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/profiles`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.createQuote = (payload) => {
  _logger("Payload for create quote", payload);
  const config = {
    method: "POST",
    url: `${transferWiseService.endpoint}/quotes/${payload.profileId}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getRecipients = (targetCurrency) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/recipients?currency=${targetCurrency}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getRecipientForm = (quoteId) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/recipients/form/${quoteId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.updateRecipientForm = (quoteId, payload) => {
  _logger("Payload for update recipient", payload);
  const config = {
    method: "POST",
    url: `${transferWiseService.endpoint}/recipients/form/${quoteId}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.createRecipient = (payload) => {
  _logger("Payload to create recipient", payload);
  const config = {
    method: "POST",
    url: `${transferWiseService.endpoint}/recipients`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.updateTransferForm = (payload) => {
  _logger("Payload for update transfer fields", payload);
  const config = {
    method: "POST",
    url: `${transferWiseService.endpoint}/form`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.createTransfer = (payload) => {
  _logger("Payload for create transfer", payload);
  const config = {
    method: "POST",
    url: `${transferWiseService.endpoint}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getReceipt = (transferId) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/${transferId}/receipt`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getTransfer = (transferId) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/${transferId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getBalance = (profileId) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/balance/${profileId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.payment = (payload) => {
  _logger("Payload for create transfer", payload);
  const config = {
    method: "POST",
    url: `${transferWiseService.endpoint}/${payload.profileId}/payment/${payload.transferId}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.simulateStatus = (transferId, status) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/simulation/${transferId}/${status}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getPayinDetails = (profileId, transferId) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/${profileId}/payin/details/${transferId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getTransfers = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getRecipient = (recipientId) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/recipients/${recipientId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getQuote = (profileId, quoteId) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/quotes/${profileId}/${quoteId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getCurrecyRate = (currency1, currency2) => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/rate?currecy1=${currency1}&currecy2=${currency2}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getExchangeRates = (symbols = "") => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/exchangeRates?symbols=${symbols}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

transferWiseService.getHistoricalExchangeRates = (date, symbols = "") => {
  const config = {
    method: "GET",
    url: `${transferWiseService.endpoint}/historicalExchangeRates?date=${date}&symbols=${symbols}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export default transferWiseService;
