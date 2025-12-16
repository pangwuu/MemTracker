import './App.css';
import LoginPage from './pages/LoginPage';
import MapView from './pages/MapView';
import MemoryCardPage from './pages/MemoryCardPage'
import AccountView from './pages/AccountView';
import AddMemory from './pages/AddMemory.jsx';
import React, { useState, useEffect, useCallback } from 'react';

import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate, Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import CollectionsIcon from '@mui/icons-material/Collections';
import MapIcon from '@mui/icons-material/Map';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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
import MemoryDetailed from './pages/MemoryDetailed.jsx';
import { Button } from '@mui/material';

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
        .select(`mem_id, title, description, memory_date, location, image_urls, location_plain_string, location_lat, location_long`).eq('user_id', user.id)

        if (error) {
            alert(error)
        }

        setLoadingMemories(false)
        setMemories(data);

    }, [session])

    useEffect(() => {
      getMemories()
    }, [getMemories])

  if (!session) {
        return <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LoginPage></LoginPage>}></Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>;
    }

  const appBar = () => {
    return <AppBar position='static'
        color='inherit'
        sx={{
          boxShadow: '1'
        }}>
        <Toolbar>
          <Box>
            <Button href="/" color='black' sx={{ textTransform: 'none' }}>
              <Typography variant='h5'>Our memories!</Typography>
            </Button>

          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <ToggleButtonGroup
          value={currentView}
          exclusive
          onChange={handleView}
          aria-label="page view"
          sx={{
            backgroundColor: 'background.paper', 
            borderRadius: 1
          }}
          size='small'
          color='secondary'
        >
          
          {/* TODO: The entire button isn't clickable at the moment */}
          <ToggleButton value={'account'} aria-label={Views.User}>
            <NavLink to={'account'}>
              <PersonIcon/>
            </NavLink>
            
          </ToggleButton>
          <ToggleButton value={'/'} aria-label={Views.Memory}>
            <NavLink to={'/'}>
              <CollectionsIcon />
            </NavLink>
          </ToggleButton>
          <ToggleButton value={'mapview'} aria-label={Views.Map}>
            <NavLink to={'mapview'}>
              <MapIcon />
            </NavLink>
            
          </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          </Toolbar>
        </AppBar>    
  }
  
  return <ThemeProvider
  theme={theme}>
    <CssBaseline/> 
    <BrowserRouter>
      {appBar()}
      
      {/* Define routes around here - to each page we may add! */}
      <Routes>
        <Route path='/account' element={<AccountView session={session} />}/>
        <Route path='/' element={<MemoryCardPage memories={memories} setMemories={() => {setMemories}} session={session} />}/>
        <Route path='/mapview' element={<MapView memories={memories}/>}></Route>
        <Route path='/addMemory' element={<AddMemory session={session} onMemoryAdded={getMemories}></AddMemory>}></Route>
        <Route path="/memoryDetailed/:memoryId" element={<MemoryDetailed session={session} memories={memories} onMemoryDelete={getMemories} />}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>

  </ThemeProvider>
  
}

export default App;
