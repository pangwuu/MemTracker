import Stack from "@mui/material/Stack";
import MapEmbed from "../components/MapEmbed";
import Container from "@mui/material/Container"


export default function MapView() {
    return <Container maxWidth="lg"  sx={{ overflow: 'hidden' }}>
        <Stack padding={2}>
            <MapEmbed position={[50, 100]}></MapEmbed>
        </Stack>

    </Container>
    
    
}