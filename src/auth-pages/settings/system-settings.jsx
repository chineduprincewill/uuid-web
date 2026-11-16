import React from 'react'
import CountdownComponent from '../../components/countdown-component';

const SystemSettings = () => {

    return (
        <div className={`w-full grid gap-4 p-4`}>
            <div className='w-full flex p-2 justify-between items-center bg-card rounded-lg'>
                <span className='text-xl font-extralight'>Settings</span>
            </div>
            <div className='w-full h-screen flex items-center justify-center'>
                <CountdownComponent />
            </div>
        </div>
    )
}

export default SystemSettings