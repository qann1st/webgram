import { FC, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { io } from 'socket.io-client';
import { useAppSelector } from '../hooks';
import { useAppDispatch } from '../hooks/index';
import Auth from '../pages/Auth';
import Main from '../pages/Main';
import Register from '../pages/Register';
import { setUser } from '../store/slices/userSlice';
import { getUserMe } from '../utils/Api';
import AuthOutlet from './AuthOutlet';
import Loader from './Loader';
import PrivateOutlet from './PrivateOutlet';

export const socket = io('https://webgram.api.qann1st.site');

const AppRouter: FC = () => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

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
        <Route path="/messages" element={<Main />} />
        <Route path="/messages/:id" element={<Main />} />
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
