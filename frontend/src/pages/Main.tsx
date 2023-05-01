import { FC, useEffect, useState, useRef, useCallback } from 'react';
import { Box, Divider, Typography } from '@mui/joy';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import DialogList from '../components/DialogList';
import { useColorScheme } from '@mui/joy/styles';
import { useAppSelector } from '../hooks';
import { IUser } from '../utils/types';
import { useAppDispatch } from '../hooks/index';
import { setUser } from '../store/slices/userSlice';
import { getUserMe } from '../utils/Api';
import { useParams } from 'react-router';
import Chat from '../components/Chat';

const Main: FC = () => {
  const { data } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<Array<IUser>>([]);
  const params = useParams();
  const [isResize, setIsResize] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUserMe().then((user) => {
      dispatch(setUser(user));
    });
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
  }, [isResize]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

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
        <DialogList users={users} />
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
        }}>
        {params.id ? (
          <Chat />
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
