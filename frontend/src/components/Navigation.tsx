// import React, { useEffect } from "react";
// import { useAuthStore } from "../stores/authStore";
// import { Button } from "./ui/Buttons";
// import {
//   Bars3Icon,
//   XMarkIcon,
//   // SunIcon,
//   // MoonIcon,
// } from "@heroicons/react/24/outline";
// import Theme

// export default function Navigation() {
//   const { isAuthenticated, user, logout } = useAuthStore();
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   // const [theme, setTheme] = React.useState(
//   //   typeof window !== "undefined"
//   //     ? localStorage.getItem("theme") || "light"
//   //     : "light"
//   // );

//   // // Toggle dark/light mode
//   // const toggleTheme = () => {
//   //   const newTheme = theme === "light" ? "dark" : "light";
//   //   setTheme(newTheme);
//   //   if (typeof window !== "undefined") {
//   //     localStorage.setItem("theme", newTheme);
//   //     document.documentElement.classList.toggle("dark", newTheme === "dark");
//   //   }
//   // };

//   // // Set theme on component mount based on user preference or system setting
//   // useEffect(() => {
//   //   if (theme === "dark") {
//   //     document.documentElement.classList.add("dark");
//   //   } else {
//   //     document.documentElement.classList.remove("dark");
//   //   }
//   // }, [theme]);

//   const handleLogout = async () => {
//     await logout();
//     window.location.href = "/";
//   };

//   const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/programs", label: "Programs" },
//     { href: "/biography", label: "Our Story" },
//     { href: "/donate", label: "Donate" },
//   ];

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <a href="/" className="flex items-center">
//               <span className="text-xl font-bold text-red-600 dark:text-red-400">
//                 Lewis Paul Foundation
//               </span>
//             </a>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex md:items-center md:space-x-8">
//             <div className="flex space-x-8">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.href}
//                   href={link.href}
//                   className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 text-sm font-medium transition-colors"
//                 >
//                   {link.label}
//                 </a>
//               ))}
//             </div>

//             {/* Theme Toggle */}
//             <div className="flex items-center space-x-4">
//               {/* <button
//                 onClick={toggleTheme}
//                 className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400"
//               >
//                 {theme === "light" ? (
//                   <MoonIcon className="h-6 w-6" />
//                 ) : (
//                   <SunIcon className="h-6 w-6" />
//                 )}
//               </button> */}

//               {isAuthenticated ? (
//                 <>
//                   <span className="text-sm text-gray-700 dark:text-gray-200">
//                     Welcome, {user?.name}
//                   </span>
//                   <Button onClick={handleLogout} variant="outline" size="sm">
//                     Logout
//                   </Button>
//                 </>
//               ) : (
//                 <div className="flex space-x-4">
//                   <Button
//                     onClick={() => (window.location.href = "/login")}
//                     variant="ghost"
//                     size="sm"
//                   >
//                     Login
//                   </Button>

//                   <Button
//                     onClick={() => (window.location.href = "/register")}
//                     variant="default"
//                     size="sm"
//                   >
//                     Register
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               {isMenuOpen ? (
//                 <XMarkIcon className="block h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="block h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             {navLinks.map((link) => (
//               <a
//                 key={link.href}
//                 href={link.href}
//                 className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
//               >
//                 {link.label}
//               </a>
//             ))}
            

//             {isAuthenticated ? (
//               <Button onClick={handleLogout} variant="outline" fullWidth>
//                 Logout
//               </Button>
//             ) : (
//               <div className="space-y-2">
//                 <Button
//                   onClick={() => (window.location.href = "/login")}
//                   variant="ghost"
//                   fullWidth
//                 >
//                   Login
//                 </Button>
//                 <Button
//                   onClick={() => (window.location.href = "/register")}
//                   variant="default"
//                   fullWidth
//                 >
//                   Register
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
import React from "react";
import { useAuthStore } from "../stores/authStore";
import { Button } from "./ui/Buttons";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggler from "./ThemeToggle";  // Import the ThemeToggler

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/programs", label: "Programs" },
    { href: "/biography", label: "Our Story" },
    { href: "/donate", label: "Donate" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                Lewis Paul Foundation
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggler />  {/* Include the ThemeToggler here */}
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    Welcome, {user?.name}
                  </span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Button
                    onClick={() => (window.location.href = "/login")}
                    variant="ghost"
                    size="sm"
                  >
                    Login
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/register")}
                    variant="default"
                    size="sm"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
