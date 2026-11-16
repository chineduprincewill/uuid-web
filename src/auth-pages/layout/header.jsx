import { ChevronRight, ChevronsRight, Home } from 'lucide-react';
import React from 'react'
import { useLocation } from 'react-router-dom'

const Header = ({ user }) => {

    const location = useLocation();
    const path = location.pathname.replace('/', '').replace('-', ' ');

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-background backdrop-blur">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground mt-1">
                  {user && `Welcome back, ${user?.fullname || user?.email}`}
                </p>
              </div>
            </div>
        </header>
    )
}

export default Header