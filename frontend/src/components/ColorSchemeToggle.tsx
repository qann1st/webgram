import { useColorScheme } from '@mui/joy/styles';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import { FC, useEffect, useState } from 'react';
import { LightMode } from '@mui/icons-material';
import { DarkMode } from '@mui/icons-material';

const ColorSchemeToggle: FC<IconButtonProps> = ({ onClick, sx, ...props }) => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <IconButton size="sm" variant="plain" color="neutral" {...props} sx={sx} disabled />;
  }

  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="plain"
      sx={{ position: 'absolute', right: '10px', top: '10px' }}
      color="neutral"
      {...props}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
        onClick?.(e);
      }}>
      {mode === 'light' ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
};

export default ColorSchemeToggle;
