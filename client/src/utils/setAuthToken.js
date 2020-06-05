import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    // if token, then set as default header
    axios.defaults.headers.common["x-auth-token"] = token; // "x-auth-token" is the header
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
