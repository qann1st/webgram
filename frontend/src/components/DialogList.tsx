import { Dispatch, FC, SetStateAction } from 'react';
import { Box } from '@mui/joy';
import Dialog from './Dialog';
import { IMessage, IUser } from '../utils/types';
import { useAppSelector } from '../hooks';

interface IDialogListProps {
  messages: IMessage[];
  setIsDialogsOpened: Dispatch<SetStateAction<boolean>>;
}

const DialogList: FC<IDialogListProps> = ({ messages, setIsDialogsOpened }) => {
  const { user } = useAppSelector((state) => state.user);
  const { users } = useAppSelector((state) => state.users);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
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
            messages={messages}
            _id={user._id}
            name={user.name}
            avatar={user.avatar}
            setIsDialogsOpened={setIsDialogsOpened}
          />
        ))}
    </Box>
  );
};

export default DialogList;
