/**
 * Page to allow users to add or edit memories. Redirects to the previous page when done.
 */
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
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../supabaseClient'
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import imageCompression from 'browser-image-compression';
import dayjs from 'dayjs';

export default function AddMemory({session, onMemoryAdded, mode, memories}) {
    const { memoryId: memoryIdParam } = useParams();
    const memoryId = memoryIdParam;

    const isEditing = !!memoryId;

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

    // Pre-fill data if editing
    useEffect(() => {
            
        if (isEditing && memories) {
            const mem = memories.find(m => m.mem_id == memoryId);
            if (mem) {
                setMemTitle(mem.title || '');
                setMemDesc(mem.description || '');
                setMemDate(mem.memory_date ? dayjs(mem.memory_date) : null);
                
                // Pre-fill location data
                if (mem.location_plain_string) {
                    setlocationInput(mem.location_plain_string);
                    setLocationValue(mem.location_plain_string);
                }
                if (mem.location_lat && mem.location_long) {
                    setSelectedLat(mem.location_lat);
                    setSelectedLong(mem.location_long);
                }

                // Pre-fill images
                if (mem.image_urls && mem.image_urls.length > 0) {
                    const fetchImages = async () => {
                        const loadedImages = await Promise.all(
                            mem.image_urls.map(async (path) => {
                                const { data, error } = await supabase.storage
                                    .from('memory-images')
                                    .download(path);
                                
                                if (error) {
                                    console.error('Error downloading image:', path, error);
                                    return null;
                                }

                                return {
                                    url: URL.createObjectURL(data),
                                    path: path,
                                    isExisting: true
                                };
                            })
                        );
                        setSelectedImages(loadedImages.filter(Boolean));
                    };
                    fetchImages();
                }
            }
        }
    }, [isEditing, memories, memoryId]);

    // used to autofill the text field and get user to select
    useEffect(() => {

        let active = true;

        const timeoutId = setTimeout(() => {
            const fetchPlaces = async () => {
                if (locationInput.length <= 3) {
                    return;
                }

                // If editing and input matches saved location, don't search immediately unless user types
                // But simplified logic: just search. Debounce handles it.

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

            // Only fetch if locationInput is different from already selected value (to avoid search on pre-fill)
            // However, for simplicity and since locationInput updates on pre-fill, we can let it run or check.
            fetchPlaces();

        }, 200)
        
        return () => {
            active = false
            clearTimeout(timeoutId)
        }

    }, [locationInput])

    // used to update image links when new ones are added
    const updateImages = (newImages) => {
        if (!newImages || newImages.length === 0) return;
        
        const filesArray = Array.from(newImages);
        
        const uploadedImages = filesArray.map(file => ({
            url: URL.createObjectURL(file),
            image: file,
            isExisting: false
        }));
        
        setSelectedImages(prev => [...prev, ...uploadedImages]);
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
        // function to upload NEW images in selectedImages

        setUploadingImages(true)
        
        const newImages = selectedImages.filter(img => !img.isExisting);

        // for concurrency - create an array of promises which are their own uploads
        const uploadedPromises = newImages.map(async (imageItem) => {
            
            // Compression options
            const options = {
                maxSizeMB: 0.8,          
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };            
            
            const imageFile = imageItem.image
            const compressedFile = await imageCompression(imageFile, options);

            // Generate unique filename + url so it can be identified
            const fileExt = compressedFile.type.split('/')[1];
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            // ensure a memory-images bucket appears there
            const { data, error } = await supabase.storage
                .from('memory-images')
                .upload(filePath, compressedFile, {
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

    async function handleSave() {
        if (!memDate || !memTitle || !locationValue) {
            alert("Please add a title, date and location!");
            return;
        }        

        setUploading(true);

        const { user } = session

        // 1. Upload new images
        const newImageUrls = await uploadImages();

        // 2. Collect existing image paths
        const existingImageUrls = selectedImages
            .filter(img => img.isExisting)
            .map(img => img.path);

        // 3. Combine
        const finalImageUrls = [...existingImageUrls, ...newImageUrls];

        const baseUpdates = {
            title: memTitle,
            description: memDesc,
            memory_date: memDate.format('YYYY-MM-DD'),
            location_plain_string: locationValue,
            location_lat: selectedLat,
            location_long: selectedLong,
            location: `POINT(${selectedLong} ${selectedLat})`,
            image_urls: finalImageUrls
        }

        let error;

        if (isEditing && memoryId) {
    
            const { data, error } = await supabase
                .from('memories')
                .update(baseUpdates)
                .eq('mem_id', memoryId)
                .select();
            
            if (error) {
                console.error('Error:', error);
            } else {
                console.log('Update result:', data);
                if (!data || data.length === 0) {
                    console.error('No rows were updated! Memory ID might not exist or RLS policy blocking update');
                    alert('Could not find memory to update. It may have been deleted.');
                    setUploading(false);
                    return;
                }
            }

        } else {
            // INSERT: Include user_id. Let database generate mem_id.
            const insertUpdates = {
                ...baseUpdates,
                user_id: user.id
            };

            const { error: insertError } = await supabase
                .from('memories')
                .insert(insertUpdates);
            
            error = insertError;
        }

        if (error) {
            console.error('Error saving memory:', error);
            alert(`Error: ${error.message}`)
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
        paddingTop={2}>

        {/* Header for button and back button*/}
        <Stack spacing={2} direction={'row'} flexWrap="wrap" useFlexGap>
            <Box alignItems={'flex-start'}>
                <Fab size="medium" onClick={() => navigate(-1)} sx={{
                    boxShadow: '1',
                    marginTop: '0.5vh'
                }}><ArrowBackIcon/></Fab>
            </Box>
            <Typography variant="h3">{isEditing ? 'Edit memory' : 'Add a new memory'}</Typography>
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
                onClick={() => {handleSave()}}
                startIcon={isEditing ? <EditIcon/> : <AddIcon/>}>
                {isEditing ? 'Update memory!' : 'Add memory!'}
                </Button>
            </Paper>
            {uploading && <CircularProgress />}
        </Box>

    </Stack>

    </Container>
    
    
}