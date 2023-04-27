import { FC } from 'react';
import { Box } from '@mui/joy';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import DialogList from '../components/DialogList';
import { useColorScheme } from '@mui/joy/styles';
import Search from '../components/Search';

const Main: FC = () => {
  const { mode } = useColorScheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <ColorSchemeToggle />
      <Box
        sx={{
          width: '500px',
          minWidth: '200px',
          maxWidth: '500px',
          borderRight: '1px solid gray',
        }}>
        <Search />
        <DialogList />
      </Box>
      <Box
        sx={{
          width: '100%',
          backgroundColor: `${mode === 'light' && '#74B4E0'}`,
        }}></Box>
    </Box>
  );
};

export default Main;
