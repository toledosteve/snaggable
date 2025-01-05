import React from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const menuItems = [
    { name: "Discover", icon: "🔥", path: "/discover" },
    { name: "Matches", icon: "❤️", path: "/matches" },
    { name: "Profile", icon: "👤", path: "/profile" },
  ];

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="flex flex-col md:flex-row h-screen">
          {/* Sidebar for Desktop */}
          <aside className="hidden md:flex flex-col w-1/4 bg-white p-6 border-r">
            {/* Profile Info */}
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="/profile-pic.jpg"
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">Steve</h2>
                <p className="text-sm text-gray-500">40</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-4">
                {menuItems.map((item) => (
                    <Link
                    key={item.name}
                    href={item.path}
                    className="flex items-center space-x-3 w-full text-left text-gray-600 hover:text-blue-500"
                    >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Upgrade Section */}
            <div className="mt-auto border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-600">Upgrade</h3>
              <p className="text-sm text-gray-500 mb-2">
                Unlock premium features for more matches!
              </p>
                <Link
                    href="/upgrade"
                    className="w-full bg-blue-500 text-white py-2 rounded-md text-center block"
                    >
                    Get Premium
                </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>

          {/* Bottom Navigation for Mobile */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-2">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.path} className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-500">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </body>
    </html>
  );
};

export default AppLayout;
