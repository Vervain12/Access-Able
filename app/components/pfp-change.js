//Profile picture change functionality
import { createClient } from "@/utils/supabase/client";
import { Box, Modal, ImageList, ImageListItem, Button, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getProfilePicture, selectProfilePicture, fetchProfilePictureOptions } from "../services/account-services-client";

export default function PfpChange() {
    const [profilePicture, setProfilePicture] = useState("");
    const supabase = createClient();
    const [openModal, setOpen] = useState(false);
    const [pfpList, setPfpList] = useState([]);
    const handleOpen = async () => {
        setOpen(true);
        const pfps = await fetchProfilePictureOptions();
        setPfpList(pfps);
        console.log("Clientside pfp list: ", pfps)
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    useEffect(() => {
        async function fetchPfp() {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error);
            } else {
                if (user) {
                    const pfp = await getProfilePicture(user.id);
                    console.log("Pfp on page: ", pfp.data)
                    setProfilePicture(pfp.data);
                }
            }
        }
        fetchPfp();
    }, [supabase])

    const handleChangePfp = async (newPfp) => {
        const success = await selectProfilePicture(newPfp);
        if (success) {
            window.location.reload();
        }
    }
   
    return (
        <div>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '50%'
            }}>
                {profilePicture && (
                    <Button 
                        onClick={handleOpen}
                        sx={{
                            width: 112, 
                            height: 112, 
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '2px solid #d1d5db', 
                            bgcolor: '#f3f4f6', 
                            padding: 0,
                            minWidth: 'unset',
                        }}
                    >
                        <img
                            src={profilePicture}
                            alt="Profile Picture"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%'
                            }}
                            onError={(e) => {
                                console.log("Image failed to load:", e.target.src);
                            }}
                            onLoad={() => console.log("Image loaded successfully")}
                        />
                    </Button>
                )}
            </Box>
            <Modal open={openModal} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: '' }}>
                        Change Your Profile Picture
                    </Typography>
                    {!pfpList ? 
                    (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" justifyContent="center" p={2}>
                            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                                {pfpList.map((item) => (
                                    <ImageListItem key={item.pfp} >
                                        <Button 
                                            onClick={() => handleChangePfp(item.pfp)}
                                            sx={{
                                                width: 112, 
                                                height: 112, 
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '2px solid #d1d5db', 
                                                bgcolor: '#f3f4f6', 
                                                padding: 0,
                                                minWidth: 'unset',
                                            }}
                                        >
                                            <img
                                                src={item.pfp}
                                                alt={`pfp${item.pfp}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%'
                                                }}
                                                onError={(e) => {
                                                    console.log("Image failed to load:", e.target.src);
                                                }}
                                                onLoad={() => console.log("Image loaded successfully")}
                                            />
                                        </Button>
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    )}
                </Box>
            </Modal>
        </div>
    )
}