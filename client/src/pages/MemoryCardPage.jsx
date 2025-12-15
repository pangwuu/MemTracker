import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import MemoryCard from '../components/MemoryCard';
import { NavLink, useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import NewMemoryButton from '../components/NewMemoryLinkButton';

export default function MemoryCardPage({session, memories}) {
    // shows all memory cards

    let navigate = useNavigate();

    return <Container maxWidth="lg"  sx={{ overflow: 'hidden' }}>
        <Stack padding={2} spacing={2}>

        {memories.length > 0 &&
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(400px, 100%), 1fr))',
            gap: '10px'
        }}>
            {memories.map((memory, index) =>
            <NavLink to={`/memoryDetailed/${memory.mem_id}`} style={{ textDecoration: 'none' }} key={index}>
                <MemoryCard key={index} memory={memory}/>
            </NavLink>
            )}
        </div>

        }

        {memories.length == 0 && 
        <Box alignSelf={'center'}>
            <Typography variant='h5'>No memories yet! Maybe go and add one!</Typography>
        </Box>
        }

        <NewMemoryButton></NewMemoryButton>

        </Stack>



    </Container>
    
    
}