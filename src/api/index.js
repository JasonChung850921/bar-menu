import axios from "axios";

const api = (config) => {
  return axios(config).catch((err) => {
    console.log(err);
    throw err;
  });
};

export default api;
