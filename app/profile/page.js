'use client'

import { signOut } from "../services/account-services-client"
import { Button } from "@mui/material"

export default function() {
    const reloadAfterSignout = async () => {
        await signOut();
    }

    return (
        <Button 
            variant="contained"
            style={buttonStyle}
            onClick={reloadAfterSignout}
        >Sign Out</Button>
    )
}

const buttonStyle = {
    width: '100px',
    padding: '12px 24px',
    marginTop: '8px',
    whiteSpace: 'nowrap'
};