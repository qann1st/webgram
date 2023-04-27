import { CssBaseline } from '@mui/joy/index';
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
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
          solidActiveBg: undefined,
        },
      },
    },
  },
});

const App = () => {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </CssVarsProvider>
  );
};

export default App;
