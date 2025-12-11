import * as React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import CollectionsIcon from '@mui/icons-material/Collections';
import MapIcon from '@mui/icons-material/Map';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Views} from '../consts.ts'

export default function ViewSwitcher({currentView, onSwitchView}) {

  const handleView = (event, newView) => {
    if (newView !== null) {
      onSwitchView(newView);
    }
  }

  return (
    <ToggleButtonGroup
      value={currentView}
      exclusive
      onChange={handleView}
      aria-label="page view"
      sx={{
        backgroundColor: 'background.paper', 
        borderRadius: 1
      }}
      size='small'
      color='secondary'
    >
      <ToggleButton value={Views.User} aria-label={Views.User}>
        <PersonIcon />
      </ToggleButton>
      <ToggleButton value={Views.Memory} aria-label={Views.Memory}>
        <CollectionsIcon />
      </ToggleButton>
      <ToggleButton value={Views.Map} aria-label={Views.Map}>
        <MapIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}