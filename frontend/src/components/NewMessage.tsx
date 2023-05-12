import { EmojiEmotions, Send } from '@mui/icons-material';
import { Box, IconButton, Input } from '@mui/joy';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { FC, useState } from 'react';
import { useParams } from 'react-router';
import { useAppSelector } from '../hooks';
import { socket } from './AppRouter';
import { useColorScheme } from '@mui/joy/styles';

const NewMessage: FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const { id } = useParams();
  const [value, setValue] = useState('');
  const [isEmojiesOpened, setIsEmojiesOpened] = useState(false);
  const { mode } = useColorScheme();

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
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
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.primary[400],
          padding: '0 5px 5px',
          boxSizing: 'content-box',
          width: '100%',
          display: 'flex',
          gap: '10px',
        }}>
        <Box
          sx={{ width: '100%', display: 'flex', position: 'relative' }}
          component="form"
          onSubmit={handleSubmit}>
          <Input
            size="lg"
            sx={{ width: '100%' }}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <IconButton
            onClick={() => setIsEmojiesOpened((prev) => !prev)}
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              right: '5px',
              top: '4px',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <EmojiEmotions />
          </IconButton>
          <Box sx={{ position: 'absolute', bottom: '60px', right: 0 }}>
            {isEmojiesOpened && (
              <EmojiPicker
                lazyLoadEmojis
                searchDisabled
                skinTonesDisabled
                theme={mode === 'dark' ? Theme.DARK : Theme.LIGHT}
                emojiStyle={EmojiStyle.GOOGLE}
                onEmojiClick={(e) => {
                  setValue((prev) => prev + e.emoji);
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      <IconButton
        onClick={(e) => handleSubmit(e)}
        sx={{
          cursor: 'pointer',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}>
        <Send />
      </IconButton>
    </Box>
  );
};

export default NewMessage;
