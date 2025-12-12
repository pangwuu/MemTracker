import React, { useEffect, useState } from 'react';
import AddMemory from './AddMemory';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { supabase } from '../supabaseClient'
import MemoryCard from '../components/MemoryCard';
import { NavLink } from 'react-router';

import ImageList from '@mui/material/ImageList';

export default function MemoryCardPage({session, memories}) {
    // shows all memory cards

    return <Container maxWidth="lg"  sx={{ overflow: 'hidden' }}>

        <ImageList 
        sx={{
            padding: '3vh',
            overflow: 'hidden'
        }}>
            {memories.map((memory, index) =>
            <NavLink to={`/memoryDetailed/${memory.mem_id}`}>
                <MemoryCard key={index} memory={memory}/>
            </NavLink>
            )}

        </ImageList>

    </Container>
    
    
}