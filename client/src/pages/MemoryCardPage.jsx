import React, { useEffect, useState } from 'react';
import AddMemory from './AddMemory';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { supabase } from '../supabaseClient'
import MemoryCard from '../components/MemoryCard';
import { NavLink, useNavigate } from 'react-router';

import ImageList from '@mui/material/ImageList';
import { Box, Paper, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function MemoryCardPage({session, memories}) {
    // shows all memory cards

    let navigate = useNavigate();

    return <Container maxWidth="lg"  sx={{ overflow: 'hidden' }}>
        <Stack padding={2} spacing={2}>

        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(400px, 100%), 1fr))',
            gap: '10px'
        }}>
            {memories.map((memory, index) =>
            <NavLink to={`/memoryDetailed/${memory.mem_id}`} style={{ textDecoration: 'none' }}>
                <MemoryCard key={index} memory={memory}/>
            </NavLink>
            )}

        </div>

        <Box alignSelf={'center'}>
            <Paper>
                <Button onClick={() => navigate('/addMemory')} startIcon={<AddIcon/>} padding={2}>
                    Add a new memory!
                </Button>
            </Paper>
        </Box>





             
        {/* <ImageList 
        sx={{
            padding: '3vh',
            overflow: 'hidden',
            columnCount: {
                xs: '1 !important',
                sm: '2 !important',
                md: '3 !important',
                lg: '4 !important',
                xl: '5 !important',
            }
        }}>
            {memories.map((memory, index) =>
            <NavLink to={`/memoryDetailed/${memory.mem_id}`} style={{ textDecoration: 'none' }}>
                <MemoryCard key={index} memory={memory}/>
            </NavLink>
            )}

        </ImageList> */}


        </Stack>



    </Container>
    
    
}