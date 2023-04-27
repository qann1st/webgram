import { FC } from 'react';
import { Input } from '@mui/joy';

const Search: FC = () => {
  return (
    <Input
      variant="filled"
      placeholder="Поиск"
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
