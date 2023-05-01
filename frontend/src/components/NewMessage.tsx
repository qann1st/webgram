import { Box, IconButton, Input } from '@mui/joy';
import { Send } from '@mui/icons-material';
import { socket } from './AppRouter';
import { useAppSelector } from '../hooks';
import { useParams } from 'react-router';
import { useState } from 'react';

const NewMessage = () => {
  const { data } = useAppSelector((state) => state.user);
  const { id } = useParams();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.length > 0) {
      socket.emit('message', {
        owner: data,
        text: value,
        roomId: id,
      });
      setValue('');
    }
  };

  return (
    <Box sx={{ position: 'sticky', bottom: 5, margin: '0 5px' }}>
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
  );
};

export default NewMessage;
