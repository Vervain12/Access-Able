'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Box sx={{ flexGrow: 1, gap: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              onClick={() => {router.push('/search/list')}}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              List
            </Button>
            <Button 
              onClick={() => {router.push('/search/map')}}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Map
            </Button>
            <Button 
              onClick={() => {router.push('/reviews')}}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Reviews
            </Button>
            <Button 
              onClick={() => {router.push('/profile')}}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Profile
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}