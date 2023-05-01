import { useEffect } from 'react';
import { io } from 'socket.io-client';
import Main from '../pages/Main';
import { Navigate, Routes } from 'react-router';
import { Route } from 'react-router';
import { getUsers } from '../utils/Api';
import { useAppDispatch } from '../hooks';
import { setUsersList } from '../store/slices/usersSlice';

export const socket = io('http://localhost:4000');

function AppRouter() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    getUsers().then((users) => {
      dispatch(setUsersList(users));
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Routes>
      <Route path="/messages" element={<Main />} />
      <Route path="/messages/:id" element={<Main />} />
      <Route path="*" element={<Navigate to="/messages" />} />
    </Routes>
  );
}

export default AppRouter;
