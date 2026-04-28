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
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.clients}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos Totais</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.cases}</div>
            <p className="text-xs text-muted-foreground">Casos registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Abertos</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{loading ? "..." : stats.openCases}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automação</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-700">Ativa</div>
            <p className="text-xs text-muted-foreground">Sistema operando</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Automation Center */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Central de Automação</CardTitle>
            <CardDescription>
              Execute rotinas de verificação e monitore atualizações dos casos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" /> Verificação de Atualizações
                </h4>
                <p className="text-sm text-slate-500">
                  Busca por clientes sem contato e processos &quot;parados&quot; há mais de 30 dias.
                </p>
              </div>
              <Button onClick={runRoutine} disabled={runningRoutine}>
                {runningRoutine ? (
                  "Executando..."
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Executar Agora</>
                )}
              </Button>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm text-slate-500 mt-6">Histórico de Execuções</h4>
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <div className="text-sm text-center py-4 text-slate-400">Nenhuma execução recente.</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="flex items-start gap-4 p-3 rounded-md border text-sm">
                      <div className="mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{log.type}</div>
                        <div className="text-slate-500">{log.message}</div>
                        <div className="text-xs text-slate-400 mt-1">
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

        {/* Quick Links / Recent Activity Placeholder */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>
              Navegue pelas principais funções do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="h-20 justify-start px-4" asChild>
              <Link href="/cases" className="flex items-center gap-4">
                <Briefcase className="h-8 w-8 text-blue-500" />
                <div className="text-left">
                  <div className="font-semibold">Gerir Processos</div>
                  <div className="text-xs text-slate-500">Acompanhar andamento</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 justify-start px-4" asChild>
              <Link href="/clients" className="flex items-center gap-4">
                <Users className="h-8 w-8 text-indigo-500" />
                <div className="text-left">
                  <div className="font-semibold">Base de Clientes</div>
                  <div className="text-xs text-slate-500">Cadastrar ou editar</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 justify-start px-4" asChild>
              <Link href="/calendar" className="flex items-center gap-4">
                <Activity className="h-8 w-8 text-orange-500" />
                <div className="text-left">
                  <div className="font-semibold">Agenda</div>
                  <div className="text-xs text-slate-500">Prazos e reuniões</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
