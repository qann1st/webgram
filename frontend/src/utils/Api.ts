import axios from 'axios';
import { LOCAL_STORAGE_JWT_KEY } from './constants';

const instance = axios.create({
  baseURL: 'https://webgram-backend.onrender.com/',
  headers: {
    'Access-Control': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem(LOCAL_STORAGE_JWT_KEY),
  },
});

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

export const getRoomMessages = (id: string | undefined) => {
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
