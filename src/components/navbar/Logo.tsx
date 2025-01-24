import React from 'react'
import { SlGraph } from "react-icons/sl";

const Logo = () => {
  return (
    <div  className='flex items-center gap-x-2 border p-2'>
        <SlGraph className='text-3xl' />
        <h1 className='hidden md:block text-3xl w-48'>Sports Picker</h1>
        <h1 className='block md:hidden text-3xl'>SP</h1>
    </div>
  )
}

export default Logo