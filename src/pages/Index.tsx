import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PodiumSection } from "@/components/PodiumSection";
import { RankingCard } from "@/components/RankingCard";
import { Trophy, Activity } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [sellers, setSellers] = useState<Array<{ nomecorretor: string; valor: number }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      const response = await fetch(
        "https://cqjviutyjppzxvwalwdv.supabase.co/functions/v1/rapid-processor",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao chamar Edge Function");

      const data = await response.json();
      const rows = data?.data || [];

      // Agrupar por nome do corretor somando os valores
      const ranking: Record<string, number> = {};
      rows.forEach((item: any) => {
        const name = item.corretor?.nome ?? item.nomecorretor ?? "";
        const value = Number(item.valor ?? 0);
        if (!name) return;
        ranking[name] = (ranking[name] || 0) + value;
      });

      const formattedSellers = Object.entries(ranking)
        .map(([nomecorretor, valor]) => ({ nomecorretor, valor }))
        .sort((a, b) => b.valor - a.valor);

      setSellers(formattedSellers);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
      toast.error("Erro ao carregar ranking de vendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Só ativa o loading na primeira montagem
    fetchSellers();

    const channel = supabase
      .channel('tb_pontos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tb_pontos'
        },
        (payload) => {
          console.log('Atualização detectada:', payload);
          fetchSellers();
          toast.success('Ranking atualizado em tempo real!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-primary">
          <Activity className="h-8 w-8 animate-pulse" />
          <span className="text-xl font-semibold">Carregando ranking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ranking de Pontos</h1>
          <p className="text-muted-foreground">Atualização em tempo real</p>
        </div>

        {sellers.length > 0 ? (
          <>
            <PodiumSection topThree={sellers.slice(0, 3)} />
            
            <div className="space-y-4 mt-8">
              {sellers.slice(3).map((seller, index) => (
                <RankingCard
                  key={seller.nomecorretor}
                  position={index + 4}
                  seller={seller}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum corretor encontrado no ranking
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;