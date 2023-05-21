import axios from 'axios';
import { LOCAL_STORAGE_JWT_KEY } from './constants';

const instance = axios.create({
  baseURL: 'https://webgram.api.qann1st.site/',
  headers: {
    'Access-Control': 'application/json',
    Authorization: localStorage.getItem(LOCAL_STORAGE_JWT_KEY)
      ? 'Bearer ' + localStorage.getItem(LOCAL_STORAGE_JWT_KEY)
      : '',
  },
});

export const setToken = (token: string) => {
  instance.defaults.headers.Authorization = 'Bearer ' + token;
  instance.defaults.headers.common.Authorization = 'Bearer ' + token;
};

export const getUsers = () => {
  return instance
    .get(`users`)
    .then((res) => res.data)
    .catch((err) => err.data);
};

export const getUserMe = () => {
  return instance
    .get(`users/me`)
    .then((res) => res.data)
    .catch((err) => err.data);
};

export const getRoomMessages = (id: string) => {
  return instance
    .get(`messages/${id}`)
    .then((res) => res.data)
    .catch((err) => err.data);
};

export const getLastMessage = (roomId: string) => {
  return instance
    .get(`messages/last/${roomId}`)
    .then((res) => res.data)
    .catch((err) => err.data);
};

export const signIn = (body: object) => {
  return instance
    .post(`signin`, body)
    .then((res) => res.data)
    .catch((err) => err.data);
};

export const signUp = (body: object) => {
  return instance
    .post(`signup`, body)
    .then((res) => res.data)
    .catch((err) => err.data);
};

export const forgotPassword = (body: object) => {
  return instance
    .post(`forgot-password`, body)
    .then((res) => res.data)
    .catch((err) => err);
};

export const resetPassword = (body: object, id: string) => {
  return instance
    .post(`reset-password/${id}`, body)
    .then((res) => res.data)
    .catch((err) => err);
};
