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
}

const Player: FC<IPlayerProps & BoxProps> = ({
  link,
  scrollRef,
  duration: durationMessage,
  sx,
  width = '200px',
}) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isVoiceLoading, setIsVoiceLoading] = useState(true);
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

    _wavesurfer.on('audioprocess', function () {
      setCurrentTime(_wavesurfer.getDuration() - _wavesurfer.getCurrentTime());
    });

    _wavesurfer.on('finish', function () {
      _wavesurfer?.stop();
      setPlaying(false);
      setDuration(_wavesurfer.getDuration());
    });

    return () => {
      _wavesurfer.unAll();
      _wavesurfer.destroy();
    };
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
        <Box>
          <Box width={width} ref={el} />
          <Typography
            sx={{
              wordWrap: 'break-word',
              fontFamily: 'sans-serif, Noto Color Emoji',
              fontSize: 16,
              lineHeight: 1,
              paddingTop: '6px',
            }}>
            {timer} {playing ? '/ ' + currentTimer : ''}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Player;
