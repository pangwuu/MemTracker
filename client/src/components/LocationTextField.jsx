/**
 * A textfield that takes in a user's searched location and autofills it with the openstreetmap API
 */
    
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MapEmbed from './MapEmbed';
import { Alert } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

export default function LocationTextField({locationInput, setlocationInput, returnedResults, setReturnedResults, locationValue, setLocationValue, autocompleteLoading, setAutocompleteLoading, error, setError, selectedLat, setSelectedLat, selectedLong, setSelectedLong, mode}) {

    return <Stack spacing={2}>
            {/* for loading state - indeterminate linear bar */}
            {autocompleteLoading &&
            <Stack spacing={1}>
                <Typography variant='body1' sx={{alignSelf:'center'}}>Waiting for autocomplete search results</Typography>
                <LinearProgress></LinearProgress>
            </Stack>}

            {/* use the autocomplete mui component */}
            <Autocomplete
                inputValue={locationInput}
                value={locationValue ? { display_name: locationValue } : null} 
                filterOptions={(x) => x} // to prevent some filtering? idk
                options={returnedResults}
                renderInput={(params) => <TextField {...params} label="Memory location" />}
                onInputChange={(e, newInputValue) => {
                    setlocationInput(newInputValue)
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
            />

            {/* display the location on a map if it exists */}
            {locationValue !== null && 
            <MapEmbed positions={[
                {lat: selectedLat, 
                lon: selectedLong}
            ]}
            mode={mode}></MapEmbed>}    

            {/* Error Handling */}
            {error && (
                <Alert severity="error" onClose={() => setError(false)}>
                    An error occurred during autocomplete or location selection
                </Alert>
            )}

        </Stack>

    
}

