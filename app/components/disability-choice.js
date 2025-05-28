// Popup for disability choice after email signup
import options from '../data/disabilityOptions.json'
import { updateDisabilityInfo } from '../services/account-services';
import { Modal, Box, Button, Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';

export default function DisabilityChoice(){
    const [checked, setChecked] = useState([]);
    const [openModalOne, setOpenModalOne] = useState(true);
    const [openModalTwo, setOpenModalTwo] = useState(false);
    const [userId, setUserId] = useState("");
    const supabase = createClient();

    const handleCloseModalOne = () => setOpenModalOne(false);

    const handleOpenModalTwo = () => { 
        setOpenModalTwo(true);
        setOpenModalOne(false);
    }
    const handleCloseModalTwo = () => setOpenModalTwo(false);

    useEffect(() => {
        async function fetchUser() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) await setUserId(user.id);
            if (error) {
                console.error('Error fetching user:', error);
            }}
        fetchUser();
    }, [supabase])

    const handleDisabilityToggle = (value) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        console.log(newChecked);
        setChecked(newChecked);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Disabilities: ", checked);
        await updateDisabilityInfo(userId, checked);        
        handleCloseModalTwo();
    }

    return (
        <div>
            {/*First Modal*/}
            <Modal
                open={openModalOne}
                onClose={handleCloseModalOne}
                aria-labelledby="disability-popup"
            >
                <Box sx={modalStyle}>
                    <h2 style={headingStyle}>Would you like to share your disabilities?</h2>
                    <p style={paragraphStyle}>This helps us provide personalized accessibility features.</p>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Button onClick={handleOpenModalTwo} variant="contained">Yes</Button>
                        <Button onClick={handleCloseModalOne} variant="contained">No</Button>
                    </Stack>
                </Box>
            </Modal>
            {/*Second Modal*/}
            <Modal
                open={openModalTwo}
                onClose={handleCloseModalTwo}
                aria-labelledby="disability-selection">
                <Box sx={modalStyle}>
                    <h2 style={headingStyle}>Select your Disabilities</h2>
                    <p style={paragraphStyle}>Choose any that apply (optional)</p>
                    
                    {/*List of selectable disabilities*/}
                    <Stack direction={"column"} spacing={2} justifyContent="center">
                        <List sx={listStyle}>
                            {options.map(item => {
                                return <ListItem key={item.value}>
                                    <ListItemButton role={undefined} onClick={() => handleDisabilityToggle(item.value)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.includes(item.value)}
                                                disableRipple
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={item.value} primary={item.label} sx={{ color: 'black' }}/>
                                    </ListItemButton>
                                </ListItem>
                            })}
                        </List>
                        <Button onClick={handleSubmit} variant="contained">Save Disabilities</Button>                        
                    </Stack>

                </Box>
            </Modal>
            
        </div>
    )
}

const listStyle = {
    width: '100%',
    maxWidth: 200,
    maxHeight: 200,
    overflow: 'auto'
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
};

const headingStyle = {
    color: 'black',
    fontSize: '1.5rem', 
    marginBottom: '16px', 
    fontWeight: '600', 
};

const paragraphStyle = {
    color: 'black',
    fontSize: '1rem', 
    lineHeight: '1.5', 
    marginBottom: '24px', 

};