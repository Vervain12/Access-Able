import { Modal, Box} from "@mui/material";
import { useState } from "react";

export default function SignupMessage(){

    return (
        <Modal
            open={true}
            onClose={false}
            aria-labelledby="signup-popup-message"
        >
            <Box sx={modalStyle}>
                <h2 style={headingStyle}>Email Authentication</h2>
                <p style={paragraphStyle}>Please check your email to complete the signup process.</p>
            </Box>
        </Modal>
    )
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