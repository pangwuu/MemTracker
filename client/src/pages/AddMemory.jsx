import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MapEmbed from '../components/MapEmbed';

export default function AddMemory() {

    const [files, setFiles] = useState([])
    const [memTitle, setMemTitle] = useState('');
    const [memDesc, setMemDesc] = useState('');
    const [memDate, setMemDate] = useState('');

    const [value, setValue] = useState(null);

    return <Stack
    spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            label="Basic date picker"
            value={value}
            onChange={(newValue) => setValue(newValue)}
        />
        </LocalizationProvider>

        <MapEmbed position={[0, 0]}></MapEmbed>
    </Stack>
}