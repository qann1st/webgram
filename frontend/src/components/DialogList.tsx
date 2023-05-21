import { Box } from '@mui/joy';
import { FC, memo, useEffect, useState } from 'react';
import { useAppSelector } from '../hooks';
import { IUser } from '../utils/types';
import Dialog from './Dialog';
import { useAppDispatch } from '../hooks/index';
import { getUsers } from '../utils/Api';
import { setUsersList } from '../store/slices/usersSlice';
import Loader from './Loader';

import { useQuery } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router';

const DialogList: FC<{ socketio: Socket }> = ({ socketio }) => {
  const user = useAppSelector((state) => state.user.user);
  const users = useAppSelector((state) => state.users.users);
  const messages = useAppSelector((state) => state.messages.messages);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const getUsersList = () => {
    getUsers()
      .then((users) => {
        console.log(users);

        dispatch(setUsersList(users));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { data } = useQuery({
    queryFn: getUsers,
    staleTime: 10000,
    queryKey: ['users'],
  });

  useEffect(() => {
    dispatch(setUsersList(data));
  }, [data]);

  useEffect(() => {
    getUsersList();
    // eslint-disable-next-line
  }, [params.id]);

  useEffect(() => {
    socketio.emit('join', '*');

    socketio.on('message', () => {
      getUsersList();
    });

    return () => {
      socketio.emit('leave', '*');
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          backgroundColor: (theme) => theme.palette.primary[400],
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: (theme) => theme.palette.primary[500],
          borderRadius: '10px',
        },
      }}>
      {users
        ?.filter((us) => us._id !== user?._id)
        .map((user: IUser) => (
          <Dialog
            key={user._id}
            messages={messages}
            _id={user._id}
            name={user.name}
            avatar={user.avatar}
            isOnline={user.isOnline}
          />
        ))}
    </Box>
  );
};

export default memo(DialogList);
