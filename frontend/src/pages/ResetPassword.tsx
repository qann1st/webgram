import { Box, Button, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';
import { FC, FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import { resetPassword } from '../utils/Api';

const ResetPassword: FC = () => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const params = useParams();
  const { mode } = useColorScheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements: any = e.currentTarget.elements;

    const data = {
      newPassword: formElements.password.value,
      email: localStorage.getItem('email'),
      randomToken: localStorage.getItem('uid'),
    };

    if (params.uid) {
      resetPassword(data, params.uid).finally(() => {
        navigate('/success-reset');
      });
    }
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
            Изменение пароля
          </Typography>
        </div>
        <form style={{ gap: '20px' }} onSubmit={handleSubmit}>
          <FormControl required>
            <FormLabel>Новый пароль</FormLabel>
            <Input placeholder="•••••••" type="password" name="password" />
          </FormControl>
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

export default ResetPassword;
