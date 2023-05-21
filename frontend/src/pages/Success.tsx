import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Success = ({ text }: { text: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/sign-in');
    }, 3000);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <h3>{text}</h3>
      <h3>Перенаправление через 3 сек.</h3>
    </div>
  );
};

export default Success;
