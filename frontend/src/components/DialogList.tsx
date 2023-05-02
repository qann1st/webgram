import { FC } from 'react';
import { Box } from '@mui/joy';
import Dialog from './Dialog';
import { IMessage, IUser } from '../utils/types';
import { useAppSelector } from '../hooks';

interface ISearchProps {
  messages: IMessage[];
}

const DialogList: FC<ISearchProps> = ({ messages }) => {
  const { user } = useAppSelector((state) => state.user);
  const { users } = useAppSelector((state) => state.users);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowY: 'scroll',
        height: '100vh',
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
            _id={user._id}
            name={user.name}
            avatar={user.avatar}
            messages={messages[messages.length - 1]}
          />
        ))}
    </Box>
  );
};

export default DialogList;
