import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import styles from '../styles/AccountView.module.css'
import Paper from '@mui/material/Paper'

import UpdateIcon from '@mui/icons-material/Update';
import LogoutIcon from '@mui/icons-material/Logout';

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

            // this GETS some data
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

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            alert(error.message)
        }
    }

    function currentBio() {
        // Component that displays the bio of the user conditionally

        var text = null
        if (loading) {
            text = <Stack spacing={2} paddingTop={3}>
                <Typography variant='h4'>Your account</Typography>
                <Typography variant='body1'>Logged in as: {email}</Typography>
                <Typography variant='h5'>Loading your bio... please wait</Typography>
            </Stack>
        }
        else if (bio === '') {
            text = <Stack spacing={2} paddingTop={3}>
                <Typography variant='h4'>Your account</Typography>
                <Typography variant='body1'>Logged in as: {email}</Typography>
                <Typography variant='h5'>You haven't set up a bio yet! Maybe go and create one!</Typography>
            </Stack>
            
        }
        else {
            text = <Stack spacing={2} paddingTop={3}>
            <Typography variant='h4'>Your account</Typography>
                <Typography variant='body1'>Logged in as: {email}</Typography>
                <Typography variant='h5'>Your bio:</Typography>
                <Typography variant='body1'>{bio}</Typography>
            </Stack>
        }

        return text

    }

    function updateBioComps() {
        return <Stack spacing={2}>
        <TextField
        label="New bio"
        multiline
        minRows={4}
        maxRows={6}
        value={tempBio}
        onChange={(e) => {setTempBio(e.target.value)}}
        />
        <Box className={styles.box}>
            <Paper elevation={2} variant='outlined'>

                <Button
                onClick={() => {updateProfile(tempBio)
                    setBio(tempBio);
                }}
                sx={{
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.02)',
                    },
                    paddingLeft: '2vh',
                    paddingRight: '2vh'
                }}
                startIcon={<UpdateIcon></UpdateIcon>}
                disabled={loading}>
                    Confirm and update
                </Button> 
            </Paper>

        </Box>
                
    </Stack>

    }

    return <Stack spacing={2}>
        {currentBio()}
        {updateBioComps()}
        <Box className={styles.box}>
            <Paper elevation={2} variant="outlined">
                <Button
                sx={{
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
                paddingLeft: '2vh',
                paddingRight: '2vh'
                }}
                color='error'
                onClick={() => {
                    signOut();
                }}
                startIcon={<LogoutIcon></LogoutIcon>}>
                    Logout
                </Button>
            </Paper>
        </Box>


        
        </Stack>
    
    

}