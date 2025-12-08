import './App.css';
import ViewSwitcher from './components/ViewSwitcher';
import LoginPage from './pages/LoginPage';
import MapView from './pages/MapView';
import MemoryCardPage from './pages/MemoryCardPage'
import AccountView from './pages/AccountView.jsx';
import React, { useState, useEffect } from 'react';

import { supabase } from './supabaseClient'
import {Views} from './consts.ts'

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
    // removing login functionality for now for faster dev
    if (!session) {
      return <LoginPage />
    }
    else if (isCardView === Views.User) {
      return <div>
        <ViewSwitcher onSwitchView={handleCardView}></ViewSwitcher>
        <AccountView session={session}></AccountView>
        </div>
    }
    if (isCardView ===  Views.Map) {
      return <div>
        <ViewSwitcher onSwitchView={handleCardView}></ViewSwitcher>
        <MapView></MapView>
        </div>
    }    
    else if (isCardView ===  Views.Memory) {
      return <div>
        <ViewSwitcher onSwitchView={handleCardView}></ViewSwitcher>
        <MemoryCardPage></MemoryCardPage>
        </div>
    }
    else {
      return <div>
        Sorry! This website doesn't exist.
      </div>
    }
  }

  return renderContent();
}

export default App;
