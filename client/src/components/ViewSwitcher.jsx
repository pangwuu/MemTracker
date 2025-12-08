import * as React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import CollectionsIcon from '@mui/icons-material/Collections';
import MapIcon from '@mui/icons-material/Map';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Views} from '../consts.ts'

export default function ViewSwitcher({onSwitchView}) {
  const [view, setView] = React.useState(Views.User);

  function changeView(newView) {
    onSwitchView(newView);
  }

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(event, newView) => setView(newView)}
      aria-label="page view"
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        padding: '3%', 
      }}
    >
      <ToggleButton value={Views.User} aria-label={Views.User} onClick={() => changeView(Views.User)}>
        <PersonIcon />
      </ToggleButton>
      <ToggleButton value={Views.Memory} aria-label={Views.Memory} onClick={() => changeView(Views.Memory)}>
        <CollectionsIcon />
      </ToggleButton>
      <ToggleButton value={Views.Map} aria-label={Views.Map} onClick={() => changeView(Views.Map)}>
        <MapIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}