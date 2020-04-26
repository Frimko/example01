import { AxiosPromise } from 'axios';
import http from '../../utils/API';

const BASE_URL = 'https://work.vint-x.net/api/';
const buildUrl = (url: string) => `${BASE_URL}${url}`;

export type LoginParamsType = {
  username: string,
  password: string,
};

export type LoginSuccessReturnType = {
  status: string,
};

export type LoginErrorReturnType = {
  code: string,
  description: string
};

export type LoginApiReturnType = LoginSuccessReturnType | LoginErrorReturnType;

export type LoginApiType = (params: LoginParamsType) => AxiosPromise<LoginApiReturnType>;

export const login: LoginApiType = ({ username, password }) => http.post({
  url: buildUrl('login'),
  data: { username, password },
});

type SubscribeApiType = (params: { token: string }) => AxiosPromise;

export const subscribe: SubscribeApiType = ({ token }) => http.get({
  url: buildUrl('subscribe'),
  headers: { 'x-test-app-jwt-token': token },
});
