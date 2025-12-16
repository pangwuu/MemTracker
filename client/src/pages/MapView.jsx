import Stack from "@mui/material/Stack";
import MemoryMapEmbed from "../components/MemoryMapEmbed";
import Container from "@mui/material/Container"
import NewMemoryButton from "../components/NewMemoryLinkButton";
import { Typography } from "@mui/material";


export default function MapView({memories, mode}) {
    
    // be more defensive
    const points = (memories || []).map((memory) => ({
        lat: parseFloat(memory.location_lat), 
        lon: parseFloat(memory.location_long) 
    }));

    // Filter out invalid points (where lat/lon ended up NaN or undefine or nulld)
    const validPoints = points.filter(p => !isNaN(p.lat) && !isNaN(p.lon));
    const validMemories = memories.filter(m => !isNaN(m.location_lat) && m.location_lat !== null && !isNaN(m.location_long) && m.location_long !== null)

    return <Stack padding={2} gap={2}>
        <Container  sx={{ overflow: 'hidden' }}>

        <Typography variant="h4">Your memory map!</Typography>

        <Stack padding={2} gap={2} alignItems={'center'}>

            {validPoints && validPoints.length > 0 && 
                
                <MemoryMapEmbed memories={validMemories} mode={mode}></MemoryMapEmbed>
    
            }

            {!validPoints || validPoints.length == 0 && memories && memories.length > 0 && <Typography variant="h5">Loading...</Typography>}
            {(!validPoints || validPoints.length == 0) && (!memories || memories.length == 0) && <Typography variant="h5">No memories yet!</Typography>}

            <NewMemoryButton/>

        </Stack>

    </Container>
    </Stack>
    
    
    
}