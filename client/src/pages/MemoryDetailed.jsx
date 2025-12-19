/**
 * A view where user's can see all photos and other details associated with a memory. Also allows users to delete the entire memory if needed.
 */
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Container, ImageListItem, ImageList, Stack, Button, Box, Chip, Paper, CircularProgress} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Fab from '@mui/material/Fab';
import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient'
import getCleanDate from "../helpers/getCleanDate";
import MapEmbed from "../components/MapEmbed";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function MemoryDetailed({ session, memories, onMemoryDelete, mode }) {

    const [imageUrls, setImageUrls] = useState([])
    const [loadingImages, setLoadingImages] = useState(false)
    const { memoryId } = useParams();

    let navigate = useNavigate();

    const memory = memories && memories.find(m => m.mem_id == memoryId);

    async function deleteMemory() {
        // delete images first
        const {user} = session

        const memoryToDelete = memories && memories.find(m => m.mem_id == memoryId)
        const linksToDelete = memoryToDelete.image_urls
        
        // if there are images delete them
        if (linksToDelete && linksToDelete.length > 0) {
            await supabase.storage.from('memory-images').remove(linksToDelete)
        }

        // Delete the row from the memories column 
        const { error, count } = await supabase
                .from('memories')
                .delete({ count: 'exact' }) 
                .eq('mem_id', memoryId)
                .eq('user_id', user.id);

        if (error) {
            alert(`An error occured during deletion ${error}`)
        }
        else if (count === 0) {
            console.warn("Command ran, but 0 rows were deleted.");
            alert("Could not delete memory. You might not have permission, or it no longer exists.");
            navigate(-1)
        }
        else {
            // nav and force a reload
            await onMemoryDelete()
            navigate(-1)
        }
        
    }

    useEffect(() => {
        if (memory === undefined) {
            navigate('/', {replace: true})
        }
    })

    // gets us all images in parallel
    useEffect(() => {
        if (!memory?.image_urls || memory.image_urls.length === 0) {
            setImageUrls([]);
            return;
        }

        let active = true;
        setLoadingImages(true);
        
        // Keep track of URLs so we can clean them up later
        let generatedUrls = [];

        const downloadAllImages = async () => {
            try {
                const downloadPromises = memory.image_urls.map(async (path) => {
                    const { data, error } = await supabase.storage
                        .from('memory-images')
                        .download(path);

                    if (error) {
                        console.error('Error downloading:', path, error);
                        return null;
                    }
                    
                    const url = URL.createObjectURL(data);
                    generatedUrls.push(url); // Track for cleanup
                    return url;
                });

                const results = await Promise.all(downloadPromises);

                if (active) {
                    const successfulImages = results.filter(url => url !== null);
                    setImageUrls(successfulImages);
                }
            } catch (err) {
                console.error("Failed to download images", err);
            } finally {
                // Move this INSIDE the async flow or at the end of the logic
                if (active) setLoadingImages(false);
            }
        };

        downloadAllImages();

        // CLEANUP FUNCTION
        return () => {
            active = false;
            // Revoke all created URLs to free up browser memory
            generatedUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [memory]);


    if (!memory) {
        return <Typography>Memory not found</Typography>;
    }

    return (
        <Container>
            
            <Stack spacing={2}>

            <Stack spacing={2} direction={'row'} flexWrap="wrap" useFlexGap>
                <Box alignItems={'flex-start'}>
                <Fab size="medium" onClick={() => navigate(-1)} sx={{
                    boxShadow: '1',
                    marginTop: '0.5vh'
                }}><ArrowBackIcon/></Fab>
                
            </Box>
            <Typography variant="h3">{memory.title}</Typography>
            </Stack>
            
            <Stack spacing={2} direction={'row'} flexWrap="wrap" useFlexGap>
                {memory.memory_date !== null && 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Chip icon={<CalendarTodayIcon/>} label={getCleanDate(memory.memory_date)}></Chip>
                </LocalizationProvider>
                }
                {memory.memory_date == null && <Chip label={'No date provided'}/>}

                {memory.location_plain_string !== null && <Chip label={memory.location_plain_string} icon={<LocationPinIcon></LocationPinIcon>}></Chip>}
                {memory.location_plain_string == null && <Chip label={"No location provided"}/>}
            </Stack>

            
            

            {imageUrls && imageUrls.length >= 1 && 
            <>
                <Typography variant="h4">Pictures of your moment</Typography>
                <ImageList gap={3} sx={{
                    overflow: 'hidden',
                        columnCount: {
                        xs: '1 !important',
                        sm: '2 !important',
                        md: '3 !important',
                        lg: '4 !important',
                        xl: '5 !important',
                    }
                }}>
                    {imageUrls.map((imageUrl) => {
                        return <ImageListItem key={imageUrl}
                        sx={{
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.01)',
                                boxShadow: 1
                            }
                        }}>
                            <img
                                src={imageUrl}
                                loading="lazy"
                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                
                            />
                        </ImageListItem>
                    })}
                </ImageList>            
            </>
            }
            
            {/* Conditionally load images depending on if the loading state is active AND if there are no image urls */}
            {loadingImages && (
                <Stack spacing={2} alignItems="center" direction='row'>
                    <Typography variant="h4">Loading images, please wait</Typography>
                    <CircularProgress />
                </Stack>
            )}

            {!loadingImages && imageUrls.length === 0 && (
                <Typography variant="h4">No photos of this memory!</Typography>
            )}
       

            {memory.description !== null && <>
            <Typography variant="h5">The story</Typography>
            <Typography variant="body1">{memory.description}</Typography>
            </>}
            {memory.description == null && <Typography variant="h5">No description added</Typography>}


            {memory.location_lat && memory.location_long && <MapEmbed positions={
                [
                {
                    lat: memory.location_lat,
                    lon: memory.location_long
                }
                
                ]}
                mode={mode}>
                    
                    </MapEmbed>}
            
            {/* Only render this message if there is a location but it failed to render - otherwise just the first error message is enough */}
            {memory.location_plain_string && (!memory.location_lat || !memory.location_long) == null && <Typography variant="h6">Failed to provide a map embed</Typography>}

            <Box alignSelf={"center"}>
                <Stack direction='row' spacing={3}>
                    <Paper variant="outlined">
                    <Button onClick={() => navigate(-1)}>
                        <Stack direction={'row'} spacing={1}>
                            <ArrowBackIcon/>
                            <Typography variant="body1">
                                Back to all memories
                            </Typography>
                        </Stack>

                    </Button>
                    </Paper>

                    <Paper variant="outlined">
                    <Button color="error"
                    // replace w delete function
                    onClick={() => deleteMemory()}>
                        <Stack direction={'row'} spacing={1}>
                            <DeleteIcon/>
                            <Typography variant="body1">
                                Delete this memory
                            </Typography>
                        </Stack>

                    </Button>
                    </Paper>                    
                </Stack>


            </Box>

            
        </Stack>
        </Container>
        

    );
}