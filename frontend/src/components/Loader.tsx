import { Box, CircularProgress } from '@mui/joy';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
      }}>
      <CircularProgress sx={{ color: 'secondary.dark' }} />
    </Box>
  );
};

export default Loader;
