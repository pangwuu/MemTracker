import React, { useEffect, useState } from 'react';
import AddMemory from './AddMemory';

import { supabase } from '../supabaseClient'

export default function MemoryCardPage({session}) {
    // shows all memory cards

    const [testMemory, setTestMemory] = useState(null);
    const [testMemoryError, setTestMemoryError] = useState(null);
    const [loadingMemories, setLoadingMemories] = useState(false);

    // get all the data for this user.
    useEffect(() => {
        
        async function getMemories() {
            setLoadingMemories(true)

            const {user} = session
            
            const {data, error} = await supabase.from('memories')
            .select(`title, description, memory_date, location, image_urls`).eq('user_id', user.id)

            if (error) {
                alert(error)
            }

            console.log(data);

            setLoadingMemories(false)
        }

        getMemories()
    }, [])

    return <AddMemory session={session}></AddMemory>
    
}