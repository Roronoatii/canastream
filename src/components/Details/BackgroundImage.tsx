import { Stack } from '@mui/material';
import React from 'react';

interface BackgroundImageProps {
  imageUrl: string;
  children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ imageUrl, children }) => {
  const styles = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    height: '75vh',
    padding: '16px',
    color: 'white',
  };

  return (
    <div style={{ position: 'relative' }}>
      <Stack sx={styles}>
        {children}
      </Stack>
    </div>
  );
}

export default BackgroundImage;
