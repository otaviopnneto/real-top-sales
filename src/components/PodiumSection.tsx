import { Card } from "@/components/ui/card";
import { Crown, TrendingUp, Trophy } from "lucide-react";

interface Seller {
  nomecorretor: string;
  valor: number;
  position?: number;
}

interface PodiumSectionProps {
  topThree: Seller[];
}

export const PodiumSection = ({ topThree }: PodiumSectionProps) => {
  const [first, second, third] = topThree;

  const getPodiumCard = (seller: Seller | undefined, position: number) => {
    if (!seller) return null;

    const heights = { 1: 'h-56', 2: 'h-44', 3: 'h-36' };
    const gradients = { 
      1: 'bg-gradient-gold', 
      2: 'bg-gradient-silver', 
      3: 'bg-gradient-bronze' 
    };
    const icons = { 1: '🥇', 2: '🥈', 3: '🥉' };

    return (
      <div className="flex flex-col items-center gap-3" key={position}>
        <Card 
          className={`${heights[position as keyof typeof heights]} w-full ${gradients[position as keyof typeof gradients]} 
                     shadow-elevated transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-6 relative overflow-hidden`}
        >
          {position === 1 && (
            <Crown className="absolute top-2 right-2 h-6 w-6 text-yellow-300 animate-glow" />
          )}
          
          <div className="text-5xl mb-3 animate-float">
            {icons[position as keyof typeof icons]}
          </div>
          
          <h3 className="text-xl font-bold text-white text-center mb-2">
            {seller.nomecorretor}
          </h3>
          
          <div className="flex items-center gap-2 text-white/90">
            <TrendingUp className="h-4 w-4" />
            <span className="text-2xl font-bold">{seller.valor.toLocaleString('pt-BR')}</span>
          </div>
          
          <span className="text-white/70 text-sm mt-1">pontos</span>
        </Card>
        
        <div className="text-lg font-semibold text-muted-foreground">
          {position}º Lugar
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-6 items-end mb-12">
      {getPodiumCard(second, 2)}
      {getPodiumCard(first, 1)}
      {getPodiumCard(third, 3)}
    </div>
  );
};
