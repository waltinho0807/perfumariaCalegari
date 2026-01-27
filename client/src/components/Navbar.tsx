import { User, ShoppingBag, Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import { Button } from "@/components/ui/button";
import type { Lead } from "@shared/schema";

export function Navbar() {
  const [, setLocation] = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Lead | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user_profile");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, [isAuthOpen]);

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith('#')) {
      window.location.href = '/' + path;
    } else {
      setLocation(path);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="cursor-pointer" onClick={() => setLocation('/')}>
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                Calegari <span className="text-primary">Essência</span>
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" onClick={() => setLocation('/')} className="text-xs uppercase tracking-widest" data-testid="nav-home">Home</Button>
            <Button variant="ghost" size="sm" onClick={() => handleNavClick('#collection')} className="text-xs uppercase tracking-widest" data-testid="nav-collection">Coleção</Button>
            <Button variant="ghost" size="sm" onClick={() => setLocation('/blog')} className="text-xs uppercase tracking-widest" data-testid="nav-blog">Blog</Button>
            <Button variant="ghost" size="sm" onClick={() => handleNavClick('#about')} className="text-xs uppercase tracking-widest" data-testid="nav-about">Sobre</Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/carrinho')}
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAuthOpen(true)}
              data-testid="button-auth"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={`fixed top-0 left-0 z-[70] h-full w-72 bg-background border-r border-white/10 transform transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-serif text-lg font-bold text-foreground">
            Calegari <span className="text-primary">Essência</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            data-testid="button-close-menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col p-4 space-y-1">
          <Button
            variant="ghost"
            className="justify-start text-xs uppercase tracking-widest"
            onClick={() => handleNavClick('/')}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-xs uppercase tracking-widest"
            onClick={() => handleNavClick('#collection')}
          >
            Coleção
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-xs uppercase tracking-widest"
            onClick={() => handleNavClick('/blog')}
          >
            Blog
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-xs uppercase tracking-widest"
            onClick={() => handleNavClick('#about')}
          >
            Sobre
          </Button>
          <div className="h-px bg-white/10 my-4" />
          <Button
            variant="ghost"
            className="justify-start text-xs uppercase tracking-widest"
            onClick={() => handleNavClick('/carrinho')}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Interesses
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-xs uppercase tracking-widest"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsAuthOpen(true);
            }}
          >
            <User className="h-4 w-4 mr-2" />
            {currentUser ? currentUser.name : 'Entrar'}
          </Button>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
