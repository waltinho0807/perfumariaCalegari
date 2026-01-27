import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export function About() {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Essências Raras",
      description: "Ingredientes selecionados ao redor do mundo para aromas inesquecíveis."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Fixação Premium",
      description: "Fórmulas exclusivas que garantem durabilidade extrema na pele."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Design de Luxo",
      description: "Frascos que são verdadeiras obras de arte para sua coleção."
    }
  ];

  return (
    <section id="about" className="bg-card py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-serif text-4xl font-bold text-foreground">
              Sobre a <span className="text-primary italic">Calegari Essência</span>
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                A Calegari Essência nasceu da vontade de empreender e da identificação de uma oportunidade real no mercado de perfumes. Sou um revendedor independente, começando esse negócio com foco em oferecer fragrâncias de qualidade, originais e com ótimo custo-benefício.
              </p>
              <p>
                Cada perfume disponível aqui é escolhido com cuidado, priorizando boa fixação, aceitação e uma assinatura olfativa marcante. A ideia não é vender qualquer coisa, mas trabalhar apenas com produtos que eu mesmo usaria ou indicaria.
              </p>
              <p>
                Como estou no início, faço questão de um atendimento próximo e transparente. Todo o contato é feito diretamente comigo via WhatsApp, onde posso tirar dúvidas, ajudar na escolha da fragrância ideal e garantir uma compra simples e segura.
              </p>
            </div>
            <div className="mt-10 flex gap-4">
              <div className="border-l-2 border-primary pl-4">
                <p className="text-2xl font-serif font-bold text-foreground">100%</p>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Original</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <p className="text-2xl font-serif font-bold text-foreground">+50</p>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Fragrâncias</p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 rounded-lg bg-background/40 p-6 border border-white/5"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
