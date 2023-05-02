import { getUserMe, signUp, signIn } from '../utils/Api';
import { LOCAL_STORAGE_JWT_KEY } from '../utils/constants';
import { Box, FormLabel, Typography, FormControl, Input, Button } from '@mui/joy';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { setUser } from '../store/slices/userSlice';

const Register = () => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements: any = e.currentTarget.elements;

    const data = {
      email: formElements.email.value,
      password: formElements.password.value,
      name: formElements.name.value,
      login: formElements.login.value,
    };

    signUp(data).then((res) => {
      if (res === undefined) {
        setIsErrorVisible(true);
      } else {
        setIsErrorVisible(false);
        navigate('/sign-in');
        signIn({ email: data.email, password: data.password }).then((res) => {
          if (res === undefined) {
            setIsErrorVisible(true);
          } else {
            setIsErrorVisible(false);
            getUserMe().then((res) => {
              dispatch(setUser(res));
            });
            navigate('/messages');
            localStorage.setItem(LOCAL_STORAGE_JWT_KEY, res.token);
          }
        });
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
            Регистрация
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <FormControl required>
            <FormLabel>Имя</FormLabel>
            <Input placeholder="Введите имя" type="name" name="name" />
          </FormControl>
          <FormControl required>
            <FormLabel>E-mail</FormLabel>
            <Input placeholder="Введите почту" type="email" name="email" />
          </FormControl>
          <FormControl required>
            <FormLabel>Логин</FormLabel>
            <Input placeholder="Введите ваш логин" type="login" name="login" />
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
              {isErrorVisible ? 'Неверно заполнены поля' : ''}
            </Typography>
          </Box>
          <Button type="submit" fullWidth>
            Регистрация
          </Button>
        </form>
        <Link
          style={{
            textAlign: 'center',
            textDecoration: 'none',
            color: 'var(--joy-palette-primary-50)',
          }}
          to="/sign-in">
          Уже зарегистрированы? Авторизация
        </Link>
      </Box>
      <Box component="footer" sx={{ py: 3 }}></Box>
    </Box>
  );
};

export default Register;