// a small memory card to be displayed as a grid on the page
import { useState, useEffect, memo } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { supabase } from '../supabaseClient'
import Skeleton from '@mui/material/Skeleton';

import getCleanDate from '../helpers/getCleanDate'

export default function MemoryCard({memory}) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false)
    const [imageExist, setImageExist] = useState(false)
    
    const imagePath = (memory && memory.image_urls && memory.image_urls.length > 0)
        ? memory.image_urls[0]
        : null;

    useEffect(() => {
        if (!imagePath) return;

        let active = true;
        setLoadingImage(true)

        // ensures the path we use to download the file is correct - there's a lot of subfolders and we need to clean it up
        const getCleanPath = (path) => {
                        
            const parts = path.split('/memory-images/');
            
            if (parts.length > 1) {
                return parts[1]; 
            }
            
            // console.warn('Could not extract relative path from:', path);
            return path;
        };

        const cleanPath = getCleanPath(imagePath);
        
        // this is how we download an image
        async function downloadImage() {
            const { data, error } = await supabase.storage
                .from('memory-images')
                .download(cleanPath)

            if (error) {
                console.error('Error loading image:', error);
            } else if (active && data) {
                const imageUrl = URL.createObjectURL(data);
                setImageUrl(imageUrl);
                setImageExist(true)
            }
        }

        downloadImage();
        setLoadingImage(false);

        return () => {
            active = false;
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };        

    }, [imagePath]); 

    function imageComponent() {
        if (imageExist) {
            return <>
            <CardMedia
            component="img"
            image={imageUrl}
            loading='lazy'
            >
            </CardMedia>
            <Divider/>
            </>
        }
        return <></>
        
    }


    return <>{!loadingImage && memory && 
        <CardActionArea>
            <Card>
            {imageComponent()}
            <CardContent>
                <Typography variant="h5"
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textWrap: 'wrap'
                }}
                >
                {memory.title}
                </Typography>
                <Typography variant="body1">
                {getCleanDate(memory.memory_date)}
                </Typography>
                <Typography variant="body1"
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                {memory.location_plain_string.split(',')[0]}
                </Typography>               
            </CardContent>
            </Card>
        </CardActionArea>

    }

    {(loadingImage || !memory) && <Skeleton variant="rectangular" />}

    </>



}