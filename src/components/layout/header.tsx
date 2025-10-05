// import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router";
import { ConnectButton } from "@mysten/dapp-kit";

const Header = () => {
  const navItems = [
    { title: "Overview", href: "/#overview" },
    { title: "Dashboard", href: "/dashboard" },
    { title: "Deploy", href: "/deploy" },
    { title: "Docs", href: "/docs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-8 mx-auto">
        {/* Logo */}
        <Link to={"/"}>
          <div>
            <img
              src={Logo}
              alt="Walhost Logo"
              className="w-30 object-contain"
            />
          </div>
        </Link>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-6">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive &&
                        "bg-accent text-accent-foreground font-bold shadow"
                    )
                  }
                >
                  {item.title}
                </NavLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Connect Wallet Button */}
        <ConnectButton />
        {/* <Button size="sm">Connect wallet</Button> */}
      </div>
    </header>
  );
};

export default Header;
