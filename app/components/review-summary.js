import { GetSummary } from "../services/review-services";
import { Button, Box, Modal, CircularProgress } from "@mui/material";
import { useState } from "react";

export default function ReviewSummary({ location_id, user_id }) {
    const [openModal, setOpenModal] = useState(false);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const handleClose = () => setOpenModal(false);

    const handleSummary = async (location_id) => {
        setLoading(true);
        setOpenModal(true);
        const response = await GetSummary(location_id);
        console.log(`Summary for ${location_id}: ${response}`)
        setSummary(response);
        setLoading(false);
    }

    return (
        <div>
            <Button variant="contained" onClick={() => handleSummary(location_id)}>
                View Summary
            </Button>

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
                        <h2 className="font-bold text-xl">Review Summary</h2>
                        {loading ? (<CircularProgress />) : (<p className="whitespace-pre-line text-left w-full">{summary || "Sign in to view location summaries."}</p>)}
                    </Box>
            </Modal>
        </div>
    )
}