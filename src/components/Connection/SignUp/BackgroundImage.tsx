import React from 'react';

interface BackgroundImageProps {
  imageUrl: string;
  children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ imageUrl, children }) => {
  const styles = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    height: '88vh',
  };

  return (
    <div style={styles}>
      {children}
    </div>
  );
}

export default BackgroundImage;
