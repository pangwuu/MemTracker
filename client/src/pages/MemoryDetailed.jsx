import { useParams } from "react-router-dom";
import { Typography, Container, ImageListItem } from "@mui/material";
import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient'

export default function MemoryDetailed({ memories }) {

    const [imageUrls, setImageUrls] = useState([])
    const { memoryId } = useParams();

    const memory = memories && memories.find(m => m.mem_id == memoryId);

    // image handling
    const imagePaths = (memory && memory.image_urls && memory.image_urls.length > 0)
        ? memory.image_urls
        : null;

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

    console.log(memory.mem_id)
    console.log(memory.title)
    console.log(memory.description)
    console.log(memory.memory_date)
    console.log(memory.location)
    let i;
    for (i = 0; i < memory.image_urls.length; i++) {
        console.log(memory.image_urls[i])
    }
    console.log(memory.location_plain_string)

    if (!memory) {
        return <Typography>Memory not found</Typography>;
    }

    return (
        <Container>

            <Typography variant="h4">{memory.title}</Typography>
            {imageUrls.map((imageUrl, index) => {
                return <ImageListItem key={index}>
                    <img
                        src={imageUrl}
                        loading="lazy"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                </ImageListItem>
            })}
            
            
        </Container>
    );
}