import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function AccountView({session}) {
    const [loading, setLoading] = useState(true)
    const [bio, setBio] = useState('')
    const [tempBio, setTempBio] = useState('')

    const email = session['user']['email'];

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
                    // setEmail(userEmail);     
                    // console.log('Users email: ' + userEmail)                     
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

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            alert(error.message)
        }
    }

    function currentBio() {
        // Component that displays the bio of the user conditionally

        if (bio === '' || loading) {
            return <Stack spacing={2}>
                <Typography variant='h1'>Your account</Typography>
                <Typography variant='body1'>Logged in as: {email}</Typography>
                <Typography variant='h2'>You haven't set up a bio yet! Maybe go and create one!</Typography>
            </Stack>
            
        }
        else {
            return <Stack spacing={2}>
                <Typography variant='h1'>Your account</Typography>
                <Typography variant='body1'>Logged in as: {email}</Typography>
                <Typography variant='h2'>Your bio:</Typography>
                <Typography variant='body1'>{bio}</Typography>
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
        <Button
        color='error'
        onClick={() => {
            signOut();
        }}>
            Logout
        </Button>
    </Stack>
}