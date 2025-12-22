/**
 * The initial page the user sees when they open up the app. Uses a supabase magic link for authentication.
 */
import { useEffect, useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import styles from '../styles/LoginPage.module.css'
import { supabase } from '../supabaseClient';


export default function LoginPage() {
    
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false)

    // check if an email is valid. no i did not write that regex
    useEffect(() => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
        setIsValidEmail(emailRegex.test(email))
    }, [email])

    const handlePasswordLogin = async (e) => {
        e.preventDefault()
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            alert(error.error_description || error.message)
        }
        // Success is handled by the session listener in App.jsx usually
        setLoading(false);
    }

    const handleMagicLinkLogin = async () => {
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
    <Stack spacing={2} alignItems="center" sx={{ maxWidth: 400, width: '100%' }}>
        <LockIcon className={styles.lockIcon}></LockIcon>

        <Alert severity='info' sx={{textAlign: "center"}}>Log in to access your memories. If it is your first time, send a magic link for an express login and set up a password later.</Alert>

        <Box component='form' onSubmit={handlePasswordLogin} justifyContent={'center'} width="100%">
            <Stack spacing={2} alignItems='center' width="100%">
            <TextField
                label="Email"
                variant="outlined"
                error={false}
                value={email} 
                onChange={e => setEmail(e.target.value)}
                inputMode='email'
                fullWidth
            />
            
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
            />
            
            <Button variant="contained"
                disabled={loading || !isValidEmail || !password}
                type="submit"
                fullWidth
            >
                Login with Password
            </Button>

            </Stack>
        </Box>

        <Divider flexItem>
            <Typography variant="caption" color="text.secondary">
                OR
            </Typography>
        </Divider>

        <Button 
            variant="outlined"
            disabled={loading || !isValidEmail}
            onClick={handleMagicLinkLogin}
            fullWidth
        >
            Send Magic Link
        </Button>
        
    </Stack>
    </Box>

}