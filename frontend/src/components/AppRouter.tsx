import { FC, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { io } from 'socket.io-client';
import { useAppSelector } from '../hooks';
import { useAppDispatch } from '../hooks';
import Auth from '../pages/Auth';
import Main from '../pages/Main';
import Register from '../pages/Register';
import { setUser } from '../store/slices/userSlice';
import { getUserMe } from '../utils/Api';
import AuthOutlet from './AuthOutlet';
import Loader from './Loader';
import PrivateOutlet from './PrivateOutlet';

export const socket = (id: string) => {
  return io('http://localhost:4000', {
    query: {
      params: id,
    },
  });
};

const AppRouter: FC = () => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector((state) => state.user.user);
  const socketio = socket(user ? user._id : '');

  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      socketio.disconnect();
    });
  }, []);

  useEffect(() => {
    getUserMe()
      .then((user) => {
        if (user !== undefined) {
          dispatch(setUser(user));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, [isAuth]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route element={<PrivateOutlet isAuth={isAuth} />}>
        <Route path="/messages" element={<Main socketio={socketio} />} />
        <Route path="/messages/:id" element={<Main socketio={socketio} />} />
      </Route>
      <Route element={<AuthOutlet isAuth={isAuth} />}>
        <Route path="/sign-in" element={<Auth />} />
        <Route path="/sign-up" element={<Register />} />
      </Route>
      <Route path="*" element={<Navigate to="/messages" />} />
    </Routes>
  );
};

export default AppRouter;
