import { Box } from '@mui/joy';
import { FC, memo, useEffect, useState } from 'react';
import { useAppSelector } from '../hooks';
import { IUser } from '../utils/types';
import Dialog from './Dialog';
import { useAppDispatch } from '../hooks/index';
import { getUsers } from '../utils/Api';
import { setUsersList } from '../store/slices/usersSlice';
import Loader from './Loader';

const DialogList: FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const users = useAppSelector((state) => state.users.users);
  const messages = useAppSelector((state) => state.messages.messages);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((users) => {
        dispatch(setUsersList(users));
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
          />
        ))}
    </Box>
  );
};

export default memo(DialogList);
