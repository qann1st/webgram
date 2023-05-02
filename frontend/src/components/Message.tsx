import { FC } from 'react';
import { Avatar, Box, Card, Typography } from '@mui/joy';
import { IUser } from '../utils/types';
import { useAppSelector } from '../hooks';
import { intlFormatDistance } from 'date-fns';

interface IPropsMessage {
  owner: IUser;
  text: string;
  timestamp: number;
}

const Message: FC<IPropsMessage> = ({ owner, text, timestamp }) => {
  const rtf = intlFormatDistance(new Date(timestamp), Date.now(), { locale: 'ru' });
  const { user } = useAppSelector((state) => state.user);

  return (
    <Box
      sx={{
        display: owner ? 'flex' : 'none',
        px: 2,
        margin: '20px 0 0',
        gap: 1,
        justifyContent: 'flex-start',
        ...(owner?._id === user?._id && {
          flexDirection: 'row-reverse',
        }),
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          color: 'gray',
          fontWeight: 300,
          padding: 1,
          alignItems: 'center',
          gap: 1,
        }}>
        <Avatar sx={{ width: '48px', height: '48px' }} src={owner?.avatar} alt={owner?.name} />
        <Typography variant="soft">{rtf}</Typography>
      </Box>
      <Card
        sx={{
          maxWidth: { xs: '60vw', md: '35vw' },
          display: 'flex',
          flexDirection: 'column',
          padding: { xs: 1, md: '10px' },
          gap: 1,
          width: 'max-content',
        }}>
        <Box
          sx={{
            display: 'flex',
            ...(owner._id === user?._id && {
              justifyContent: 'end',
              width: 'max-content',
            }),
          }}>
          <Typography
            sx={{
              lineHeight: '15px',
              fontStyle: 'normal',
              textAlign: 'justify',
            }}>
            {owner?.name}
          </Typography>
        </Box>
        <Typography
          sx={{
            wordWrap: 'break-word',
            fontFamily: 'sans-serif, Noto Color Emoji',
            fontSize: 16,
            lineHeight: 1,
          }}>
          {text}
        </Typography>
      </Card>
    </Box>
  );
};

export default Message;
