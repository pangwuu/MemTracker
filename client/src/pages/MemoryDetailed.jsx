import { useNavigate, useParams } from "react-router-dom";
import { Typography, Container, ImageListItem, ImageList, Stack, Button, Box, Chip, Card, Paper} from "@mui/material";
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

export default function MemoryDetailed({ memories }) {

    const [imageUrls, setImageUrls] = useState([])
    const { memoryId } = useParams();

    let navigate = useNavigate();

    const memory = memories && memories.find(m => m.mem_id == memoryId);

    useEffect(() => {
        if (memory === undefined) {
            navigate('/', {replace: true})
        }
    })

    // gets us all images in parallel
    useEffect(() => {

        if (!memory || !memory.image_urls || memory.image_urls.length === 0) return;

        let active = true;

        const downloadAllImages = async () => {
            
            const downloadPromises = memory.image_urls.map(async (path) => {

                const { data, error } = await supabase.storage
                    .from('memory-images')
                    .download(path);

                if (error) {
                    console.error('Error downloading:', path, error);
                    return null;
                }
                
                return URL.createObjectURL(data);
            });

            const results = await Promise.all(downloadPromises);

            if (active) {
                const successfulImages = results.filter(url => url !== null);
                setImageUrls(successfulImages);
            }
        };

        downloadAllImages();

    }, [memory]);


    if (!memory) {
        return <Typography>Memory not found</Typography>;
    }

    return (
        <Container>
            
            <Stack padding={2} spacing={2}>

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
            {!imageUrls || imageUrls.length == 0 && <Typography variant="h4">No photos of this memory!</Typography>}

            {memory.description !== null && <>
            <Typography variant="h5">The story</Typography>
            <Typography variant="body1">{memory.description}</Typography>
            </>}
            {memory.description == null && <Typography variant="h5">No description added</Typography>}


            {memory.location_lat && memory.location_long && <MapEmbed position={[memory.location_lat, memory.location_long]}></MapEmbed>}
            
            {/* Only render this message if there is a location but it failed to render - otherwise just the first error message is enough */}
            {memory.location_plain_string && memory.location_lat == null || !memory.location_long == null && <Typography variant="h6">Failed to provide a map embed</Typography>}

            <Box alignSelf={"center"}>
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

            </Box>

            
        </Stack>
        </Container>
        

    );
}