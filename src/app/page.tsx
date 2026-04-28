"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  FileText,
  Activity,
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ clients: 0, cases: 0, openCases: 0 });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningRoutine, setRunningRoutine] = useState(false);

  const fetchData = async () => {
    try {
      const [clientsRes, casesRes, logsRes] = await Promise.all([
        fetch("/api/clients").catch(err => { console.error(err); return { ok: false } as Response; }),
        fetch("/api/cases").catch(err => { console.error(err); return { ok: false } as Response; }),
        fetch("/api/routines").catch(err => { console.error(err); return { ok: false } as Response; })
      ]);

      const getSafeData = async (res: Response) => {
        if (!res.ok) return [];
        try {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        } catch (e) {
          console.error("Failed to parse JSON", e);
          return [];
        }
      };

      const clients = await getSafeData(clientsRes);
      const cases = await getSafeData(casesRes);
      const loadedLogs = await getSafeData(logsRes);

      setStats({
        clients: clients.length,
        cases: cases.length,
        openCases: cases.filter((c: any) => c.status === 'Open').length
      });
      setLogs(loadedLogs);
    } catch (error) {
      console.error("Error loading dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runRoutine = async () => {
    setRunningRoutine(true);
    try {
      const res = await fetch("/api/routines", { method: "POST" });
      if (res.ok) {
        fetchData(); // Refresh logs
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRunningRoutine(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Visão Geral</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="floating-surface jade-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{loading ? "..." : stats.clients}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>
        <Card className="floating-surface jade-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processos Totais</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{loading ? "..." : stats.cases}</div>
            <p className="text-xs text-muted-foreground">Casos registrados</p>
          </CardContent>
        </Card>
        <Card className="floating-surface jade-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Casos Abertos</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{loading ? "..." : stats.openCases}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
        <Card className="floating-surface jade-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Automação</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">Ativa</div>
            <p className="text-xs text-muted-foreground">Sistema operando</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Automation Center */}
        <Card className="col-span-4 floating-surface">
          <CardHeader>
            <CardTitle className="text-foreground">Central de Automação</CardTitle>
            <CardDescription className="text-muted-foreground">
              Execute rotinas de verificação e monitore atualizações dos casos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-background/40">
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2 text-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" /> Verificação de Atualizações
                </h4>
                <p className="text-sm text-muted-foreground">
                  Busca por clientes sem contato e processos &quot;parados&quot; há mais de 30 dias.
                </p>
              </div>
              <Button onClick={runRoutine} disabled={runningRoutine} className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                {runningRoutine ? (
                  "Executando..."
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Executar Agora</>
                )}
              </Button>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground mt-6">Histórico de Execuções</h4>
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <div className="text-sm text-center py-4 text-muted-foreground">Nenhuma execução recente.</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="flex items-start gap-4 p-3 rounded-md border border-white/5 bg-background/20 text-sm">
                      <div className="mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{log.type}</div>
                        <div className="text-muted-foreground">{log.message}</div>
                        <div className="text-xs text-muted-foreground/60 mt-1">
                          {new Date(log.createdAt).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="col-span-3 floating-surface">
          <CardHeader>
            <CardTitle className="text-foreground">Acesso Rápido</CardTitle>
            <CardDescription className="text-muted-foreground">
              Navegue pelas principais funções do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="h-20 justify-start px-4 border-white/5 hover:bg-white/5 hover:text-primary transition-all group" asChild>
              <Link href="/cases" className="flex items-center gap-4">
                <Briefcase className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold text-foreground group-hover:text-primary">Gerir Processos</div>
                  <div className="text-xs text-muted-foreground">Acompanhar andamento</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 justify-start px-4 border-white/5 hover:bg-white/5 hover:text-primary transition-all group" asChild>
              <Link href="/clients" className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold text-foreground group-hover:text-primary">Base de Clientes</div>
                  <div className="text-xs text-muted-foreground">Cadastrar ou editar</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 justify-start px-4 border-white/5 hover:bg-white/5 hover:text-primary transition-all group" asChild>
              <Link href="/calendar" className="flex items-center gap-4">
                <Activity className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold text-foreground group-hover:text-primary">Agenda</div>
                  <div className="text-xs text-muted-foreground">Prazos e reuniões</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
