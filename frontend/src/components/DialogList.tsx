import { Box } from '@mui/joy';
import { FC, memo, useEffect, useState } from 'react';
import { useAppSelector } from '../hooks';
import { IUser } from '../utils/types';
import Dialog from './Dialog';
import { useAppDispatch } from '../hooks/index';
import { getUsers } from '../utils/Api';
import { setUsersList } from '../store/slices/usersSlice';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router';
import Skeleton from './Skeleton';

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
        dispatch(setUsersList(users));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getUsersList();
    setInterval(() => getUsersList(), 4000);
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
    return (
      <>
        {new Array(6).fill(null).map((_, i) => (
          <Skeleton
            key={i}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              gap: '8px',
            }}>
            <Skeleton.Circle sx={{ width: '48px', height: '48px' }} />
            <Box>
              <Skeleton.Rectangle sx={{ width: '120px', height: '18px' }} />
              <Skeleton.Rectangle sx={{ width: '60px', height: '12px', marginTop: '5px' }} />
            </Box>
          </Skeleton>
        ))}
      </>
    );
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
