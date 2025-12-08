import React, { useEffect, useState } from 'react';


export default function MemoryCardPage() {
    // shows all memory cards
    // // Add a bunch of sample data's (simple CRUD application)
    // // what does a memory have?
    // // date, location, name, one thing you like about it

    const [testMemory, setTestMemory] = useState(null);
    const [testMemoryError, setTestMemoryError] = useState(null);

    useEffect(() => {
        const url = 'http://127.0.0.1:5000/api/data'
        const fetchMemory = async () => {

            try {
                const response = await fetch(url);
                const data = await response.json();
                setTestMemory(JSON.stringify(data));
            }
            catch {
                setTestMemoryError('An error occured!');
            }

        }

        fetchMemory();
    }, [])

    function renderMemories() {
        // renders conditionally based on if it has been loaded

        if (testMemoryError === 'An error occured!') {
            return <text>{testMemoryError}</text>
        }
        else {
            return <text>{testMemory}</text>
        }

    }

    return renderMemories();
    
}