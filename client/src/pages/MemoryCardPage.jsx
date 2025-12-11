import React, { useEffect, useState } from 'react';
import AddMemory from './AddMemory';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import { supabase } from '../supabaseClient'
import MemoryCard from '../components/MemoryCard';

export default function MemoryCardPage({memories, setMemories, session}) {
    // shows all memory cards

    return <Stack spacing={2}>

        <Grid container spacing={3} paddingTop={3} columns={3} columnSpacing={2}>
            {memories.map(memory => <MemoryCard isLoading={false} memory={memory} session={session}></MemoryCard>)}
        </Grid>

        <AddMemory session={session}></AddMemory>

    </Stack>

    

    
}