import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface CastListProps {
    cast: CastMember[];
}

interface CastMember {
    name: string
    character: string
}

const CastList: React.FC<CastListProps> = ({ cast }) => {
  return (
    <List>
      {cast.map(member => (
        <ListItem key={member.name}>
          <ListItemText primary={member.name} secondary={member.character} />
        </ListItem>
      ))}
    </List>
  );
}

export default CastList;
export type { CastMember };
