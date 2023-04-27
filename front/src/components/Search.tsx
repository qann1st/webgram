import { FC, useRef } from 'react';
import { Input } from '@mui/joy';

const Search: FC = () => {
  const searchRef = useRef(null);

  return (
    <Input
      placeholder="Поиск"
      ref={searchRef}
      sx={{
        fontSize: '14px',
        fontWeight: '900',
        margin: '10px',
        backgroundColor: '#F1F1F1',
        borderRadius: '5px',
      }}
    />
  );
};

export default Search;
