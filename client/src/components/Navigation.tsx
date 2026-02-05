import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Sword, ShoppingCart, Home, LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/store", label: "Store", icon: ShoppingCart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <Sword className="w-8 h-8 text-primary relative z-10 transform -rotate-45" />
          </div>
          <span className="font-minecraft text-3xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-widest">
            SHADOW<span className="text-primary">SMP</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`
                    relative px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300
                    ${isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="font-minecraft text-xl hidden md:block">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_2px_hsl(270,80%,60%)]" />
                  )}
                </div>
              </Link>
            );
          })}

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              <Link href="/admin">
                <Button variant="ghost" className="gap-2 text-white/80 hover:text-primary hover:bg-primary/10">
                  <Shield className="w-4 h-4" />
                  <span className="hidden md:inline font-minecraft text-lg">Admin</span>
                </Button>
              </Link>
              <Button 
                onClick={() => logout()}
                variant="destructive" 
                size="sm"
                className="font-minecraft text-lg opacity-80 hover:opacity-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <a href="/api/login" className="ml-4">
              <Button className="font-minecraft text-lg bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_-3px_hsl(270,80%,60%)] hover:shadow-[0_0_25px_-5px_hsl(270,80%,60%)] border border-primary/50">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
