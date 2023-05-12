import { Box, Typography } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setIsDialogsOpened } from '../store/slices/dialogsSlice';
import { getLastMessage } from '../utils/Api';
import { IMessage } from '../utils/types';

interface IDialogProps {
  name: string;
  _id: string;
  avatar: string;
  messages: IMessage[] | null;
}

const Dialog: FC<IDialogProps> = ({ name, messages, _id, avatar }) => {
  const { mode } = useColorScheme();
  const user = useAppSelector((state) => state.user.user);
  const [lastMessage, setLastMessage] = useState('');
  const dispatch = useAppDispatch();
  const id =
    user?._id !== undefined && user._id > _id ? `${_id}${user?._id}` : `${user?._id}${_id}`;

  useEffect(() => {
    getLastMessage(id).then((res) => {
      setLastMessage(res?.text);
    });
  }, [messages]);

  return (
    <div onClick={() => dispatch(setIsDialogsOpened(false))}>
      <Link style={{ textDecoration: 'none' }} to={`/messages/${id}`}>
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
                lineHeight: 1.1,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: {
                  xs: 'calc(100vw - 100px)',
                  md: '255px',
                },
              }}>
              {lastMessage}
            </Typography>
          </Box>
        </Box>
      </Link>
    </div>
  );
};

export default Dialog;
