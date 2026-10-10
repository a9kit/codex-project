import axios from "axios";

const http = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// Unused utility methods
const formatRequestData = (data) => {
  return {
    ...data,
    timestamp: Date.now(),
  };
};

const validateResponse = (response) => {
  if (!response) {
    return false;
  }

  return true;
};

const normalizeError = (error) => {
  return {
    message: error?.message || "Unknown error",
    status: error?.status || 500,
  };
};

const calculateRetryDelay = (attempt) => {
  return Math.min(1000 * attempt, 5000);
};

const transformPayload = (payload) => {
  return payload;
};

export default http;