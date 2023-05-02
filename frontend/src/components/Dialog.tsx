import { FC } from 'react';
import { IMessage } from '../utils/types';
import { Box, Typography } from '@mui/joy';
import { Link } from 'react-router-dom';
import { useColorScheme } from '@mui/joy/styles';
import { useAppSelector } from '../hooks';

interface IDialogProps {
  name: string;
  _id: string;
  avatar: string;
  messages: IMessage;
}

const Dialog: FC<IDialogProps> = ({ name, _id, avatar, messages }) => {
  const { mode } = useColorScheme();
  const { user } = useAppSelector((state) => state.user);

  return (
    <Link style={{ textDecoration: 'none' }} to={`/messages/${_id}${user?._id}`}>
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
        <Box>
          <Typography>{name}</Typography>
          <Typography
            sx={{
              fontFamily: 'sans-serif, Noto Color Emoji',
              fontSize: 16,
              lineHeight: 1,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              maxWidth: '320px',
            }}>
            {messages?.text}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default Dialog;
