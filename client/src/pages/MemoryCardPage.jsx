/**
 * The page where users can see all their memories as a grid of cards. Fetches memories from App.jsx each time it's loaded
 */
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography, InputAdornment, CircularProgress } from '@mui/material';
import NewMemoryButton from '../components/NewMemoryLinkButton';
import GridView from '../components/GridView';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import { useState, useMemo } from 'react';

export default function MemoryCardPage({session, memories, loadingMemories}) {

    const [searchTerm, setSearchTerm] = useState('')
    const [sortMethod, setSortMethod] = useState('')
    const [ascendingSort, setAscendingSort] = useState(true)
    
    let navigate = useNavigate();

    const sortTypes = ['Name', 'Date', 'Location'];

    const handleSortTypeChange = (event) => {
        setSortMethod(event.target.value)
    }

    const handleAscendingDescendingSortChange = () => {
        setAscendingSort(!ascendingSort)
    }

    const displayedMemories = useMemo(() => {
        // calculate what we display based upon sorting method, ascending/descending method, and any searches
        let processedMemories = [...(memories || [])];

        const cleanSearch = searchTerm.trim().toLowerCase();

        // handle search term
        const matchesSearchTerm = processedMemories.filter(memory => {
            if (!memory.title || memory.title.length === 0) {
                return false
            }

            if (memory.title.trim().toLowerCase().includes(cleanSearch)) {
                return true
            }
            return false
            }
        )

        // handle asc/desc
        let matchesSortSearch;
        if (sortMethod === 'Name') {
            matchesSortSearch = matchesSearchTerm.sort((mem1, mem2) => {
                const memName1 = mem1.title.toLowerCase().trim()
                const memName2 = mem2.title.toLowerCase().trim()
                if (memName1 < memName2) {
                    return -1
                }
                else {
                    // break ties
                    return 1
                }
            })

        }
        else if (sortMethod == 'Date') {
            matchesSortSearch = matchesSearchTerm.sort((mem1, mem2) => {
                if (mem1.memory_date.localeCompare(mem2.memory_date) > 0) {
                    return 1
                }
                // break ties
                return -1
            })

        }
        else if (sortMethod == 'Location') {
            matchesSortSearch = matchesSearchTerm.sort((m1, m2) => {
                const locString1 = m1.location_plain_string.toLowerCase().trim()
                const locString2 = m2.location_plain_string.toLowerCase().trim()
                if (locString1 < locString2) {
                    return -1
                }
                else {
                    // break ties
                    return 1
                }
            })        
        }    
        else {
            matchesSortSearch = matchesSearchTerm
        }

        if (!ascendingSort) {
            return matchesSortSearch.reverse()
        }

        return matchesSortSearch


    }, [searchTerm, sortMethod, ascendingSort, memories])
    

    function sortSelect() {
        // a dropdown menu + a FAB for ascending/descending + a searchbar to select the type of sorting

        return <Stack spacing={2}>
            <Stack direction='row' spacing={2}>

                {/* must wrap in a formcontrol and use startadornment for the icon */}
                <FormControl fullWidth>
                    <InputLabel id='sort-select-label'>Sort by</InputLabel>
                    <Select 
                    labelId="sort-select-label"
                    id="sort-select"                    
                    value={sortMethod}
                    label="Sort by"
                    onChange={handleSortTypeChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <SortIcon />
                        </InputAdornment>
                    }                    
                    >
                    {/* each little item defined like this */}
                    {sortTypes.map((sortType, index) => {
                        return <MenuItem
                        key={`${sortType}${index}`}
                        value={sortType}>
                        {sortType}
                        </MenuItem>
                    })}
                    </Select>
                </FormControl>

                {/* conditionally render this with diff images*/}
                {ascendingSort && 
                <Fab onClick={handleAscendingDescendingSortChange}><ArrowDropUpIcon/></Fab>}

                {!ascendingSort && 
                <Fab onClick={handleAscendingDescendingSortChange}><ArrowDropDownIcon/></Fab>}
            </Stack>

            {/* searchbar */}
            <TextField
            id='search-term'
            value={searchTerm}
            label="Search by title"
            
            onChange={(event) => {
                setSearchTerm(event.target.value)
            }}

            slotProps={{
            input: {
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
                ),
            },
            }}   
            >            

            </TextField>

        </Stack>

    }

    return <Container maxWidth="lg"  sx={{ overflow: 'hidden' }}>
        <Stack spacing={2} paddingBottom={3}>

        <Typography variant='h4'>All your memories</Typography>

        {sortSelect()}

        {
        loadingMemories && <Box alignSelf={'center'}>
            <Stack alignSelf={'center'} alignItems={'center'}>
                <Typography variant='h5'>Loading your memories</Typography>
                <CircularProgress></CircularProgress>
            </Stack>
        </Box>
        }

        {displayedMemories.length > 0 && !loadingMemories && GridView(displayedMemories)}

        {displayedMemories.length == 0 && searchTerm.length !== 0 && sortMethod.length !== 0 && <Box alignSelf={'center'}>
            <Typography variant='h5'>No memories match your search</Typography>
        </Box>
        }        

        {displayedMemories.length == 0 && searchTerm.length == 0 && sortMethod.length == 0 && !loadingMemories && <Box alignSelf={'center'}>
            <Typography variant='h5'>No memories yet! Maybe go and add one!</Typography>
        </Box>
        }

        <NewMemoryButton/>

        </Stack>



    </Container>
    
    
}
