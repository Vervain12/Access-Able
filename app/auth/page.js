'use client'

import { signup } from "./signup"
import { signin } from "./signin";
import { useState } from "react"

export default function LoginPage (){
    // Possible placeholder for now; Signup needs the extra page with disability options

    const [toggleSignup, setToggleSignup] = useState(true);

    const handleAuthToggle = () => {
        setToggleSignup(!toggleSignup);
    }

    return (
        <div>
            <button onClick={handleAuthToggle}>{toggleSignup ? <p>Sign Up</p> : <p>Sign In</p>}</button>
            <form>
                {toggleSignup ? 
                <div>
                    <label htmlFor="username">Username:</label>
                    <input id="username" name="username" type="username" />
                </div>
                : <></>}
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                {toggleSignup ? <button formAction={signup}>Sign Up</button> : <button formAction={signin}>Sign In</button>}
                
            </form>
        </div>
    )
}