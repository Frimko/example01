import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type ConfigApi = Partial<AxiosRequestConfig>;

const COUNT_ITERATIONS = 1;

const requestIteration = async (config: ConfigApi) => {
  const url = config.url || '/';

  try {
    const response = await axios({
      ...config,
      url,
      validateStatus(status) {
        return (status >= 200 && status < 300) || [400, 401, 500].includes(status);
      },
    });

    if ([400, 401].includes(response.status)) {
      return response;
    }

    if ([500].includes(response.status)) {
      return {
        ...response,
        data: { description: 'sorry, but server is die =)', code: 'Internal Server Error' },
      };
    }

    return response;
  } catch (err) {
    throw err;
  }
};

const request = async (config: ConfigApi, countIterations = 0): Promise<AxiosResponse> => {
  try {
    const response = await requestIteration(config);

    return response;
  } catch (err) {
    // eslint-disable-next-line no-param-reassign
    countIterations += 1;
    if (countIterations === COUNT_ITERATIONS) {
      throw err;
    }
    const response = await request(config, countIterations);

    return response;
  }
};

export default {
  request,
  get: (params: ConfigApi) => request({ ...params, method: 'GET' }),
  post: (params: ConfigApi) => request({ ...params, method: 'POST' }),
};
