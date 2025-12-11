import React, { useEffect, useState } from 'react';
import AddMemory from './AddMemory';
import Stack from '@mui/material/Stack';

import { supabase } from '../supabaseClient'
import MemoryCard from '../components/MemoryCard';

export default function MemoryCardPage({memories, setMemories, session}) {
    // shows all memory cards

    return <Stack spacing={2}>
        <MemoryCard isLoading={false} memory={memories[0]} session={session}></MemoryCard>

        <AddMemory session={session}></AddMemory>

    </Stack>

    

    
}