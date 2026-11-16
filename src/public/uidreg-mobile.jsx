import React from 'react'
import { Button } from '../components/ui/button'

const UidregMobile = () => {

    const apkUrl = import.meta.env.VITE_APK_DOWNLOAD_URL;

    if (!apkUrl) {
        return <span className="text-red-500 text-sm">Download link unavailable</span>;
    }

    /**const handleDownload = async () => {
        // Safety check in case the .env variable is missing
        if (!apkUrl) {
            console.error("APK URL is not defined in .env");
            alert("Download link is currently unavailable.");
            return;
        }

        // 2. Handle Capacitor (Native Android/iOS)
        if (Capacitor.isNativePlatform()) {
            try {
                // Opens the device's native browser to handle the download
                await Browser.open({ url: apkUrl });
            } catch (error) {
                console.error('Failed to open browser', error);
                // Fallback
                window.open(apkUrl, '_system');
            }
        } else {
            // 3. Handle Web Browser
            // Creating a temporary anchor tag is the most reliable way to force a download
            const link = document.createElement('a');
            link.href = apkUrl;
            link.setAttribute('download', 'uidreg.apk'); // Suggests filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }; */

    return (
        <div className='relative w-full z-30 md:max-h-[460px] overflow-hidden bg-[url("/assets/bg123.png")] bg-cover'>
            <div className='w-full h-full py-4 md:py-8 bg-black/70'>
                <div className='w-full md:w-2/3 h-full mx-auto grid gap-2 p-4 md:p-0 md:flex md:justify-between md:items-start'>
                    <div className='w-full grid gap-0 my-auto md:mt-12'>
                        <span className='text-2xl md:text-4xl h-8 md:h-12 block text-transparent bg-clip-text bg-gradient-to-r from-brand via-accent to-accent font-bold'>Our mobile app</span>
                        <span className='text-6xl md:text-8xl font-extralight capitalize text-white mb-4'>UIDReg <br/><span>Mobile...</span></span>       
                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                        <a
                            href={apkUrl}
                            download="uidreg.apk" // This forces the browser to download instead of navigating
                            className="w-full flex items-center justify-center h-14 bg-gradient-to-br from-accent to-brand hover:from-accent/70 hover:to-brand/70 font-semibold transition disabled:opacity-70 rounded-2xl !mt-4"
                        >
                           <span>Download here</span>
                        </a>
                    </div>
                    <img src='/assets/uidregapp.png' alt='app mobile' width='350px' className='hidden md:block' />
                </div>
            </div>
        </div>
    )
}

export default UidregMobile