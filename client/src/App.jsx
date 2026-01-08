import './App.css';
import { useState, useEffect, useCallback, useMemo, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate, Link } from "react-router-dom";

// MUI Imports
import { createTheme, ThemeProvider, CssBaseline, Toolbar, AppBar, Stack, Box, Typography, Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PersonIcon from '@mui/icons-material/Person';
import CollectionsIcon from '@mui/icons-material/Collections';
import MapIcon from '@mui/icons-material/Map';

// Project Imports
import { supabase } from './supabaseClient';
import { Views } from './consts.ts';
import LoginPage from './pages/LoginPage';
import MapView from './pages/MapView';
import MemoryCardPage from './pages/MemoryCardPage';
import AccountView from './pages/AccountView';
import AddMemory from './pages/AddMemory.jsx';
import MemoryDetailed from './pages/MemoryDetailed.jsx';

const customFont = "'Roboto', sans-serif";
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  }), []);

  const theme = useMemo(() => createTheme({
    palette: { mode },
    typography: { fontFamily: customFont },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Only ONE BrowserRouter at the very top */}
        <BrowserRouter>
          <AppContent mode={mode} theme={theme} />
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function AppContent({ mode, theme }) {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(Views.User);
  const [session, setSession] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const getMemories = useCallback(async () => {
    if (!session) return;
    setLoadingMemories(true);
    const { data, error } = await supabase
      .from('memories')
      .select(`mem_id, title, description, memory_date, location, image_urls, location_plain_string, location_lat, location_long, created_at`)
      .eq('user_id', session.user.id);

    if (error) {
      console.error(error);
    } else {
      setMemories(data);
    }
    setLoadingMemories(false);
  }, [session]);

  useEffect(() => {
    getMemories();
  }, [getMemories]);

  // Redirect to Login if no session
  if (!session) {
    return (
      <Routes>
        <Route path='*' element={<LoginPage />} />
      </Routes>
    );
  }

  const handleRandomMemory = () => {
    if (memories.length === 0) return;
    const randomIndex = Math.floor(Math.random() * memories.length);
    navigate(`/memoryDetailed/${memories[randomIndex].mem_id}`);
  };

  return (
    <>
      <AppBar position='static' color='inherit' sx={{ boxShadow: 1 }}>
        <Toolbar>
          <Box>
            {/* Use component={Link} to prevent page refreshes */}
            <Button component={Link} to="/" color='inherit' sx={{ textTransform: 'none' }}>
              <Typography variant='h5' sx={{ color: 'text.primary' }}>MemTracker</Typography>
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack spacing={2} direction='row' alignItems="center">
            <ToggleButtonGroup
              value={currentView}
              exclusive
              onChange={(e, val) => val && setCurrentView(val)}
              size='small'
            >
              <ToggleButton value='account' component={NavLink} to="/account">
                <PersonIcon />
              </ToggleButton>
              <ToggleButton value='home' component={NavLink} to="/">
                <CollectionsIcon />
              </ToggleButton>
              <ToggleButton value='mapview' component={NavLink} to="/mapview">
                <MapIcon />
              </ToggleButton>
              {/* Random is a button action, not a NavLink destination */}
              <ToggleButton value='random' onClick={handleRandomMemory}>
                <QuestionMarkIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <IconButton onClick={() => theme.palette.mode === 'light' ? setMode('dark') : setMode('light')} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path='/account' element={<AccountView session={session} mode={mode} />} />
        <Route path='/' element={<MemoryCardPage memories={memories} setMemories={setMemories} session={session} loadingMemories={loadingMemories} />} />
        <Route path='/mapview' element={<MapView memories={memories} mode={mode} />} />
        <Route path='/addMemory' element={<AddMemory session={session} onMemoryAdded={getMemories} mode={mode} />} />
        <Route path='/editMemory/:memoryId' element={<AddMemory session={session} onMemoryAdded={getMemories} mode={mode} />} />
        <Route path="/memoryDetailed/:memoryId" element={<MemoryDetailed session={session} memories={memories} onMemoryDelete={getMemories} mode={mode} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}