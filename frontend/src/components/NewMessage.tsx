import { Box, IconButton, Input } from '@mui/joy';
import { Send } from '@mui/icons-material';
import { socket } from './AppRouter';
import { useAppSelector } from '../hooks';
import { useParams } from 'react-router';
import { FC, useState } from 'react';

const NewMessage: FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const { id } = useParams();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.length > 0) {
      socket.emit('message', {
        owner: user,
        text: value,
        roomId: id,
      });
      setValue('');
    }
  };

  return (
    <Box sx={{ position: 'sticky', bottom: 0, margin: '0 5px' }}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.primary[400],
          padding: '0 5px 5px',
          boxSizing: 'content-box',
        }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative' }}>
          <Input size="lg" onChange={(e) => setValue(e.target.value)} value={value} />
          <IconButton
            type="submit"
            sx={{
              position: 'absolute',
              top: 4,
              right: 5,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default NewMessage;
