import { FC } from 'react';
import { Box } from '@mui/joy';
import Dialog from './Dialog';
import { IUser } from '../utils/types';
import { useAppSelector } from '../hooks';

interface ISearchProps {
  users: Array<IUser>;
}

const DialogList: FC<ISearchProps> = ({ users }) => {
  const { data } = useAppSelector((state) => state.user);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {users
        ?.filter((user) => user._id !== data?._id)
        .map((user: IUser) => (
          <Dialog
            key={user._id}
            _id={user._id}
            name={user.name}
            login={user.login}
            avatar={user.avatar}
          />
        ))}
    </Box>
  );
};

export default DialogList;
