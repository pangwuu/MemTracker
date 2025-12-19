/**
 * Refactored for consistency. Allows the user to click to the page to add a new memory
 */

import { Button, Paper, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router";

export default function NewMemoryButton() {

    let navigate = useNavigate();

    return <Box alignSelf={'center'}>
                <Paper variant='outlined'>
                    <Button 
                     onClick={() => navigate('/addMemory')} startIcon={<AddIcon/>} padding={2}>
                        Add a new memory!
                    </Button>
                </Paper>
            </Box>      
}        