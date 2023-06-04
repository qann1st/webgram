import { Avatar, Box, Typography } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setIsDialogsOpened } from '../store/slices/dialogsSlice';
import { getLastMessage } from '../utils/Api';
import { IMessage } from '../utils/types';
import { setCurrentEnemy } from '../store/slices/currentEnemy';

interface IDialogProps {
  name: string;
  _id: string;
  avatar: string;
  messages: IMessage[] | null;
  isOnline: boolean;
}

const Dialog: FC<IDialogProps> = ({ name, messages, _id, avatar, isOnline }) => {
  const { mode } = useColorScheme();
  const user = useAppSelector((state) => state.user.user);
  const users = useAppSelector((state) => state.users.users);
  const [lastMessage, setLastMessage] = useState('');
  const dispatch = useAppDispatch();
  const id =
    user?._id !== undefined && user._id > _id ? `${_id}${user?._id}` : `${user?._id}${_id}`;
  const params = useParams();

  useEffect(() => {
    getLastMessage(id).then((res) => {
      if (res.audio) {
        setLastMessage('Голосовое сообщение');
      } else {
        setLastMessage(res?.text);
      }
    });
    // eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    params.id?.includes(_id) && dispatch(setCurrentEnemy(users?.find((user) => user._id === _id)));
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
            backgroundColor:
              mode !== 'dark'
                ? params.id !== id
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.04)'
                : params.id !== id
                ? 'rgba(0, 0, 0, 0.04)'
                : 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatar}
              alt={name}
              sx={{ width: '48px', height: '48px', borderRadius: '50%' }}
            />
            {isOnline && (
              <Box
                sx={{
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    backgroundColor: 'rgb(28, 231, 27)',
                    borderRadius: '50%',
                    bottom: '5px',
                    right: '2px',
                    width: '10px',
                    height: '10px',
                  },
                }}></Box>
            )}
          </Box>
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
