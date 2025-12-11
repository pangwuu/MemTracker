import './App.css';
import ViewSwitcher from './components/ViewSwitcher';
import LoginPage from './pages/LoginPage';
import MapView from './pages/MapView';
import MemoryCardPage from './pages/MemoryCardPage'
import AccountView from './pages/AccountView';
import React, { useState, useEffect, useCallback } from 'react';

import { supabase } from './supabaseClient'
import {Views} from './consts.ts'
import Container from '@mui/material/Container';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// Define your custom font family
const customFont = "'Roboto', sans-serif"; // Replace 'Roboto' with your chosen font

const theme = createTheme({
  typography: {
    fontFamily: customFont,
  },
});

function App() {

  // const [isCardView, setIsCardView] = useState(Views.User);
  const [currentView, setCurrentView] = useState(Views.User);
  const [session, setSession] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  
  function handleView(newView) {
    setCurrentView(newView);
  }
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
  }, [])  

    // get all the data for this user so it can be shared across all components. Wrapping it in a useCallback allows any results to be cached (i.e you dont rerun this each frame you just retrieve the cached value!)
    const getMemories = useCallback(async () => {
        if (!session) {
          return;
        }
        setLoadingMemories(true)

        const {user} = session
        
        const {data, error} = await supabase.from('memories')
        .select(`title, description, memory_date, location, image_urls, location_plain_string`).eq('user_id', user.id)

        if (error) {
            alert(error)
        }

        // console.log(data);
        // let i = 0;
        // for (i = 0; i < data.length; i++) {
        //     console.log(data[i].title)
        //     console.log(data[i].description)
        //     console.log(data[i].memory_date)
        //     console.log(data[i].location)
        //     console.log(data[i].image_urls)
        // }

        setLoadingMemories(false)
        setMemories(data);

    }, [session])

    useEffect(() => {
      getMemories()
    }, [getMemories])

    function renderContent() {
        if (!session) return <LoginPage />;
        
        // Switch logic only handles the SPECIFIC page content now
        switch (currentView) {
          case Views.User:
            return <AccountView session={session} />;
          case Views.Map:
            return <MapView />;
          case Views.Memory:
            return <MemoryCardPage memories={memories} setMemories={() => {setMemories}} session={session} />;
          default:
            return <div>Sorry! This website doesn't exist.</div>;
        }
      }

  return <ThemeProvider
  theme={theme}>
    <CssBaseline /> 
      {session && (<Stack>
        
        <AppBar position='static'
        color='inherit'
        sx={{
          boxShadow: '1'
        }}>
          <Toolbar>
            <Box>
              <Typography variant='h5'>Memory tracker</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <ViewSwitcher
              onSwitchView={handleView}
              currentView={currentView}
              />
            </Box>
          </Toolbar>
        </AppBar>       
        
 
        <Container>
          {renderContent()}
        </Container>
      </Stack>

      )}
      
      {!session && <LoginPage />}
      </ThemeProvider>
  
}

export default App;
