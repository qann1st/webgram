import { DeleteForeverOutlined, EmojiEmotions, Mic, Send, Stop } from '@mui/icons-material';
import { Box, IconButton, Input, Typography } from '@mui/joy';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useAppSelector } from '../hooks';
import { useColorScheme } from '@mui/joy/styles';
import { Socket } from 'socket.io-client';
import Player from './WaveForm';
import { secondInClocks } from '../utils/features';

const NewMessage: FC<{ socketio: Socket }> = ({ socketio }) => {
  const user = useAppSelector((state) => state.user.user);
  const { id } = useParams();
  const [value, setValue] = useState('');
  const [isEmojiesOpened, setIsEmojiesOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWritable, setIsWritable] = useState(false);
  const [recordingData, setRecordingData] = useState<{ data: Blob; duration: number } | null>(null);
  const [timer, setTimer] = useState('00:00');
  const { mode } = useColorScheme();
  const [isRecording, setIsRecording] = useState(false);
  const stopVoiceRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (value.length > 0) {
      socketio.emit('message', {
        owner: user,
        text: value,
        roomId: id,
      });
      setValue('');
      setIsEmojiesOpened(false);
    } else {
      socketio.emit('audioMessage', {
        owner: user,
        roomId: id,
        audioBlob: recordingData,
      });
      setIsPlaying(false);
      setRecordingData(null);
      setIsWritable(false);
    }
  };

  useEffect(() => {
    if (isRecording) {
      let currTime = 0;
      const interval = setInterval(() => {
        currTime++;
        const clocks = secondInClocks(currTime);
        setTimer(
          `${clocks.minutes < 10 ? 0 : ''}${clocks.minutes}:${clocks.seconds < 10 ? 0 : ''}${
            clocks.seconds
          }`,
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  function startRecord() {
    navigator.permissions
      .query({ name: 'microphone' as PermissionName })
      .then((result) => {
        if (result.state === 'granted') {
          return navigator.mediaDevices.getUserMedia({ audio: true });
        } else if (result.state === 'prompt') {
          return navigator.mediaDevices.getUserMedia({ audio: true });
        } else {
          throw new Error('Permission not granted');
        }
      })
      .then(function (stream) {
        let options: {
          mimeType?: string;
          audioBitsPerSecond: number;
        } = { audioBitsPerSecond: 128000 };

        const types = [
          'video/webm',
          'audio/webm',
          'video/webm;codecs=vp8',
          'video/webm;codecs=daala',
          'video/webm;codecs=h264',
          'audio/webm;codecs=opus',
          'video/mpeg',
        ];

        for (const type of types) {
          if (MediaRecorder.isTypeSupported(type)) {
            options.mimeType = type;
          } else {
            continue;
          }
        }

        const recordedChunks: Blob[] = [];
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.start();
        setIsRecording(true);
        mediaRecorder.addEventListener('dataavailable', function (e: BlobEvent) {
          if (e.data.size > 0) recordedChunks.push(e.data);
        });
        mediaRecorder.addEventListener('stop', function () {
          const duration = recordedChunks[0].size / 16000;

          setRecordingData({ data: recordedChunks[0], duration: duration });
        });
        if (stopVoiceRef.current)
          stopVoiceRef.current.addEventListener('click', function onStopClick() {
            cancelAnimationFrame(1);
            mediaRecorder.stop();
            setIsRecording(false);
            setIsPlaying(true);
            setTimer('00:00');
            this.removeEventListener('click', onStopClick);
          });
      })
      .catch((error) => {
        alert('Разрешите использовать микрофон');
        setIsWritable(false);
        console.error(error);
      });
  }

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      {isPlaying ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            backgroundColor: mode === 'dark' ? '#09090D' : '#fff',
            width: '100%',
            margin: '5px',
            padding: '5px',
            borderRadius: '10px',
            alignItems: 'center',
          }}>
          <IconButton
            onClick={() => {
              setIsPlaying(false);
              setRecordingData(null);
              setIsWritable(false);
            }}
            sx={{
              cursor: 'pointer',
              display: { xs: 'none', md: 'flex' },
              border: 'none',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <DeleteForeverOutlined />
          </IconButton>
          {recordingData && (
            <Player
              sx={{ width: '100%', padding: '0 10px', display: 'flex', gap: '10px' }}
              width="100%"
              isInput={true}
              link={URL.createObjectURL(recordingData.data)}
              duration={recordingData.duration}
            />
          )}
          <IconButton
            type="submit"
            sx={{
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <Send />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: 'transparent',
            padding: '0 5px 5px',
            boxSizing: 'content-box',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
          <Box
            sx={{ width: '100%', display: 'flex', position: 'relative' }}
            component="form"
            onSubmit={handleSubmit}>
            <Box
              sx={{
                width: '10px',
                height: '10px',
                backgroundColor: 'rgb(255, 60, 50)',
                position: 'absolute',
                zIndex: 1,
                top: '19px',
                left: '18px',
                borderRadius: '50%',
                display: isRecording ? 'block' : 'none',
                animation: 'infinite 1.5s recording',
                '@keyframes recording': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0 },
                  '100%': { opacity: 1 },
                },
              }}
            />
            <Typography
              sx={{
                cursor: 'pointer',
                position: 'absolute',
                top: '13px',
                zIndex: 1,
                left: '32px',
                display: isRecording ? 'block' : 'none',
              }}>
              {timer}
            </Typography>
            <Input
              size="lg"
              placeholder={isRecording || isPlaying ? '' : 'Сообщение'}
              sx={{
                width: '100%',
                height: '50px',
                fontFamily: 'sans-serif, Noto Color Emoji',
              }}
              onChange={(e) => setValue(e.target.value)}
              value={value}
              readOnly={isWritable}
            />
            <IconButton
              onClick={() => setIsEmojiesOpened((prev) => !prev)}
              sx={{
                cursor: 'pointer',
                position: 'absolute',
                display: { xs: 'none', md: isRecording || isPlaying ? 'none' : 'flex' },
                right: '40px',
                top: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}>
              <EmojiEmotions />
            </IconButton>
            <IconButton
              ref={stopVoiceRef}
              sx={{
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                position: 'absolute',
                top: '4px',
                right: '5px',
                display: isRecording ? 'flex' : 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}>
              <Stop />
            </IconButton>
            {value.length === 0 ? (
              <>
                <IconButton
                  onClick={() => {
                    setIsWritable(true);
                    startRecord();
                  }}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none',
                    position: 'absolute',
                    top: '4px',
                    right: '5px',
                    display: isRecording || isPlaying ? 'none' : 'flex',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}>
                  <Mic />
                </IconButton>
              </>
            ) : (
              <IconButton
                type="submit"
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  position: 'absolute',
                  top: '4px',
                  right: '5px',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}>
                <Send />
              </IconButton>
            )}
            <Box
              onMouseLeave={() => setIsEmojiesOpened(false)}
              sx={{ position: 'absolute', bottom: '60px', right: 0, zIndex: 5 }}>
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
      )}
    </Box>
  );
};

export default NewMessage;
