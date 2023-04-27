import { useEffect } from 'react';
import { io } from 'socket.io-client';
import Main from '../pages/Main';
import { Routes } from 'react-router';
import { Route } from 'react-router';

export const socket = io('http://localhost:3000');

function AppRouter() {
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join', '123');
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default AppRouter;
