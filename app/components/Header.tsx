"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, Upload, LogOut, LogIn, PlusSquare, Film } from "lucide-react";
import { useNotification } from "./Notification"; 
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Use useEffect to handle client-side only operations
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    } finally {
      setLoading(false);
    }
  };

  // Only render client-specific content after mounting
  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 bg-base-100 backdrop-blur-md bg-opacity-90 border-b border-base-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="hidden md:flex bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 rounded-lg">
                  <div className="bg-base-100 p-1 rounded-md">
                    <Film className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                  </div>
                </div>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-lg md:text-xl">
                  ReelsPro
                </span>
              </Link>
            </div>
            <nav className="flex items-center gap-2 md:gap-4">
              <div className="btn btn-sm btn-ghost btn-circle"></div>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-base-100 backdrop-blur-md bg-opacity-90 border-b border-base-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="hidden md:flex bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 rounded-lg">
                <div className="bg-base-100 p-1 rounded-md">
                  <Film className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                </div>
              </div>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-lg md:text-xl">
                ReelsPro
              </span>
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className="flex items-center gap-2 md:gap-4">
            {/* Home */}
            <Link
              href="/"
              className={`btn btn-sm btn-ghost btn-circle ${pathname === '/' ? 'bg-base-200/70' : ''}`}
            >
              <Home className="w-5 h-5" />
            </Link>

            {/* Create/Upload */}
            {status === "authenticated" && (
              <Link
                href="/upload"
                className="btn btn-sm btn-ghost btn-circle"
              >
                <PlusSquare className="w-5 h-5" />
              </Link>
            )}

            {/* Profile */}
            {status === "loading" ? (
              <div className="btn btn-sm btn-ghost btn-circle loading"></div>
            ) : status === "authenticated" ? (
              <div className="dropdown dropdown-end">
                <button 
                  className="btn btn-sm btn-ghost avatar rounded-full"
                  tabIndex={0}
                >
                  <div className="w-9 h-9 rounded-full ring-2 ring-primary/30 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {session.user?.email?.[0].toUpperCase() || "U"}
                    </span>
                  </div>
                </button>
                
                <ul className="dropdown-content z-[1] mt-2 p-2 shadow-xl bg-base-100 rounded-lg w-56 border border-base-200">
                  <li className="px-4 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{session.user?.email?.split('@')[0]}</span>
                      <span className="text-xs text-base-content/70 truncate">{session.user?.email}</span>
                    </div>
                  </li>
                  <div className="divider my-1"></div>
                  
                  <li>
                    <Link
                      href="/upload"
                      className="flex items-center px-4 py-2 hover:bg-base-200 rounded-md transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-3" />
                      Create New Video
                    </Link>
                  </li>
                  
                  <li>
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-base-200 rounded-md transition-colors text-base-content"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      {loading ? "Signing out..." : "Sign Out"}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-sm btn-primary rounded-full px-4"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
      
      {/* Mobile bottom navigation bar */}
      {status === "authenticated" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 z-40 px-2 py-1">
          <div className="flex justify-around items-center">
            <Link href="/" className={`p-3 ${pathname === '/' ? 'text-primary' : 'text-base-content'}`}>
              <Home className="w-6 h-6" />
            </Link>
            
            <Link href="/upload" className="p-3">
              <PlusSquare className="w-6 h-6" />
            </Link>
            
            <Link href="/profile" className="p-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {session.user?.email?.[0].toUpperCase() || "U"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}