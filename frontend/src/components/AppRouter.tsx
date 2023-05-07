import { io } from 'socket.io-client';
import Main from '../pages/Main';
import { Navigate, Routes } from 'react-router';
import { Route } from 'react-router';
import { getUserMe } from '../utils/Api';
import { useAppSelector } from '../hooks';
import PrivateOutlet from './PrivateOutlet';
import AuthOutlet from './AuthOutlet';
import Auth from '../pages/Auth';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/index';
import { setUser } from '../store/slices/userSlice';
import Loader from './Loader';
import Register from '../pages/Register';

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
  }, []);

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
