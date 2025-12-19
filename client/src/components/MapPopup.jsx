/**
 * A popup on the MapView allowing users to navigate back to a certain memory while including custom icons
 */

import { Popup } from 'react-leaflet';
import { Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router';
import PushPinIcon from '@mui/icons-material/PushPin';

export default function MapPopUp(memory) {
    return <Popup>
        <Stack spacing={1} padding={1} direction='row'>
            <PushPinIcon></PushPinIcon>
            <Typography variant='body1' component={NavLink} to={`/memoryDetailed/${memory.mem_id}`}>
                {memory.title}</Typography>
        </Stack>
    </Popup>;
}
