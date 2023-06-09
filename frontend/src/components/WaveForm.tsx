import { PauseCircleFilledOutlined, PlayCircleFilledOutlined } from '@mui/icons-material';
import { Box, BoxProps, IconButton, Typography } from '@mui/joy';
import { FC, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Skeleton from './Skeleton';
import { secondInClocks } from '../utils/features';

interface IPlayerProps {
  link: string;
  scrollRef?: HTMLDivElement | null;
  duration: number;
  isInput: boolean;
}

const Player: FC<IPlayerProps & BoxProps> = ({
  link,
  scrollRef,
  duration: durationMessage,
  sx,
  width = '200px',
  isInput,
}) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isVoiceLoading, setIsVoiceLoading] = useState(true);
  const [isTimer, setIsTimer] = useState(false);
  const [currentTimer, setCurrentTimer] = useState('');
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    let _wavesurfer = WaveSurfer.create({
      container: el.current,
      barWidth: 2,
      barRadius: 3,
      barGap: 2,
      barMinHeight: 2,
      cursorWidth: 1,
      backend: 'MediaElement',
      height: 30,
      progressColor: '#549CD7',
      responsive: true,
      waveColor: '#3A4D61',
      cursorColor: 'transparent',
      hideScrollbar: true,
      barHeight: 5,
    });
    _wavesurfer.load(link);

    setWavesurfer(_wavesurfer);

    _wavesurfer.on('ready', () => {
      const dur = _wavesurfer.getDuration();

      if (dur !== Infinity) {
        setDuration(dur);
      } else {
        const audio = new Audio(link);
        setDuration(audio.duration);
      }

      setIsVoiceLoading(false);
    });

    _wavesurfer.on('audioprocess', () => {
      setCurrentTime(_wavesurfer.getDuration() - _wavesurfer.getCurrentTime());
    });

    _wavesurfer.on('pause', () => {
      setIsTimer(true);
    });

    _wavesurfer.on('finish', () => {
      _wavesurfer?.stop();
      setPlaying(false);
      setIsTimer(false);
      setDuration(_wavesurfer.getDuration());
    });

    return () => {
      _wavesurfer.unAll();
      _wavesurfer.destroy();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollRef?.scrollIntoView();
  }, [isVoiceLoading, scrollRef]);

  useEffect(() => {
    const clocks = secondInClocks(duration ? duration : durationMessage);
    setTimer(
      `${Math.trunc(clocks.minutes) < 10 ? 0 : ''}${clocks.minutes}:${
        Math.trunc(clocks.seconds) < 10 ? 0 : ''
      }${Math.trunc(clocks.seconds)}`,
    );
    // eslint-disable-next-line
  }, [duration, wavesurfer]);

  useEffect(() => {
    if (wavesurfer) {
      const clocks = secondInClocks(wavesurfer.getCurrentTime());
      setCurrentTimer(
        `${Math.trunc(clocks.minutes) < 10 ? 0 : ''}${clocks.minutes}:${
          Math.trunc(clocks.seconds) < 10 ? 0 : ''
        }${Math.trunc(clocks.seconds)}`,
      );
    }
    // eslint-disable-next-line
  }, [currentTime]);

  const handlePlay = () => {
    setPlaying(!playing);
    wavesurfer?.playPause();
  };

  return (
    <>
      <Skeleton
        sx={{
          display: isVoiceLoading ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '-5px',
        }}>
        <Skeleton.Circle sx={{ width: '32px', height: '32px', marginRight: '5px' }} />
        <Box>
          <Skeleton.Rectangle width="200px" height="23px" margin="0" />
          <Skeleton.Rectangle width="42px" height="22px" margin="0" marginTop="6px" />
        </Box>
      </Skeleton>
      <Box
        sx={{
          ...sx,
          display: 'flex',
          visibility: isVoiceLoading ? 'hidden' : 'visible',
          height: isVoiceLoading ? 0 : 'auto',
        }}
        gap="5px"
        display="flex"
        alignItems="center">
        <IconButton color="primary" size="sm" onClick={handlePlay} sx={{ padding: 0 }}>
          {playing ? <PauseCircleFilledOutlined /> : <PlayCircleFilledOutlined />}
        </IconButton>
        <Box sx={sx}>
          <Box ref={el} width={width} />
          {isInput ? (
            <Typography
              sx={{
                wordWrap: 'break-word',
                fontFamily: 'sans-serif, Noto Color Emoji',
                fontSize: 16,
                lineHeight: 1,
                paddingTop: '6px',
              }}>
              {playing || isTimer ? currentTimer : timer}
            </Typography>
          ) : (
            <Typography
              sx={{
                wordWrap: 'break-word',
                fontFamily: 'sans-serif, Noto Color Emoji',
                fontSize: 16,
                lineHeight: 1,
                paddingTop: '6px',
              }}>
              {timer} {playing || isTimer ? '/ ' + currentTimer : ''}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Player;
