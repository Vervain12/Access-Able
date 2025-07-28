// Popup for disability choice after email signup
import options from '../data/disabilityOptions.json'
import { updateDisabilityInfo } from '../services/account-services-client';
import { Modal, Box, Button, Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';

export default function DisabilityChoice({ profileDisabilityOpen, profileDisabilityClose, authOpen }){
    const [checked, setChecked] = useState([]);
    const [openModalOne, setOpenModalOne] = useState(authOpen || false);
    const [openModalTwo, setOpenModalTwo] = useState(false);
    const [userId, setUserId] = useState("");
    const supabase = createClient();

    const handleCloseModalOne = () => setOpenModalOne(false);

    const handleOpenModalTwo = () => { 
        setOpenModalTwo(true);
        setOpenModalOne(false);
    }
    const handleCloseModalTwo = () => {
        setOpenModalTwo(false);
        if(profileDisabilityOpen) {
            profileDisabilityClose();
        }

    }
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
        await updateDisabilityInfo(checked);        
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
                        <Button onClick={handleCloseModalOne} variant="contained">No</Button>
                        <Button onClick={handleOpenModalTwo} variant="contained">Yes</Button>
                    </Stack>
                </Box>
            </Modal>
            {/*Second Modal*/}
            <Modal
                open={openModalTwo || profileDisabilityOpen}
                onClose={handleCloseModalTwo || profileDisabilityClose}
                aria-labelledby="disability-selection">
                <Box sx={modalStyle}>
                    <h2 style={headingStyle}>Select your Disabilities</h2>
                    <p style={paragraphStyle}>Choose any that apply</p>
                    
                    {/*List of selectable disabilities in two columns*/}
                    <Stack direction={"column"} spacing={2} justifyContent="center">
                        <List sx={listStyle}>
                            {Array.from({ length: Math.ceil(options.length / 2) }, (_, rowIndex) => (
                                <Box key={rowIndex} sx={{ display: 'flex', width: '100%' }}>
                                    {[0, 1].map(colIndex => {
                                        const itemIndex = rowIndex * 2 + colIndex;
                                        const item = options[itemIndex];
                                        if (!item) return null;
                                        
                                        return (
                                            <Box key={item.value} sx={{ width: '50%' }}>
                                                <ListItem>
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
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ))}
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
    maxWidth: 400,
    maxHeight: 400,
    overflow: 'auto'
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '50%',
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