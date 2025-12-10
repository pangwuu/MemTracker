import './App.css';
import ViewSwitcher from './components/ViewSwitcher';
import LoginPage from './pages/LoginPage';
import MapView from './pages/MapView';
import MemoryCardPage from './pages/MemoryCardPage'
import AccountView from './pages/AccountView';
import React, { useState, useEffect } from 'react';

import { supabase } from './supabaseClient'
import {Views} from './consts.ts'
import Container from '@mui/material/Container';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline'; // For consistent styling


// Define your custom font family
const customFont = "'Roboto', sans-serif"; // Replace 'Roboto' with your chosen font

const theme = createTheme({
  typography: {
    fontFamily: customFont,
  },
});

function App() {

  const [isCardView, setIsCardView] = useState(Views.User);
  const [session, setSession] = useState(null);
  
  function handleCardView(newView) {
    setIsCardView(newView);
  }
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])  

function renderContent() {
    if (!session) return <LoginPage />;
    
    // Switch logic only handles the SPECIFIC page content now
    switch (isCardView) {
      case Views.User:
        return <AccountView session={session} />;
      case Views.Map:
        return <MapView />;
      case Views.Memory:
        return <MemoryCardPage />;
      default:
        return <div>Sorry! This website doesn't exist.</div>;
    }
  }

  return <ThemeProvider
  theme={theme}>
<CssBaseline /> 
      
      {/* LAYOUT TIP: 
         If you want 'ViewSwitcher' and 'Container' on every page, 
         put them here once instead of repeating them 3 times!
      */}
      {session && (
        <Container>
           <ViewSwitcher onSwitchView={handleCardView} />
           {renderContent()}
        </Container>
      )}
      
      {/* If not logged in, just show login page without container/switcher */}
      {!session && <LoginPage />}
  </ThemeProvider>
  
}

export default App;
