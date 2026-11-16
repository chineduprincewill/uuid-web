import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/badge';
import LeftBanner from './left-banner';
import { BaggageClaim, Eye, EyeOff, LucideSettings, Settings2Icon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import SubmitRequestDialog from './manage-requests/submit-request-dialog';
import UidregMobile from './uidreg-mobile';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, isAuthenticated } = useAuth();
    const downloadRef = useRef(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    //const [loginError, setLoginError] = useState("");
    const [error, setError] = useState("");
    const [eyeopen, setEyeopen] = useState(false);

     // 2. Create a function to handle the scroll
     const scrollToSection = () => {
        // Optional: Check if the ref exists before scrolling
        if (downloadRef.current) {
            downloadRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' // Aligns the top of the element with the top of the viewport
            });
        }
    };

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        
        if (!password.trim()) {
            setError("Password is required");
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //setLoginError("");
        setError("");
        
        if (!validateForm()) {
            return;
        }

        try {
            await login(email, password);
            navigate("/dashboard");
            window.location.reload()
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : "Invalid email or password. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen grid aurora">
            <div className="w-full z-30 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left Banner */}
                <LeftBanner gotoDownoad={scrollToSection} />

                {/* Right Form */}
                <div className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
                    <div className="w-full max-w-lg">
                        <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Sign In</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your account</p>
                        </div>
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                        )}
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email input */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-2xl"
                                    required
                                />     
                            </div>

                            {/* Password input */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                                </Label>
                                <div className='w-full flex items-center gap-0'>
                                    <Input
                                        id="password"
                                        type={eyeopen ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-l-2xl rounded-r-none"
                                        required
                                    />
                                    <div className='flex items-center bg-input h-14 pr-2 rounded-r-2xl'>
                                    {
                                        eyeopen ? 
                                            <Eye 
                                                className='cursor-pointer'
                                                onClick={() => setEyeopen(false)}
                                            /> :
                                            <EyeOff
                                                className='cursor-pointer'
                                                onClick={() => setEyeopen(true)}
                                            />  
                                    }
                                    </div>
                                </div>
                            </div>

                            {/* Remember me & forgot password */}
                            <div className="hidden items-center justify-between">
                                <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked)}
                                    className="border-border"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-normal text-muted-foreground cursor-pointer"
                                >
                                    Remember me
                                </Label>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition">
                                Forgot password?
                                </a>
                            </div>

                            {/* Sign in button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-gradient-to-br from-accent to-brand hover:from-accent/70 hover:to-brand/70 font-semibold transition disabled:opacity-70 rounded-2xl"
                            >
                                {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                                ) : (
                                "Sign in"
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="hidden items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-xs font-medium text-muted-foreground">OR</span>
                        <div className="flex-1 h-px bg-border"></div>
                        </div>

                        {/* Sign up link */}
                        <p className="hidden my-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition">
                            Sign up
                        </Link>
                        </p>

                        {/* Footer text */}
                        <p className="text-center text-xs text-muted-foreground mt-6">
                        By signing in, you agree to our{" "}
                        <a href="#" className="hover:text-foreground transition">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="hover:text-foreground transition">
                            Privacy Policy
                        </a>
                        </p>
                    </div>
                </div>
            </div>
            <div ref={downloadRef}>
                <UidregMobile />
            </div>
            <div className='w-full hidden md:block fixed top-0 h-screen m-0 bg-[url("/assets/bg.png")] bg-contain opacity-10 dark:opacity-10'></div>
        </div>
    );
}

export default Login