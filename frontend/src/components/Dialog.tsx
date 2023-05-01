import { FC } from 'react';
import { IUser } from '../utils/types';
import { Box, Typography } from '@mui/joy';
import { Link } from 'react-router-dom';
import { useColorScheme } from '@mui/joy/styles';
import { useAppSelector } from '../hooks';

const Dialog: FC<IUser> = ({ name, _id, login, avatar }) => {
  const { mode } = useColorScheme();
  const { data } = useAppSelector((state) => state.user);

  return (
    <Link style={{ textDecoration: 'none' }} to={`/messages/${_id}${data?._id}`}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '10px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.04)',
          },
        }}>
        <img src={avatar} alt={name} style={{ width: '48px', borderRadius: '50%' }} />
        <Typography>{name}</Typography>
      </Box>
    </Link>
  );
};

export default Dialog;
