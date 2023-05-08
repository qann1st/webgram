import { CssBaseline } from '@mui/joy/index';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { FC } from 'react';
import AppRouter from './AppRouter';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidActiveBg: undefined,
        },
      },
    },
    dark: {
      palette: {
        primary: {
          400: '#131318',
        },
      },
    },
  },
});

const App: FC = () => {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </CssVarsProvider>
  );
};

export default App;
