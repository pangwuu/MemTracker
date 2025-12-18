import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import UploadAndDisplayImages from '../components/UploadAndDisplayImages';
import LocationTextField from '../components/LocationTextField';
import styles from '../styles/AccountView.module.css'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../supabaseClient'
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { CircularProgress, LinearProgress } from '@mui/material';

export default function AddMemory({session, onMemoryAdded, mode}) {

    const [memTitle, setMemTitle] = useState('');
    const [memDesc, setMemDesc] = useState('');
    const [memDate, setMemDate] = useState(null);

    const [selectedImages, setSelectedImages] = useState([]);
    const [locationInput, setlocationInput] = useState('');
    const [returnedResults, setReturnedResults] = useState([])
    const [locationValue, setLocationValue] = useState(null);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedLat, setSelectedLat] = useState(null);
    const [selectedLong, setSelectedLong] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false)

    let navigate = useNavigate();

    // used to autofill the text field and get user to select
    useEffect(() => {

        let active = true;

        const timeoutId = setTimeout(() => {
            const fetchPlaces = async () => {
                if (locationInput.length <= 3) {
                    return;
                }

                const searchLink = `https://nominatim.openstreetmap.org/search?q=${locationInput}, Australia&format=jsonv2`
                
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
        
        return () => {
            active = false
            clearTimeout(timeoutId)
        }

    }, [locationInput])

    // used to update image links when new ones are added
    const updateImages = (newImages) => {

        if (!newImages) {
            return;
        }
        if (newImages.length == 0) {
            return;
        }

        let i;
        const uploadedImages = []

        for (i = 0; i < newImages.length; i++) {
            const newImage = newImages[i]
            const newImageURL = URL.createObjectURL(newImage);

            const newImageItem = {
                url: newImageURL,
                image: newImage
            }

            uploadedImages.push(newImageItem)

        }
        
        
        setSelectedImages((prevImages) => [...prevImages, ...uploadedImages]);


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
        format='DD/MM/YYYY'
        value={memDate}
        onChange={(newValue) => setMemDate(newValue)}
         />
        </LocalizationProvider>

    }

    
    async function uploadImages() {
        // function to upload all images in selectedImages

        setUploadingImages(true)

        // for concurrency - create an array of promises which are their own uploads
        const uploadedPromises = selectedImages.map(async (imageItem) => {
            
            const imageFile = imageItem.image

            // Generate unique filename + url so it can be identified
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            // ensure a memory-images bucket appears there
            const { data, error } = await supabase.storage
                .from('memory-images')
                .upload(filePath, imageFile, {
                    upsert: false
                });

            if (error) {
                setUploadingImages(false)
                throw error;
            }

            return filePath
        })

        // await in parallel - AFTER loop
        const results = await Promise.allSettled(uploadedPromises)
        
        const uploadedUrls = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);        

        setUploadingImages(false)
        return uploadedUrls

    }

    async function addMemory() {
        if (!memDate || !memTitle || !locationValue) {
            alert("Please add a title, date and location!");
            return;
        }        

        setUploading(true);

        const { user } = session

        const imageUrls = await uploadImages();

        const updates = {
            user_id: user.id,
            title: memTitle,
            description: memDesc,
            memory_date: memDate.format('YYYY-MM-DD'),
            location_plain_string: locationValue,
            location_lat: selectedLat,
            location_long: selectedLong,
            location: `POINT(${selectedLong} ${selectedLat})`,
            image_urls: imageUrls
        }

        const {error} = await supabase.from('memories').insert(updates)

        if (error) {
            alert(error.message)
        }
        else {

            await onMemoryAdded()


            // clear all forms
            setMemTitle('')
            setMemDesc('')
            setSelectedImages([])
            setlocationInput('')
            setReturnedResults([])
            setLocationValue(null)
            setSelectedLat(null)
            setSelectedLong(null)
            setMemDate(null)

            navigate(-1)


        }

        setUploading(false)

    }

    return <Container>

    <Stack
        spacing={2}
        paddingBottom={3}
        sx={{
            paddingTop:'2%'
        }}>

        {/* Header for button and back button*/}
        <Stack spacing={2} direction={'row'} flexWrap="wrap" useFlexGap>
            <Box alignItems={'flex-start'}>
                <Fab size="medium" onClick={() => navigate(-1)} sx={{
                    boxShadow: '1',
                    marginTop: '0.5vh'
                }}><ArrowBackIcon/></Fab>
            </Box>
            <Typography variant="h3">Add a new memory</Typography>
        </Stack>        

        {titleAndDescription()}

        {memoryDate()}

        {/* Image upload component*/}
        <UploadAndDisplayImages
            images={selectedImages}
            onImageUpload={updateImages}
            onClear={clearImages}
        />

        {/* Autocomplete field component*/}
        <LocationTextField
        locationInput={locationInput}
        setlocationInput={setlocationInput}
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
        mode={mode}
        />

        <Box className={styles.box} gap={2}>
            <Paper elevation={2} variant="outlined">
                <Button
                size='large'
                sx={{
                    paddingLeft: '2vh',
                    paddingRight: '2vh'
                }}
                onClick={() => {addMemory()}}
                startIcon={<AddIcon/>}>
                Add memory!
                </Button>
            </Paper>
            {uploading && <CircularProgress />}
        </Box>

    </Stack>

    </Container>
    
    
}