'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChefHat, User, LogOut, Settings, Home } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  console.log('Navbar session:', session); // Debug log

  return (
    <nav className="border-b bg-background sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Ghar Ka Khana</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/meals"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Meals
            </Link>
            <Link
              href="/chefs"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Our Chefs
            </Link>
            <Link
              href="/test-api"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              API Test
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
            ) : session ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center rounded-full bg-background hover:bg-muted p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Menu.Button>
                
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
                      <p className="text-xs text-primary font-medium capitalize mt-1">
                        {session.user?.role} Account
                      </p>
                    </div>

                    <div className="py-1">
                      {session.user?.role === 'student' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/student/dashboard"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <Home className="mr-3 h-4 w-4" />
                              My Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      
                      {session.user?.role === 'chef' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/chef/dashboard"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <ChefHat className="mr-3 h-4 w-4" />
                              Chef Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      
                      {session.user?.role === 'admin' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/admin/dashboard"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <Settings className="mr-3 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                      )}

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <User className="mr-3 h-4 w-4" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/settings"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}