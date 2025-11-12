import React from 'react'
import { Link } from 'react-router'
import { usePuterStore } from '~/lib/puter';
function Navbar() {
      const {isLoading,auth}=usePuterStore();
  
  return (
    <nav className='navbar'>
   <Link to='/'>
   <p className='text-2xl'>RESUMIND</p>
   </Link>
    <button onClick={auth.signOut} className='primary-button w-fit !px-10'>
Logout   
</button>
   
    </nav>
  )
}

export default Navbar