"use client";

import { Button, TextField, Switch } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PfpChange from "../components/pfp-change";
import ThemeToggle from "./dark-mode";
import DisabilityChoice from "../components/disability-choice";
import { useState } from "react";

export default function ProfilePage() {
  const [showDisabilityModal, setShowDisabilityModal] = useState(false);

  const handleDisabilityPopup = () => {
    setShowDisabilityModal(true);
  }

  const handleDisabilityModalClose = () => {
    setShowDisabilityModal(false);
  }

  return (
    <div className="bg-gray-200 dark:bg-[var(--background)] lg:pl-5 xl:pl-5 2xl:pl-20">
      <h1 className="font-bold text-2xl pt-10 pl-30">Profile Settings</h1>

      <div className="flex flex-row 2xl:pl-20 xl:pl-10 pt-10 gap-25">
        <div className="bg-white dark:bg-[var(--card)] border-1 border-white rounded-md w-90 h-170 p-3 flex flex-col">
          <h2 className="font-bold text-2xl pt-3 pl-3 pb-8">Profile Information</h2>
          <div className="bg-white dark:bg-[var(--card)] flex flex-col gap-10 items-center mb-5">
            {/*Profile Picture is here*/}
            <PfpChange />
          </div>
          <div>
            <p className="pb-2 ml-4">Username</p>
            <input
              type="text"
              id="user-name"
              className="h-10 w-75 mb-3 ml-4 rounded-md dark:text-white dark:bg-[var(--secondary)] dark:border-1 dark:border-white dark:text-white border-1 border-gray-300"
            />

            <p className="pb-2 ml-4">Email</p>
            <input
              type="text"
              id="email"
              className="h-10 w-75 mb-3 ml-4 rounded-md dark:text-white dark:bg-[var(--secondary)] dark:border-1 dark:border-white dark:text-white border-1 border-gray-300"
            />

            <p className="pb-2 ml-4">Phone</p>
            <input
              type="text"
              id="Phone"
              className="h-10 w-75 mb-3 ml-4 rounded-md dark:text-white dark:bg-[var(--secondary)] dark:border-1 dark:border-white dark:text-white border-1 border-gray-300"
            />

            <p className="pb-2 ml-4">Location</p>
            <input
              type="text"
              id="Location"
              className="h-10 w-75 mb-3 ml-4 rounded-md dark:text-white dark:bg-[var(--secondary)] dark:border-1 dark:border-white dark:text-white border-1 border-gray-300"
            />
          </div>

          <Button 
            variant="contained" 
            sx={{ 
              width: '280px', 
              height: '40px', 
              mt: '60px',
              ml: '28px',
              backgroundColor: '#3b82f6',
              '&:hover': {
                backgroundColor: '#2563eb'
              }
            }}
          >
            Save Changes
          </Button>
        </div>

        <div className="h-300 flex flex-col gap-10">
          <div className="bg-white w-200 h-120 rounded-md dark:bg-[var(--card)] border-white border-1">
            <h2 className="font-bold text-2xl pt-7 pl-8 pb-5">
              Account Settings
            </h2>

            <div className="flex flex-row p-5 border-b-2 border-gray-300 justify-between ml-5 mr-5">
              <div>
                <h1 className="text-lg">Disability Selection</h1>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Manage your disability needs and preferences
                </p>
              </div>

              <div className="flex items-center">
                <Button 
                  onClick={handleDisabilityPopup}
                  variant="outlined"
                  size="small"
                  sx={{ width: '160px', height: '40px' }}
                >
                  Edit Preferences
                </Button>
              </div>
            </div>

            <ThemeToggle />

            <div className="flex flex-row p-5 border-b-2 border-gray-300 justify-between ml-5 mr-5">
              <div>
                <h1 className="text-lg">Language</h1>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Choose your preferred language
                </p>
              </div>

              <div className="flex items-center">
                <Button 
                  variant="outlined"
                  size="small"
                  sx={{ width: '100px', height: '40px' }}
                >
                  English
                </Button>
              </div>
            </div>

            <div className="flex flex-row p-5 justify-between ml-5 mr-5">
              <div>
                <h1 className="text-lg">Email Notifications</h1>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Receive updates about new reviews and places
                </p>
              </div>

              <div className="flex items-center">
                <Switch />
              </div>
            </div>
          </div>

          {/* Activity Overview Section*/}
          <div className="bg-white dark:bg-[var(--card)] border-white border-1 h-55 rounded-md">
            <h2 className="font-bold text-2xl pt-7 pl-8 pb-5">Activity Overview</h2>

            <div className="flex flex-row gap-15 justify-center">
              <div className="w-50 h-25 bg-blue-200 flex flex-col justify-end items-center pb-5 rounded-md">
                <p>(# of reviews written)</p>
                <p className="text-gray-500">Reviews Written</p>
              </div>

              <div className="w-50 h-25 bg-green-200 flex flex-col justify-end items-center pb-5 rounded-md">
                <p>(# of places visited)</p>
                <p className="text-gray-500">Places Visited</p>
              </div>

              <div className="w-50 h-25 bg-purple-200 flex flex-col justify-end items-center pb-5 rounded-md">
                <p>(# of saved places)</p>
                <p className="text-gray-500">Saved Places</p>
              </div>
            </div>
          </div>

          {/* Support and Help Section */}
          <div className="bg-white dark:bg-[var(--card)] border-1 border-white h-80 flex flex-col gap-5 rounded-md">
            <h2 className="text-2xl pl-10 pt-5 font-bold">Support & Help</h2>
            <Button 
              variant="outlined"
              startIcon={<HelpOutlineIcon />}
              sx={{ 
                width: '720px', 
                height: '40px', 
                justifyContent: 'flex-start',
                textTransform: 'none',
                mx: '40px',
                mb: '20px'
              }}
            >
              Help Center
            </Button>
            <Button 
              variant="outlined"
              startIcon={<ChatBubbleOutlineIcon />}
              sx={{ 
                width: '720px', 
                height: '40px', 
                justifyContent: 'flex-start',
                textTransform: 'none',
                mx: '40px',
                mb: '20px'
              }}
            >
              Contact Support
            </Button>
            <Button 
              variant="outlined"
              startIcon={<ArticleIcon />}
              sx={{ 
                width: '720px', 
                height: '40px', 
                justifyContent: 'flex-start',
                textTransform: 'none',
                mx: '40px',
                mb: '20px'
              }}
            >
              Terms & Privacy
            </Button>
            <Button 
              variant="outlined"
              startIcon={<ReportProblemIcon />}
              sx={{ 
                width: '720px', 
                height: '40px', 
                justifyContent: 'flex-start',
                textTransform: 'none',
                mx: '40px'
              }}
            >
              Report an Issue
            </Button>
          </div>
        </div>
      </div>

      {/* DisabilityChoice Modal */}
      <DisabilityChoice 
        profileDisabilityOpen={showDisabilityModal} 
        profileDisabilityClose={handleDisabilityModalClose}
      />
    </div>
  );
}