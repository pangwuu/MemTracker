import Stack from "@mui/material/Stack";
import MapEmbed from "../components/MapEmbed";
import Container from "@mui/material/Container"
import NewMemoryButton from "../components/NewMemoryLinkButton";
import { Typography } from "@mui/material";


export default function MapView({memories}) {
    
    // be more defensive
    const points = (memories || []).map((memory) => ({
        lat: parseFloat(memory.location_lat), 
        lon: parseFloat(memory.location_long) 
    }));

    // Filter out invalid points (where lat/lon ended up NaN or undefined)
    const validPoints = points.filter(p => !isNaN(p.lat) && !isNaN(p.lon));

    return <Container maxWidth="lg"  sx={{ overflow: 'hidden' }}>
        <Stack padding={2} gap={2} alignItems={'center'}>
            {validPoints && validPoints.length > 0 && <MapEmbed positions={validPoints} memories={memories}/>}

            {!validPoints || validPoints.length == 0 && memories && memories.length > 0 && <Typography variant="h5">Loading...</Typography>}
            {(!validPoints || validPoints.length == 0) && (!memories || memories.length == 0) && <Typography variant="h5">No memories yet!</Typography>}

            <NewMemoryButton/>

        </Stack>

    </Container>
    
    
}