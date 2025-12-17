// Source - https://stackoverflow.com/a
// Posted by ABHIJEET KHIRE, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-10, License - CC BY-SA 4.0

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UploadAndDisplayImages({images, onImageUpload, onClear}) {

  return (<Stack spacing={2}>

    {/*image upload button */}

    <Box alignSelf={'center'}>
        <Card variant='outlined'>
            <Button 
                component="label"
                startIcon={<CloudUploadIcon />}
                height={5}
                sx={{
                    paddingLeft: '2vh',
                    paddingRight: '2vh'
                }}
                >
                Upload images of your memory
                <input
                    type="file"
                    accept="image/*" 
                    name="media-files[]"
                    id="media-upload" 
                    hidden
                    multiple
                    onChange={(event) => {
                        onImageUpload(event.target.files)
                    }}
                />
            </Button>
        </Card>
    </Box>

    {/*display in a MUI imagelist if there are images*/}
          {
            (images.length !== 0) && 
            <Stack>
            
            <Box alignSelf={'center'}>
                <Typography variant="h5">
                    Your memory images!
                </Typography>
            </Box>

            <ImageList 
                sx={{ 
                width: '100%',
                height: 'auto',
                maxHeight: 'auto',
                overflowY: 'auto',
                padding: '2vh'
            }} 
            cols={3}
            gap={20}
            >

            {images.map((item, index) => (
                <Card 
                key={index}
                elevation={5}
                sx={{
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
                }}
                >
                    <ImageListItem key={index} >
                    <img
                        src={item.url}
                        alt={item.name}
                        loading="lazy"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    </ImageListItem>
                </Card>

            ))}
            </ImageList> 

            {/*button to clear images*/}

            <Box alignSelf={'center'}>
                <Card variant='outlined'>
                    <Button
                    color="error"
                    startIcon= {<DeleteIcon/>}
                    onClick={onClear}
                    sx={{
                    paddingLeft: '2vh',
                    paddingRight: '2vh'
                    }}
                    >Clear all images
                    </Button>
                </Card>
            </Box>         

                </Stack>                 
          }
      
    
    </Stack>

  );
};
