import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import MapEmbed from '../components/MapEmbed';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Container from '@mui/material/Container';
import UploadAndDisplayImages from '../components/UploadAndDisplayImages';
import LocationTextField from '../components/LocationTextField';
// import TitleText from '../components/TitleText';

export default function AddMemory() {

    const [memTitle, setMemTitle] = useState('');
    const [memDesc, setMemDesc] = useState('');
    const [memDate, setMemDate] = useState(null);

    const [selectedImages, setSelectedImages] = useState([]);

    const updateImages = (newImage) => {

        if (!newImage) {
            return;
        }

        const newImageURL = URL.createObjectURL(newImage);

        const newImageItem = {
            url: newImageURL,
            image: newImage
        }

        const newSelectedImages = selectedImages.slice()
        newSelectedImages.push(newImageItem)
        setSelectedImages(newSelectedImages)

    }

    const clearImages = () => {
        setSelectedImages([]);
    }

    function titleAndDescription() {
        return <Stack spacing={2}>
        
        <TextField
            label="Memory title"
            value={memTitle}
            onChange={(e) => {setMemTitle(e.target.value)}}
        />
        
        <TextField
            label="Memory description"
            value={memDesc}
            onChange={(e) => {setMemDesc(e.target.value)}}
            multiline
            minRows={3}
            maxRows={6}
        />
        </Stack>

    }

    function memoryDate() {
        return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker 
        label="Memory date"
        value={memDate}
        onChange={(e) => {setMemDate(e.target.value)} }
         />
        </LocalizationProvider>

    }

    function memoryLocationSelector() {

    }

    return <Stack
    spacing={2}
    sx={{
        paddingTop:'2%'
    }}>
        
        <Typography variant='h4'>Add a new memory</Typography>

        {titleAndDescription()}

        {memoryDate()}

        <UploadAndDisplayImages
            images={selectedImages}
            onImageUpload={updateImages}
            onClear={clearImages}
        />

        <LocationTextField></LocationTextField>
        {/* <MapEmbed position={[0, 0]}></MapEmbed> */}
    </Stack>
}