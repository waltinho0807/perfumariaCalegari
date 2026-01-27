import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Loader2 } from "lucide-react";
import { registerLead, loginLead } from "@/lib/api";
import type { Lead } from "@shared/schema";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentUser, setCurrentUser] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user_profile");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (isOpen && !currentUser) {
      setIsLogin(false);
      setError(null);
    }
  }, [isOpen, currentUser]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user: Lead;
      if (isLogin) {
        user = await loginLead(phone);
      } else {
        user = await registerLead(name, phone);
      }
      localStorage.setItem("user_profile", JSON.stringify(user));
      setCurrentUser(user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Algo deu errado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_profile");
    setCurrentUser(null);
    onClose();
  };

  if (currentUser) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white border-none text-black">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-black">Seu Perfil</DialogTitle>
            <DialogDescription className="text-gray-600">
              Bem-vindo de volta, {currentUser.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 border border-gray-100">
              <div className="rounded-full bg-black/5 p-3">
                <User className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="font-medium text-black" data-testid="text-user-name">{currentUser.name}</p>
                <p className="text-sm text-gray-500" data-testid="text-user-phone">{currentUser.phone}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleLogout} className="w-full border-black/10" data-testid="button-logout">
              Sair da Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-none text-black">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-black">
            {isLogin ? "Acessar Conta" : "Criar Conta"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isLogin
              ? "Digite seu telefone para acessar."
              : "Cadastre-se rapidinho com nome e telefone."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-6 py-4">
          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black uppercase tracking-widest text-[10px] font-bold">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border-gray-200 rounded-none focus-visible:ring-black text-black placeholder:text-gray-400"
                  data-testid="input-name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-black uppercase tracking-widest text-[10px] font-bold">Telefone / WhatsApp</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-50 border-gray-200 rounded-none focus-visible:ring-black text-black placeholder:text-gray-400"
                data-testid="input-phone"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center" data-testid="text-error">{error}</p>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full bg-black text-white rounded-none uppercase tracking-widest text-xs font-bold"
              data-testid="button-submit-auth"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLogin ? (
                "Acessar"
              ) : (
                "Criar Minha Conta"
              )}
            </Button>
            <p className="text-center text-sm text-gray-500">
              {isLogin ? "Primeira vez aqui?" : "Já tem cadastro?"}{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-black font-bold p-0 h-auto"
                data-testid="button-toggle-auth"
              >
                {isLogin ? "Cadastre-se" : "Acesse sua conta"}
              </Button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
