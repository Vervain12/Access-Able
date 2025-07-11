"use client";

import { signOut } from "../services/account-services-client";
import { Button, TextField } from "@mui/material";

export default function ProfilePage() {
  const reloadAfterSignout = async () => {
    await signOut();
  };

  return (
    <div className="bg-gray-200">
      <h1 className="font-bold text-2xl pt-10 pl-10">Profile Settings</h1>

      <div className="flex flex-row pl-30 pt-10 gap-25">
        <div className="bg-white rounded-md w-90 h-170 p-7 flex flex-col">
          <h2 className="pb-10">Profile Information</h2>
          <div className="bg-white flex flex-col gap-10 items-center mb-5">
            <p>Profile image circle here</p>
            <button className="w-30 h-10 bg-blue-500">Change Photo</button>
          </div>
          <div>
            <p className="pb-2">Full Name</p>
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

        <div className="h-400 flex flex-col gap-10">
          <div className="bg-red-200 w-200 h-120">
            <h2>Account Settings</h2>

            <div className="flex flex-row p-5 border-b-2 border-gray-500">
              <div>
                <h3>Accessibility Preferences</h3>
                <p>Manage your accessibility needs and preferences</p>
              </div>

              <button className="w-40 h-10 border-1 border-gray-200 ml-50">
                Edit Preferences
              </button>
            </div>
          </div>

          <div className="bg-red-200 h-50">
            <h2>Activity Overview</h2>
          </div>

          <div className="bg-red-200 h-90">
            <h2>Support and Help</h2>
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        style={buttonStyle}
        onClick={reloadAfterSignout}
      >
        Sign Out
      </Button>
    </div>
  );
}

const buttonStyle = {
  width: "100px",
  padding: "12px 24px",
  marginTop: "8px",
  whiteSpace: "nowrap",
};
