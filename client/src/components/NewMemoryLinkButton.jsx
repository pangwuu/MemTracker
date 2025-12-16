import { Button, Paper, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router";


export default function NewMemoryButton() {

    let navigate = useNavigate();

    return <Box alignSelf={'center'}>
                <Paper>
                    <Button 
                     onClick={() => navigate('/addMemory')} startIcon={<AddIcon/>} padding={2}>
                        Add a new memory!
                    </Button>
                </Paper>
            </Box>      
}        