import React from 'react'

const Logo = ({ size }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={size ? size : "80"} height={size ? size : "80"}>
            <circle cx="40" cy="30" r="18" fill="none" stroke="#3498db" strokeWidth="4"/>
            <circle cx="25" cy="55" r="18" fill="none" stroke="#2ecc71" strokeWidth="4"/>
            <circle cx="55" cy="55" r="18" fill="none" stroke="#e74c3c" strokeWidth="4"/>
            
            <circle cx="40" cy="50" r="6" fill="#ffffff"/>
        </svg>
    )
}

export default Logo