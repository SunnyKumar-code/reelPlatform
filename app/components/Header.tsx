"use client"
import { Link } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'


function Header() {
    const {data:session}= useSession();
    const handleSignout=async()=>{
        try {
            await signOut()
        } catch (error) {
            
        }
    }
  return (
    <div>
      <button onClick={handleSignout}>SignOut</button>
    </div>
  )
}

export default Header
