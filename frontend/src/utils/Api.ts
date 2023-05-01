import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'Access-Control': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGE3NWY3NjRiNDNmOWE0MDljNzg1NiIsImlhdCI6MTY4Mjk3ODcwNCwiZXhwIjoxNjgzNTgzNTA0fQ.fmtNc9e7MXcPpDQLWUDcYNsbcJDMg8Q-R_y_bKspRaM',
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
