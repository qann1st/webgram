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
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Success from '../pages/Success';

export const socket = (id: string) => {
  const socketUrl = process.env.REACT_APP_SOCKET_URL ?? '';
  return io(socketUrl, {
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getUserMe()
      .then((user) => {
        if (user) {
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid" element={<ResetPassword />} />
        <Route
          path="/success-forgot"
          element={<Success text={`Письмо успешно отправлено на почту`} />}
        />
        <Route path="/success-reset" element={<Success text={`Пароль успешно изменен`} />} />
      </Route>
      <Route path="*" element={<Navigate to="/messages" />} />
    </Routes>
  );
};

export default AppRouter;
