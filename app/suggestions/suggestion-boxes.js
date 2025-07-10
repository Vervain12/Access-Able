'use client'

import { Rating, Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuggestionBox({ item }) {
    const router = useRouter();

    const handleSelect = () => {
        sessionStorage.removeItem('selectedLocation');
        sessionStorage.setItem('selectedLocation', JSON.stringify(item));
        router.push(`/location/${item.id}`);
    };

  return (
    <Box
        key={item.id}
        className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 flex flex-col justify-between"
        sx={{
            width: 500, 
            flexShrink: 0, 
            marginRight: 2,}}
    >
        <Box
            className="h-36 bg-gray-200 rounded mb-4 flex justify-center items-center"
        >
            {/* Image goes here */}
        </Box>
        <Box className="flex flex-row">
            <h4 className="font-bold mb-1">{item.tags.name}</h4>
            <Button 
                variant="outlined"
                sx={{
                        textTransform: "capitalize",
                        backgroundColor: "white",
                        color: "black",
                        borderColor: "#ccc",
                        '&:hover': {
                            backgroundColor: "#1e88e5",
                            borderColor: "gray-300",
                        },
                        fontWeight: 500,
                        ml: 'auto',
                    }}
                onClick={handleSelect}
            >More Info</Button>
        </Box>

        <Box
            className="flex flex-row">
            <Rating 
                name="rating" 
                value={item.rating || 0}
                readOnly
                size="small" 
                precision={0.5}
            />
            <p className="font-light text-sm">({item.count} review{item.count >= 2 && <>s</>})</p>
        </Box>

    </Box>
  );
}
