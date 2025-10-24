import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

interface RankingCardProps {
  position: number;
  seller: {
    nomecorretor: string;
    valor: number;
  };
  isTopThree?: boolean;
}

const getPositionBadge = (position: number) => {
  const badges = {
    1: { icon: "🥇", gradient: "bg-gradient-gold", label: "1º" },
    2: { icon: "🥈", gradient: "bg-gradient-silver", label: "2º" },
    3: { icon: "🥉", gradient: "bg-gradient-bronze", label: "3º" },
  };
  
  return badges[position as keyof typeof badges];
};

export const RankingCard = ({ position, seller, isTopThree }: RankingCardProps) => {
  const positionBadge = getPositionBadge(position);

  return (
    <Card 
      className={`p-6 transition-all duration-300 hover:scale-[1.02] ${
        isTopThree 
          ? 'bg-card shadow-elevated border-primary/20' 
          : 'bg-card/50 shadow-card'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {isTopThree && positionBadge ? (
            <div className={`${positionBadge.gradient} text-white px-4 py-3 rounded-xl font-bold text-lg shadow-glow flex items-center gap-2`}>
              <span className="text-2xl">{positionBadge.icon}</span>
              <span>{positionBadge.label}</span>
            </div>
          ) : (
            <Badge variant="outline" className="px-4 py-2 text-lg font-semibold">
              {position}º
            </Badge>
          )}
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">{seller.nomecorretor}</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <span className="text-sm">Vendedor</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-3xl font-bold ${
            isTopThree ? 'bg-gradient-primary bg-clip-text text-transparent' : 'text-foreground'
          }`}>
            {seller.valor.toLocaleString('pt-BR')}
          </div>
          <div className="text-sm text-muted-foreground mt-1">vendas</div>
        </div>
      </div>
      
      {isTopThree && position === 1 && (
        <Trophy className="absolute top-4 right-4 h-8 w-8 text-primary/20 animate-float" />
      )}
    </Card>
  );
};
