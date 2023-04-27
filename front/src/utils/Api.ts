import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'Access-Control': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGE3NWY3NjRiNDNmOWE0MDljNzg1NiIsImlhdCI6MTY4MjYwMjA0NiwiZXhwIjoxNjgzMjA2ODQ2fQ.H_1puGftKNRtIQo-43qEuWOC_ujGqnWW-QOoW3NqiA4',
  },
});

export const getUsers = () => {
  return instance
    .get(`users`)
    .then((res) => res.data)
    .catch((err) => err.data);
};
