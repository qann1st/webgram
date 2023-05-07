import { FC, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/joy';
import { Link } from 'react-router-dom';
import { useColorScheme } from '@mui/joy/styles';
import { useAppSelector } from '../hooks';
import { getLastMessage } from '../utils/Api';
import { IMessage } from '../utils/types';

interface IDialogProps {
  name: string;
  _id: string;
  avatar: string;
  messages: IMessage[];
}

const Dialog: FC<IDialogProps> = ({ name, messages, _id, avatar }) => {
  const { mode } = useColorScheme();
  const { user } = useAppSelector((state) => state.user);
  const [lastMessage, setLastMessage] = useState('');
  const id =
    user?._id !== undefined && user?._id > _id
      ? `/messages/${_id}${user?._id}`
      : `/messages/${user?._id}${_id}`;

  useEffect(() => {
    getLastMessage(id).then((res) => {
      setLastMessage(res?.text);
    });
  }, [messages]);

  return (
    <Link style={{ textDecoration: 'none' }} to={id}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '10px',
          cursor: 'pointer',
          transition: 'all 0.1s linear',
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
            {lastMessage}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default Dialog;
