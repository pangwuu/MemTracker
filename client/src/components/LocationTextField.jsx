/**
 * A textfield that takes in a user's searched location and autofills it with the openstreetmap API
 */
    
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import MapEmbed from './MapEmbed';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';


export default function LocationTextField({locations, onLocationUpdate, onClear}) {

    const [userInput, setUserInput] = useState('');
    const [returnedResults, setReturnedResults] = useState([])
    const [locationValue, setLocationValue] = useState(null);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    const [fetchCoordsLoading, setfetchCoordsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [selectedLat, setSelectedLat] = useState(null);
    const [selectedLong, setSelectedLong] = useState(null);

    function processReturned(jsonOutput) {
        // save top 5
        setReturnedResults(jsonOutput.slice(0, 5));
    }

    // used to autofill the text field and get user to select
    useEffect(() => {

        const timeoutId = setTimeout(() => {
            const fetchPlaces = async () => {
                if (userInput.length <= 3) {
                    return;
                }
                console.log('here!')
                const searchLink = `https://nominatim.openstreetmap.org/search?q=${userInput}, Australia&format=jsonv2`
                
                var result = []

                try {
                    setAutocompleteLoading(true);
                    const response = await fetch(searchLink, {
                        headers: {
                            'User-Agent': 'MemoryWebsite'
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`autocomplete error! status ${response.status}`)
                    }
                    
                    result = await response.json()
                } catch (error) {
                    setError(error);
                } finally {
                    processReturned(result);
                    setAutocompleteLoading(false);
                }
            }

            fetchPlaces();

        }, 200)
        
        return () => clearTimeout(timeoutId)

    }, [userInput])

    function autoCompleteBox() {
        return
    }

    function displayBar() {
        if (autocompleteLoading) {
              return  <Autocomplete
                options={returnedResults}
                renderInput={(params) => <TextField {...params} label="Select the location" />}
                onInputChange={(e, newInputValue) => {
                    setUserInput(newInputValue)
                }}
                getOptionLabel={(option) => option.display_name || ''}
                onChange={
                    (e, newLocationValue) => {
                        if (newLocationValue) {
                            setLocationValue(newLocationValue.display_name)
                            setSelectedLat(newLocationValue.lat)
                            setSelectedLong(newLocationValue.lon)
                        }
                    }      
                }>
                
                <Box sx={{ flexGrow: 1 }} />
                <CircularProgress></CircularProgress>            
                
            </Autocomplete> 
        }
        return <Autocomplete
                options={returnedResults}
                renderInput={(params) => <TextField {...params} label="Select the location" />}
                onInputChange={(e, newInputValue) => {
                    setUserInput(newInputValue)
                }}
                getOptionLabel={(option) => option.display_name || ''}
                onChange={
                    (e, newLocationValue) => {
                        if (newLocationValue) {
                            setLocationValue(newLocationValue.display_name)
                            setSelectedLat(newLocationValue.lat)
                            setSelectedLong(newLocationValue.lon)
                        }
                    }      
                }>
                
            </Autocomplete> 
   
    }

    return <Stack spacing={2}>
            {autocompleteLoading &&
            <Stack spacing={1}>
                <Typography variant='body1' sx={{alignSelf:'center'}}>Waiting for autocomplete search results</Typography>
                <LinearProgress></LinearProgress>
            </Stack>}

            <Autocomplete
                options={returnedResults}
                renderInput={(params) => <TextField {...params} label="Select the location" />}
                onInputChange={(e, newInputValue) => {
                    setUserInput(newInputValue)
                }}
                getOptionLabel={(option) => option.display_name || ''}
                onChange={
                    (e, newLocationValue) => {
                        if (newLocationValue) {
                            setLocationValue(newLocationValue.display_name)
                            setSelectedLat(newLocationValue.lat)
                            setSelectedLong(newLocationValue.lon)
                        }
                    }      
                }
                loading={autocompleteLoading}
                >
                
            </Autocomplete> 

        
            {locationValue !== null && 
            <MapEmbed position={[selectedLat, selectedLong]}></MapEmbed>
            }    
        </Stack>

    
}

