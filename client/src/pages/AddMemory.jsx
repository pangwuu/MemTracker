import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import UploadAndDisplayImages from '../components/UploadAndDisplayImages';
import LocationTextField from '../components/LocationTextField';

export default function AddMemory() {

    const [memTitle, setMemTitle] = useState('');
    const [memDesc, setMemDesc] = useState('');
    const [memDate, setMemDate] = useState(null);

    const [selectedImages, setSelectedImages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [returnedResults, setReturnedResults] = useState([])
    const [locationValue, setLocationValue] = useState(null);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedLat, setSelectedLat] = useState(null);
    const [selectedLong, setSelectedLong] = useState(null);

    // used to autofill the text field and get user to select
    useEffect(() => {

        const timeoutId = setTimeout(() => {
            const fetchPlaces = async () => {
                if (userInput.length <= 3) {
                    return;
                }
                console.log('here!')
                const searchLink = `https://nominatim.openstreetmap.org/search?q=${userInput}, Australia&format=jsonv2`
                
                var result = []

                try {
                    setAutocompleteLoading(true);
                    const response = await fetch(searchLink, {
                        headers: {
                            'User-Agent': 'MemoryWebsite'
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`autocomplete error! status ${response.status}`)
                    }
                    
                    result = await response.json()
                } catch (error) {
                    setError(error);
                } finally {
                    setReturnedResults(result.slice(0, 5))
                    setAutocompleteLoading(false)
                }
            }

            fetchPlaces();

        }, 200)
        
        return () => clearTimeout(timeoutId)

    }, [userInput])



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

        <LocationTextField
        userInput={userInput}
        setUserInput={setUserInput}
        returnedResults={returnedResults}
        setReturnedResults={setReturnedResults}
        locationValue={locationValue}
        setLocationValue={setLocationValue}
        autocompleteLoading={autocompleteLoading}
        setAutocompleteLoading={setAutocompleteLoading}
        error={error}
        setError={setError}
        selectedLat={selectedLat}
        setSelectedLat={setSelectedLat}
        selectedLong={selectedLong}
        setSelectedLong={setSelectedLong}
        />

    </Stack>
}