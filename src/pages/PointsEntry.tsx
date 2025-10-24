import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const PointsEntry = () => {
  const [idcorretor, setIdcorretor] = useState("");
  const [idempreendimento, setIdempreendimento] = useState("");
  const [valor, setValor] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = {
        idcorretor: parseInt(idcorretor, 10),
        idempreendimento: parseInt(idempreendimento, 10),
        valor: parseFloat(valor),
        motivo,
        categoria: "OUTROS",
        tipo: "MANUAL",
        booster: 1,
      };

      const endpoint = "https://cqjviutyjppzxvwalwdv.supabase.co/functions/v1/inserir-pontos";
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          apikey: key, // opcional, algumas funções Supabase aceitam/aprovam este header também
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Erro na API (${response.status}): ${text}`);
      }

      // opcional: ler resposta JSON se a função retornar detalhes
      const result = await response.json().catch(() => null);
      console.log("Resposta inserir-pontos:", result);

      toast.success("Pontos lançados com sucesso!");
      setIdcorretor("");
      setIdempreendimento("");
      setValor("");
      setMotivo("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao lançar pontos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Ranking
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Lançamento de Pontos</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para realizar um lançamento avulso de pontos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idcorretor">ID do Corretor</Label>
                  <Input
                    id="idcorretor"
                    type="number"
                    placeholder="Digite o ID do corretor"
                    value={idcorretor}
                    onChange={(e) => setIdcorretor(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idempreendimento">ID do Empreendimento</Label>
                  <Input
                    id="idempreendimento"
                    type="number"
                    placeholder="Digite o ID do empreendimento"
                    value={idempreendimento}
                    onChange={(e) => setIdempreendimento(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="Digite o valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Textarea
                  id="motivo"
                  placeholder="Descreva o motivo do lançamento"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Categoria:</strong> Outros
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Tipo:</strong> Manual
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Booster:</strong> 1
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Lançando..." : "Lançar Pontos"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PointsEntry;
