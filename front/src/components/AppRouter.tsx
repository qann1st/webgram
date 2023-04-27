import { useEffect } from 'react';
import { io } from 'socket.io-client';
import Main from '../pages/Main';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import { getUsers } from '../utils/Api';
import { useAppDispatch } from '../hooks';
import { setUsersList } from '../store/slices/usersSlice';

// export const socket = io('http://localhost:3000');

function AppRouter() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    getUsers().then((res) => {
      dispatch(setUsersList());
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default AppRouter;
