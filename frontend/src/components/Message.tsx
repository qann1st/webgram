import { Box, Card, Typography } from '@mui/joy';
import { FC, memo } from 'react';
import { useAppSelector } from '../hooks';
import { IUser } from '../utils/types';
import Player from './WaveForm';

interface IPropsMessage {
  owner: IUser;
  text: string;
  timestamp: number;
  audio: string;
  scrollRef: HTMLDivElement | null;
  duration: number;
}

const Message: FC<IPropsMessage> = ({ owner, text, timestamp, audio, scrollRef, duration }) => {
  const rtf = new Date(timestamp);
  const user = useAppSelector((state) => state.user.user);
  const hours = rtf.getHours().toString();
  const minutes = rtf.getMinutes().toString();

  return (
    <Box
      sx={{
        display: owner ? 'flex' : 'none',
        px: 2,
        margin: '3px 0 0',
        gap: 1,
        justifyContent: 'flex-start',
        ...(owner._id === user?._id && {
          flexDirection: 'row-reverse',
        }),
      }}>
      <Card
        sx={{
          maxWidth: { xs: '60vw', md: '35vw' },
          display: 'flex',
          flexDirection: 'column',
          padding: { xs: 1, md: '10px' },
          width: 'max-content',
          ...(user?._id === owner._id
            ? { borderBottomRightRadius: '0' }
            : { borderBottomLeftRadius: '0' }),
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: audio ? 'column' : 'flex',
            alignItems: 'flex-end',
            gap: '10px',
          }}>
          {text ? (
            <Typography
              sx={{
                wordWrap: 'break-word',
                fontFamily: 'sans-serif, Noto Color Emoji',
                fontSize: 16,
                lineHeight: 1,
              }}>
              {text}
            </Typography>
          ) : (
            <Player
              scrollRef={scrollRef}
              link={process.env.REACT_APP_API_URL + audio + '.wav'}
              duration={duration}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                wordWrap: 'break-word',
                fontFamily: 'sans-serif, Noto Color Emoji',
                fontSize: 10,
                height: '5px',
                marginTop: audio ? '-20px' : '',
              }}>
              {hours + ':' + (minutes.length === 1 ? 0 + minutes : minutes)}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default memo(Message);
