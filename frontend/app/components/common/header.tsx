// src/components/Header.tsx
import React from "react";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo or Site Name */}
        <Link to="/" className="text-xl font-bold">
          Hanzi Flashcard App
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            {user ? (
              <>
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="px-4 py-2">
                        Hello, {user.username}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/app/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/app/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/app/logout">Logout</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/app/">
                      <Button variant="ghost" className="px-4 py-2">
                        Dashboard
                      </Button>
                  </Link>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link to="/register">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Register
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/login">
                    <Button>Login</Button>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
