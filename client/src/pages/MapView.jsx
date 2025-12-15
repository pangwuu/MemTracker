import Stack from "@mui/material/Stack";
import MapEmbed from "../components/MapEmbed";
import Container from "@mui/material/Container"
import NewMemoryButton from "../components/NewMemoryLinkButton";

export default function MapView({memories}) {

    return <Container maxWidth="lg"  sx={{ overflow: 'hidden' }}>
        <Stack padding={2} gap={2}>
            <MapEmbed position={
                {
                    lat: 50,
                    lon: 50
                }} memories={memories}>
                    
            </MapEmbed>
            <NewMemoryButton></NewMemoryButton>

        </Stack>

    </Container>
    
    
}