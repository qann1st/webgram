import { FC, useEffect, useState, useRef } from 'react';
import { Box, Divider, Typography } from '@mui/joy';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import DialogList from '../components/DialogList';
import { IMessage } from '../utils/types';
import { useAppDispatch } from '../hooks/index';
import { setUser } from '../store/slices/userSlice';
import { getUserMe } from '../utils/Api';
import { useParams } from 'react-router';
import Chat from '../components/Chat';

const Main: FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [isResize, setIsResize] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    getUserMe().then((user) => {
      dispatch(setUser(user));
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
      <Box style={{ maxWidth: '500px', minWidth: '200px', flex: 1 }} ref={sidebarRef}>
        <DialogList messages={messages} />
      </Box>
      <Divider
        onMouseDown={() => setIsResize(true)}
        orientation="vertical"
        sx={{
          width: '7px',
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
        }}>
        {params.id ? (
          <Chat messages={messages} setMessages={setMessages} />
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
