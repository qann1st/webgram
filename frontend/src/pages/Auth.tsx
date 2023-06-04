import { Box, Button, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import { useAppDispatch } from '../hooks/index';
import { setUser } from '../store/slices/userSlice';
import { getUserMe, signIn, setToken } from '../utils/Api';
import { LOCAL_STORAGE_JWT_KEY } from '../utils/constants';

const Auth: FC = () => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mode } = useColorScheme();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);

    signIn(formProps).then((res) => {
      if (res === undefined) {
        setIsErrorVisible(true);
      } else {
        setToken(res.token);
        localStorage.setItem(LOCAL_STORAGE_JWT_KEY, res.token);
        setIsErrorVisible(false);
        getUserMe().then((res) => {
          dispatch(setUser(res));
        });
        navigate('/messages');
      }
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        width: 'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
        maxWidth: '100%',
        px: 2,
      }}>
      <Box
        component="header"
        sx={{
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <ColorSchemeToggle />
      </Box>
      <Box
        component="main"
        sx={{
          my: 'auto',
          py: 2,
          pb: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: 400,
          maxWidth: '100%',
          mx: 'auto',
          borderRadius: 'sm',
          '& form': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          },
        }}>
        <div>
          <Typography component="h2" fontSize="xl2" fontWeight="lg">
            Авторизация
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <FormControl required>
            <FormLabel>E-mail</FormLabel>
            <Input placeholder="Введите почту" type="email" name="email" />
          </FormControl>
          <FormControl required>
            <FormLabel>Пароль</FormLabel>
            <Input placeholder="•••••••" type="password" name="password" />
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Typography
              fontSize="14px"
              fontFamily="sans-serif, Noto Color Emoji"
              lineHeight="0.5"
              sx={{ color: 'red', margin: 0, padding: 0 }}>
              {isErrorVisible ? 'Неверная почта или пароль' : ''}
            </Typography>
          </Box>
          <Button type="submit" fullWidth>
            Войти
          </Button>
        </form>
        <Link
          style={{
            textAlign: 'center',
            textDecoration: 'none',
            color: mode === 'dark' ? 'white' : 'black',
            fontFamily: 'sans-serif',
          }}
          to="/sign-up">
          Ещё не зарегистрированы? Регистрация
        </Link>
        <Link
          style={{
            textAlign: 'center',
            textDecoration: 'none',
            color: mode === 'dark' ? 'white' : 'black',
            wordWrap: 'break-word',
            fontFamily: 'sans-serif',
            fontSize: 16,
            lineHeight: 1,
          }}
          to="/forgot-password">
          Забыли пароль?
        </Link>
      </Box>
      <Box component="footer" sx={{ py: 3 }}></Box>
    </Box>
  );
};

export default Auth;
