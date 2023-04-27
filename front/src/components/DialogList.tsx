import { FC } from 'react';
import { Box } from '@mui/joy';
import Dialog from './Dialog';

const DialogList: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {new Array(12).fill('ddd').map(() => (
        <Dialog />
      ))}
    </Box>
  );
};

export default DialogList;
