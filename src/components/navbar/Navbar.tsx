import React from 'react'
import Logo from './Logo'
import Links from './Links'

const Navbar = () => {
  
  return (
    <div className='p-4'>
        <div className="flex justify-between items-center">
            <Logo />
            <Links /> 
        </div>
    </div>
  )
}

export default Navbar