import { Box, Button, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import { forgotPassword } from '../utils/Api';

const ForgotPassword: FC = () => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const navigate = useNavigate();
  const { mode } = useColorScheme();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);

    forgotPassword(formProps).then((res) => {
      if (!res.message) {
        localStorage.setItem('email', String(formProps.email));
        localStorage.setItem('uid', res);
        navigate('/success-forgot');
      } else {
        setIsErrorVisible(true);
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
            Восстановление пароля
          </Typography>
        </div>
        <form style={{ gap: '12px' }} onSubmit={handleSubmit}>
          <FormControl required>
            <FormLabel>E-mail</FormLabel>
            <Input placeholder="Введите почту" type="email" name="email" />
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Typography
              fontSize="14px"
              fontFamily="sans-serif"
              lineHeight="0.5"
              sx={{ color: 'red', margin: '3px 0 7px', padding: 0, height: 0 }}>
              {isErrorVisible ? 'Такого пользователя не существует' : ''}
            </Typography>
          </Box>
          <Button type="submit" fullWidth>
            Отправить письмо с восстановлением
          </Button>
        </form>
        <Link
          style={{
            textAlign: 'center',
            textDecoration: 'none',
            color: mode === 'dark' ? 'white' : 'black',
            fontFamily: 'sans-serif',
          }}
          to="/sign-in">
          Вернуться к авторизации
        </Link>
      </Box>
      <Box component="footer" sx={{ py: 3 }}></Box>
    </Box>
  );
};

export default ForgotPassword;
