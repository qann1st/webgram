import { FC, useEffect, useState, useRef } from 'react';
import { Box, Divider, Typography } from '@mui/joy';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import DialogList from '../components/DialogList';
import { IMessage } from '../utils/types';
import { useAppDispatch } from '../hooks/index';
import { getUsers } from '../utils/Api';
import { useParams } from 'react-router';
import Chat from '../components/Chat';
import { setUsersList } from '../store/slices/usersSlice';

const Main: FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [isResize, setIsResize] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isDialogsOpened, setIsDialogsOpened] = useState(true);

  useEffect(() => {
    getUsers().then((users) => {
      dispatch(setUsersList(users));
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const resize = () => {
      setIsResize(false);
    };

    window.addEventListener('mousemove', resizeSidebar);
    window.addEventListener('mouseup', resize);

    return () => {
      window.removeEventListener('mousemove', resizeSidebar);
      window.removeEventListener('mouseup', resize);
    };
    // eslint-disable-next-line
  }, [isResize]);

  const resizeSidebar = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sidebarRef.current && isResize) {
      sidebarRef.current.style.maxWidth = e.clientX + 'px';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <ColorSchemeToggle />
      <Box
        sx={{
          display: {
            xs: isDialogsOpened ? 'block' : 'none',
            md: 'block',
          },
          maxWidth: {
            xs: '100%',
            md: '500px',
          },
          minWidth: '320px',
          flex: 1,
        }}
        ref={sidebarRef}>
        <DialogList setIsDialogsOpened={setIsDialogsOpened} messages={messages} />
      </Box>
      <Divider
        onMouseDown={() => setIsResize(true)}
        orientation="vertical"
        sx={{
          width: '7px',
          display: {
            xs: 'none',
            md: 'flex',
          },
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.softHoverBg,
            cursor: 'pointer',
          },
          '&:active': {
            cursor: 'grab',
          },
        }}
      />
      <Box
        sx={{
          width: '100%',
          backgroundColor: (theme) => theme.palette.primary[400],
          flex: 1,
          minHeight: '100vh',
          display: {
            xs: !isDialogsOpened ? 'block' : 'none',
            md: 'block',
          },
        }}>
        {params.id ? (
          <Chat
            setIsDialogsOpened={setIsDialogsOpened}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Typography>Выберите чат</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Main;
