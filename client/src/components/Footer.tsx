import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="mb-2 font-serif text-2xl font-bold text-primary italic">Calegari Essência</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Sua assinatura olfativa em cada detalhe. Fragrâncias exclusivas para momentos inesquecíveis.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Siga nossas redes</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild data-testid="link-instagram">
                <a href="#" title="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild data-testid="link-facebook">
                <a href="#" title="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild data-testid="link-tiktok">
                <a href="#" title="TikTok">
                  <TikTokIcon className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild data-testid="link-whatsapp">
                <a href="https://wa.me/5564996432476" target="_blank" title="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-4">Contato</p>
            <p className="text-sm text-muted-foreground">contato@calegariessencia.com.br</p>
            <p className="text-sm text-muted-foreground">(64) 99643-2476</p>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 text-center text-[10px] uppercase tracking-widest text-muted-foreground/50">
          <p>© 2026 Calegari Essência. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
