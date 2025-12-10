import React, { useEffect, useState } from 'react';
import AddMemory from './AddMemory';

export default function MemoryCardPage() {
    // shows all memory cards
    // // Add a bunch of sample data's (simple CRUD application)
    // // what does a memory have?
    // // date, location, name, one thing you like about it

    const [testMemory, setTestMemory] = useState(null);
    const [testMemoryError, setTestMemoryError] = useState(null);

    return <AddMemory></AddMemory>
    
}