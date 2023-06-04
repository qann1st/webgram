import { Box, BoxProps } from '@mui/joy';
import { FC, PropsWithChildren } from 'react';

interface ISkeletonCompound {
  Rectangle: typeof Rectangle;
  Circle: typeof Circle;
}

const Skeleton: FC<PropsWithChildren & BoxProps> & ISkeletonCompound = ({
  children,
  sx,
  ...rest
}) => {
  return (
    <Box sx={sx} {...rest}>
      {children}
    </Box>
  );
};

const Rectangle: FC<BoxProps> = ({ sx, ...rest }) => {
  return (
    <Box
      {...rest}
      sx={{
        ...sx,
        display: 'block',
        borderRadius: '10px',
        backgroundColor: 'rgba(150, 150, 150, 0.4)',
        overflow: 'hidden',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.11)',
        opacity: 0,
        animation: 'loading 1.5s infinite',
        '@keyframes loading': {
          '0%': { opacity: 0.5 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.5 },
        },
      }}></Box>
  );
};

const Circle: FC<BoxProps> = ({ sx, ...rest }) => {
  return (
    <Box
      {...rest}
      sx={{
        ...sx,
        display: 'block',
        borderRadius: '50%',
        backgroundColor: 'rgba(150, 150, 150, 0.4)',
        overflow: 'hidden',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.11)',
        opacity: 0,
        animation: 'loading 1.5s infinite',
        '@keyframes loading': {
          '0%': { opacity: 0.5 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.5 },
        },
      }}></Box>
  );
};

Skeleton.Rectangle = Rectangle;
Skeleton.Circle = Circle;

export default Skeleton;
