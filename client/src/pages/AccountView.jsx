import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function AccountView({session}) {
    const [loading, setLoading] = useState(true)
    const [bio, setBio] = useState('')
    const [tempBio, setTempBio] = useState('')

    useEffect(() => {
        let ignore = false;

        async function getProfile() {
            setLoading(true);

            const {user} = session;

            const { data, error } = await supabase
                .from('profiles')
                .select(`bio`)
                .eq('id', user.id)
                .single()

            if (!ignore) {
                if (error) {
                    console.warn(error)
                } else if (data) {
                    setBio(data.bio)
                }                

            setLoading(false);

            }
        }

        getProfile()

        return () => {
            ignore = true
        }

    }, [session])

    async function updateProfile(newBio) {
        // update user profile

        setLoading(true)
        const { user } = session
        
        const updates = {
            id: user.id,
            bio: newBio,
            updated_at: new Date(),
        }

        const { error } = await supabase.from('profiles').upsert(updates)

        if (error) {
            alert(error.message)
        } else {
            setBio(newBio)
        }
        setLoading(false)
    }

    function currentBio() {
        // Component that displays the bio of the user conditionally
        if (bio === '' || loading) {
            return <h1>No bio yet! Maybe set one up!</h1>
        }
        else {
            return <Stack>
                <h1>Bio</h1>
                <p>{bio}</p>
            </Stack>
        }

    }

    function updateBioComps() {
        return <Stack>
            <TextField
                label="New bio"
                multiline
                maxRows={4}
                value={tempBio}
                onChange={(e) => {setTempBio(e.target.value)}}
            />
            <Button
                onClick={() => {updateProfile(tempBio)
                    setBio(tempBio);
                }}
                disabled={loading}>
                    Confirm and update
                </Button>
        </Stack>
    }

    return <Stack>
        {currentBio()}
        {updateBioComps()}
    </Stack>
}