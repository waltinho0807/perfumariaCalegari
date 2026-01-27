import heroImage from '@assets/dark_luxury_perfume_bottle_hero_image.png';
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const handleSupport = () => {
    window.open(`https://wa.me/5564996432476?text=${encodeURIComponent('Olá! Tenho uma dúvida sobre os perfumes.')}`, '_blank');
  };

  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary drop-shadow-md"
        >
          Calegari Essência
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 max-w-3xl font-serif text-5xl font-bold leading-tight text-white md:text-7xl drop-shadow-lg"
        >
          Descubra a arte da <span className="text-primary italic">fragrância</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-10 max-w-lg text-lg text-gray-100 drop-shadow-md"
        >
          Uma coleção exclusiva de aromas selecionados para quem busca sofisticação e mistério.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-none uppercase tracking-widest"
            data-testid="button-view-collection"
          >
            Ver Coleção
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleSupport}
            className="rounded-none uppercase tracking-widest bg-white/5 backdrop-blur-sm border-white/20 text-white"
            data-testid="button-whatsapp-support"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Dúvidas? WhatsApp
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
