"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  BarChart, 
  Newspaper, 
  Cloud, 
  Menu, 
  SearchIcon,
  UserCircle,
  Bell,
  X
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/finance",
    label: "Finance",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    href: "/news",
    label: "News",
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    href: "/weather",
    label: "Weather",
    icon: <Cloud className="h-5 w-5" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-200",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-background shadow-lg transform transition-transform duration-200 ease-in-out border-r",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Close menu">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-4 py-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="w-full bg-background pl-8" 
              />
            </div>
          </div>

          <nav className="space-y-1 px-2 py-4">
            {sidebarLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setSidebarOpen(false)}
              >
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === link.href ? "bg-accent" : "hover:bg-accent"
                  )}
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r z-10">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          </div>
          
          <div className="px-4 py-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="w-full bg-background pl-8" 
              />
            </div>
          </div>

          <nav className="space-y-1 px-3 py-6">
            {sidebarLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === link.href ? "bg-accent" : "hover:bg-accent"
                  )}
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">User</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Main Content with Header */}
        <div className="flex flex-col ml-64 min-h-screen w-[calc(100%-16rem)]">
          <header className="h-16 border-b flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold">
              {pathname === "/" && "Dashboard"}
              {pathname === "/finance" && "Finance"}
              {pathname === "/news" && "News"}
              {pathname === "/weather" && "Weather"}
            </h1>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span>Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden pt-0">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}