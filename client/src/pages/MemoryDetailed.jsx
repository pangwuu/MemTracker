import { useNavigate, useParams } from "react-router-dom";
import { Typography, Container, ImageListItem, ImageList, Stack, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient'
import getCleanDate from "../helpers/getCleanDate";
import MapEmbed from "../components/MapEmbed";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

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

            <Typography variant="h3">{memory.title}</Typography>

            {imageUrls && imageUrls.length >= 1 && 
            <>
                <Typography variant="h4">{`Pictures of ${memory.title}`}</Typography>
                <ImageList cols={2} gap={3} sx={{
                    overflow: 'hidden'
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
                <Typography variant="h5">Description</Typography>
                <Typography variant="body1">{memory.description}</Typography>
            </>}
            {memory.description == null && <Typography variant="h5">No description added</Typography>}

            
            {memory.memory_date !== null && 
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Typography variant="h5">Date</Typography>
                <Typography variant="body1">{getCleanDate(memory.memory_date)}</Typography>
                <DateCalendar defaultValue={dayjs(memory.memory_date)} readOnly/>
            </LocalizationProvider>
            }
            {memory.memory_date == null && <Typography variant="h5">No date provided</Typography>}

            <Typography variant="h5">Location</Typography>
            {memory.location_plain_string !== null && <Typography variant="h6">{memory.location_plain_string}</Typography>}
            {memory.location_plain_string == null && <Typography variant="h6">No location provided</Typography>}
            
            {memory.location_lat && memory.location_long && <MapEmbed position={[memory.location_lat, memory.location_long]}></MapEmbed>}
            
            {/* Only render this message if there is a location but it failed to render - otherwise just the first error message is enough */}
            {memory.location_plain_string && memory.location_lat == null || !memory.location_long == null && <Typography variant="h6">Failed to provide a map embed</Typography>}

            <Box alignSelf={"center"}>
                <Button href="/">
                    <Typography variant="body1">
                        Back to all memories
                    </Typography>
                </Button>
            </Box>

            
        </Stack>
        </Container>
        

    );
}