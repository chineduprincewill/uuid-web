import React from 'react'
import { Badge } from '../components/ui/badge'
import Logo from '../components/logo'
import Footer from '../components/footer'

const LeftBanner = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className="grid gap-6 px-4 py-4 lg:pl-8 pr-5">
                <Logo />
                <h1 className="font-extralight leading-tight md:text-xl">
                    <span className="text-2xl md:text-4xl lg:text-6xl gradient-title font-semibold ">UIDReg</span>
                </h1>
                <p className="text-lg md:text-xl max-w-md font-extralight">
                Managing health just got easier. We connect the dots between all your health programs. One Client. One Record. Unlimited Programs, linking every ID, so you know the whole story
                </p>
                <Badge 
                    variant="outline" 
                    className="max-w-max bg-white/10 border-white/30 px-4 py-2 text-white text-sm font-medium"
                >
                    One Source of Truth. Multiple data network.
                </Badge>
                <Footer />
            </div>
        </div>
    )
}

export default LeftBanner