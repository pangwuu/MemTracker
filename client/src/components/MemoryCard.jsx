// a small memory card to be displayed as a grid on the page
import { useState, useEffect, memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { supabase } from '../supabaseClient'
import Skeleton from '@mui/material/Skeleton';


export default function MemoryCard({isLoading, memory, session}) {
    const [imageUrl, setImageUrl] = useState(null);
    
    const imagePath = (memory && memory.image_urls && memory.image_urls.length > 0)
        ? memory.image_urls[0]
        : null;

    useEffect(() => {
        if (!imagePath) return;

        let active = true;

        const getCleanPath = (path) => {
                        
            const parts = path.split('/memory-images/');
            
            if (parts.length > 1) {
                return parts[1]; 
            }
            
            console.warn('Could not extract relative path from:', path);
            return path;
        };

        const cleanPath = getCleanPath(imagePath);

        async function downloadImage() {
            console.log('trying to get the image')
            const { data, error } = await supabase.storage
                .from('memory-images')
                .download(cleanPath)

            if (error) {
                console.error('Error loading image:', error);
            } else if (active && data) {
                console.log('got the image!')
                const imageUrl = URL.createObjectURL(data);
                setImageUrl(imageUrl);
            }
        }

        downloadImage();

        return () => {
            active = false;
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };        

    }, [imagePath]); 

    return <>
    {!isLoading && memory && <Card>
        <CardActionArea>
            <CardMedia
            component="img"
            image={imageUrl}
            >
            </CardMedia>
            <CardContent>
                <Typography variant="h5">
                {memory.title}
                </Typography>
                <Typography variant="body1">
                {memory.memory_date}
                </Typography>
                <Typography variant="body1">
                {memory.location_plain_string}
                </Typography>               
            </CardContent>
        </CardActionArea>

    </Card>}
    {isLoading || !memory && <Skeleton variant="rectangular"/>}    
    </>

}