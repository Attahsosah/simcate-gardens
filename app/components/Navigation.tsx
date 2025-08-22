"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      // Check if user is admin by making a request to get user role
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => {
          if (data.role === 'ADMIN') {
            setIsAdmin(true);
          }
        })
        .catch(() => {
          // Silently fail if we can't get the role
        });
    }
  }, [session]);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">Hotel Booking</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                              <Link
                  href="/hotels"
                  className="border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Hotels
                </Link>
                              {session && (
                  <Link
                    href="/dashboard"
                    className="border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                              {isAdmin && (
                  <Link
                    href="/admin"
                    className="border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
            </div>
          </div>

          <div className="flex items-center">
            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                      </span>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                                     <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                     <Menu.Item>
                       {({ active }) => (
                         <Link
                           href="/dashboard"
                           className={`${
                             active ? "bg-gray-100" : ""
                           } block px-4 py-2 text-sm text-gray-700`}
                         >
                           Dashboard
                         </Link>
                       )}
                     </Menu.Item>
                     {isAdmin && (
                       <Menu.Item>
                         {({ active }) => (
                           <Link
                             href="/admin"
                             className={`${
                               active ? "bg-gray-100" : ""
                             } block px-4 py-2 text-sm text-gray-700`}
                           >
                             Admin Dashboard
                           </Link>
                         )}
                       </Menu.Item>
                     )}
                     <Menu.Item>
                       {({ active }) => (
                         <button
                           onClick={() => signOut()}
                           className={`${
                             active ? "bg-gray-100" : ""
                           } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                         >
                           Sign out
                         </button>
                       )}
                     </Menu.Item>
                   </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/api/auth/signin"
                  className="text-gray-600 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
