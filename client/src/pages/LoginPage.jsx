import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import styles from '../styles/LoginPage.module.css'
import { supabase } from '../supabaseClient';


export default function LoginPage() {
    
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleLogin = async (event) => {
        // event.preventDefault();

        setLoading(true);
        // connect and authenticate with supabase

        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            alert(error.error_description || error.message)
        }
        else {
            alert('Check your email for the login link!')
        }

        setLoading(false);

    }


    return <Box className={styles.box}>
    <Stack spacing={2} alignItems="center">
        <LockIcon className={styles.lockIcon}></LockIcon>

        <Alert severity='info'>Enter your email for a magic link to all your memories</Alert>

        <TextField
        label="Email"
        variant="outlined"
        error={false}
        value={email} onChange={e => {setEmail(e.target.value)

        }}
        />

        <Button variant="contained"
        disabled={loading}
        error="true"
        onClick={() => {handleLogin(email)}}>
        Login
        </Button>
        
    </Stack>
    </Box>

}