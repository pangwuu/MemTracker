// Source - https://stackoverflow.com/a
// Posted by ABHIJEET KHIRE, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-10, License - CC BY-SA 4.0

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UploadAndDisplayImages({images, onImageUpload, onClear}) {

  // Return the JSX for rendering
  return (<Stack spacing={2}>
            <Button 
                component="label"
                startIcon={<CloudUploadIcon />}
                height={5}
                >
                Upload images of your memory
                <input
                    type="file"
                    accept="image/*"
                    name="myImage"
                    hidden
                    onChange={(event) => {
                    onImageUpload(event.target.files[0])
                    }}
                />
            </Button>
        
          {
            (images.length !== 0) && 
            <Stack>
            
            <Typography
            variant="h5">
                Your memory images!
            </Typography>

            <ImageList 
                sx={{ 
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                overflowY: 'auto'
            }} 
            cols={3}
            gap={10}>

            {images.map((item, index) => (
                <ImageListItem key={index}>
                <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
                </ImageListItem>
            ))}
            </ImageList>          
            <Button
            color="error"
            startIcon= {<DeleteIcon/>}
            onClick={onClear}
            >Clear all images
            </Button>
                </Stack>                 
          }
      
    
    </Stack>

  );
};
