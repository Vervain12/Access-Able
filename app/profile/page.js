"use client";

import { signOut } from "../services/account-services-client";
import { Button, TextField, Switch } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PfpChange from "../components/pfp-change";

export default function ProfilePage() {

  return (
    <div className="bg-gray-200 lg:pl-5 xl:pl-10 2xl:pl-20">
      <h1 className="font-bold text-2xl pt-10 pl-30">Profile Settings</h1>

      <div className="flex flex-row 2xl:pl-20 xl:pl-10 pt-10 gap-25">
        <div className="bg-white rounded-md w-90 h-170 p-3 flex flex-col">
          <h2 className="pb-5">Profile Information</h2>
          <div className="bg-white flex flex-col gap-10 items-center mb-5">
            {/*Profile Picture is here*/}
            <PfpChange />
          </div>
          <div>
            <p className="pb-2">Username</p>
            <TextField
              id="full-name"
              variant="outlined"
              size="small"
              className="h-15 w-75"
            />

            <p className="pb-2">Email</p>
            <TextField
              id="email"
              variant="outlined"
              size="small"
              className="h-15 w-75"
            />

            <p className="pb-2">Phone</p>
            <TextField
              id="phone"
              variant="outlined"
              size="small"
              className="h-15 w-75"
            />

            <p className="pb-2">Location</p>
            <TextField
              id="location"
              variant="outlined"
              size="small"
              className="h-5 w-75"
            />
          </div>

          <button className="bg-blue-500 w-70 h-10 rounded-md text-white flex items-center justify-center ml-3 mt-15">
            Save Changes
          </button>
        </div>

        <div className="h-300 flex flex-col gap-10">
          <div className="bg-white w-200 h-120">
            <h2 className="font-bold text-2xl pt-7 pl-8 pb-5">
              Account Settings
            </h2>

            <div className="flex flex-row p-5 border-b-2 border-gray-300 justify-between ml-5 mr-5">
              <div>
                <h1 className="text-lg">Disability Selection</h1>
                <p className="text-sm text-gray-700">
                  Manage your disability needs and preferences
                </p>
              </div>

              <div className="flex items-center">
                <button className="w-40 h-10 border-1 border-gray-200 ml-75">
                  Edit Preferences
                </button>
              </div>
            </div>

            <div className="flex flex-row p-5 border-b-2 border-gray-300 justify-between ml-5 mr-5">
              <div>
                <h1 className="text-lg">Dark Mode</h1>
                <p className="text-sm text-gray-700">
                  Toggle between light and dark themes
                </p>
              </div>

              <div className="flex items-center">
                <Switch />
              </div>
            </div>

            <div className="flex flex-row p-5 border-b-2 border-gray-300 justify-between ml-5 mr-5">
              <div>
                <h1 className="text-lg">Language</h1>
                <p className="text-sm text-gray-700">
                  Choose your preferred language
                </p>
              </div>

              <div className="flex items-center">
                <button className="w-25 h-10 border-1 border-gray-200 ml-75">
                  English
                </button>
              </div>
            </div>

            <div className="flex flex-row p-5 justify-between ml-5 mr-5">
              <div>
                <h1 className="text-lg">Email Notifications</h1>
                <p className="text-sm text-gray-700">
                  Receive updates about new reviews and places
                </p>
              </div>

              <div className="flex items-center">
                <Switch />
              </div>
            </div>
          </div>

          {/* Activity Overview Section*/}
          <div className="bg-white h-55">
            <h2 className="font-bold text-2xl p-5 pb-8">Activity Overview</h2>

            <div className="flex flex-row gap-20 justify-center">
              <div className="w-50 h-25 bg-blue-200 flex flex-col justify-end items-center pb-5">
                <p>(# of reviews written)</p>
                <p>Reviews Written</p>
              </div>

              <div className="w-50 h-25 bg-green-200 flex flex-col justify-end items-center pb-5">
                <p>(# of places visited)</p>
                <p>Places Visited</p>
              </div>

              <div className="w-50 h-25 bg-purple-200 flex flex-col justify-end items-center pb-5">
                <p>(# of saved places)</p>
                <p>Saved Places</p>
              </div>
            </div>
          </div>

          {/* Support and Help Section */}
          <div className="bg-white h-80 flex flex-col gap-5">
            <h2 className="text-2xl pl-10 pt-5 font-bold">Support & Help</h2>
            <button className="w-180 h-10 border-1 border-gray-300 mx-10 flex items-center justify-start">
              <HelpOutlineIcon style={{fontSize: "20px", marginRight: "15px", marginLeft: "15px"}} />
              Help Center
            </button>
            <button className="w-180 h-10 border-1 border-gray-300 mx-10 flex items-center justify-start">
              <ChatBubbleOutlineIcon style={{fontSize: "20px", marginRight: "15px", marginLeft: "15px"}} />
              Contact Support
            </button>
            <button className="w-180 h-10 border-1 border-gray-300 mx-10 flex items-center justify-start">
               <ArticleIcon style={{fontSize: "20px", marginRight: "15px", marginLeft: "15px"}} />
              Terms & Privacy
            </button>
            <button className="w-180 h-10 border-1 border-gray-300 mx-10 flex items-center justify-start">
              <ReportProblemIcon style={{fontSize: "20px", marginRight: "15px", marginLeft: "15px"}} />
              Report an Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

