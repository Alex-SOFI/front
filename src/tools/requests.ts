/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import humps from 'humps';
import qs from 'query-string';

const request = axios.create({
  baseURL: import.meta.env.VITE_COINGECKO_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer(params) {
    return qs.stringify(params, {
      arrayFormat: 'bracket',
      skipNull: true,
      skipEmptyString: true,
    });
  },
});

const responseHandler = (response: AxiosResponse<any, any>) => {
  return humps.camelizeKeys(response.data) as
    | AxiosResponse<any, any>
    | Promise<AxiosResponse<any, any>>;
};

const requestMapper = (config: InternalAxiosRequestConfig<any>) => {
  const decamelizedData = humps.decamelizeKeys(config.data);
  delete config.data;
  config.data = decamelizedData;

  return config;
};

async function errorHandler({
  response,
  config,
}: {
  response: AxiosResponse<any, any>;
  config: InternalAxiosRequestConfig<any>;
}) {
  const newError = {
    statusCode: response.status,
    detail: response,
    ...(response.data.message && { message: response.data.message }),
    ...(response.data.detail && { detail: response.data.detail }),
    ...(response.data.violations && { violations: response.data.violations }),
    ...(config.data && { requestData: JSON.parse(config.data) }),
  };

  return Promise.reject(newError);
}

request.interceptors.request.use(requestMapper);

request.interceptors.response.use(responseHandler, errorHandler);

export default request;
