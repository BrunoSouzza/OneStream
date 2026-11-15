"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Server,
  Database,
  Cpu,
  Globe,
  Layers,
  StickyNote,
  Cloud,
  Shield,
  Zap,
  Box,
  Terminal,
  Lock,
  Users,
  Smartphone,
  HardDrive,
  Workflow,
  GitBranch,
  MessageSquare,
  Code2,
  Activity,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Copy,
  Check,
  Link2,
  Trash2,
  Move,
  Sparkles,
  Save,
  Settings2,
  X,
} from "lucide-react";

export type IconName =
  | "server"
  | "database"
  | "cpu"
  | "globe"
  | "layers"
  | "note"
  | "cloud"
  | "shield"
  | "zap"
  | "box"
  | "terminal"
  | "lock"
  | "users"
  | "smartphone"
  | "harddrive"
  | "workflow"
  | "gitbranch"
  | "message"
  | "code"
  | "activity";

export type CardColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "sky"
  | "violet"
  | "rose"
  | "yellow"
  | "cyan";

export interface ArchNode {
  id: string;
  label: string;
  subtitle?: string;
  category: string; // Free custom text, e.g., "Microsserviço", "Lambda", "Squad", etc.
  icon: IconName;
  color: CardColor;
  x: number;
  y: number;
}

export interface ArchEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface ArchDiagramData {
  title?: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

const NODE_WIDTH = 210;
const NODE_HEIGHT = 82;

export const ICON_CATALOG: Record<
  IconName,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  server: { label: "Servidor / API", Icon: Server },
  database: { label: "Banco de Dados", Icon: Database },
  cpu: { label: "Fila / Worker", Icon: Cpu },
  globe: { label: "Web / Global", Icon: Globe },
  layers: { label: "Gateway / Camadas", Icon: Layers },
  cloud: { label: "Cloud / SaaS", Icon: Cloud },
  shield: { label: "Segurança / Auth", Icon: Shield },
  zap: { label: "Evento / Serverless", Icon: Zap },
  box: { label: "Container / Módulo", Icon: Box },
  terminal: { label: "CLI / Script", Icon: Terminal },
  lock: { label: "Cofre / IAM", Icon: Lock },
  users: { label: "Usuários / Squad", Icon: Users },
  smartphone: { label: "App Mobile", Icon: Smartphone },
  harddrive: { label: "Storage / S3", Icon: HardDrive },
  workflow: { label: "Orquestrador", Icon: Workflow },
  gitbranch: { label: "Pipeline / Git", Icon: GitBranch },
  message: { label: "Mensageria / Chat", Icon: MessageSquare },
  code: { label: " Biblioteca / SDK", Icon: Code2 },
  activity: { label: "Monitoramento", Icon: Activity },
  note: { label: "Post-it / Nota", Icon: StickyNote },
};

export const COLOR_PALETTE: Record<
  CardColor,
  {
    name: string;
    dot: string;
    border: string;
    bg: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  indigo: {
    name: "Indigo",
    dot: "bg-indigo-500",
    border: "border-indigo-500/50 hover:border-indigo-400",
    bg: "bg-white/95 dark:bg-slate-900/95",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-500 dark:text-indigo-400",
  },
  emerald: {
    name: "Esmeralda",
    dot: "bg-emerald-500",
    border: "border-emerald-500/50 hover:border-emerald-400",
    bg: "bg-white/95 dark:bg-slate-900/95",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  amber: {
    name: "Âmbar",
    dot: "bg-amber-500",
    border: "border-amber-500/50 hover:border-amber-400",
    bg: "bg-white/95 dark:bg-slate-900/95",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  sky: {
    name: "Azul Céu",
    dot: "bg-sky-500",
    border: "border-sky-500/50 hover:border-sky-400",
    bg: "bg-white/95 dark:bg-slate-900/95",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-500 dark:text-sky-400",
  },
  violet: {
    name: "Violeta",
    dot: "bg-violet-500",
    border: "border-violet-500/50 hover:border-violet-400",
    bg: "bg-white/95 dark:bg-slate-900/95",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500 dark:text-violet-400",
  },
  rose: {
    name: "Rosa / Alerta",
    dot: "bg-rose-500",
    border: "border-rose-500/50 hover:border-rose-400",
    bg: "bg-white/95 dark:bg-slate-900/95",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500 dark:text-rose-400",
  },
  cyan: {
    name: "Ciano",
    dot: "bg-cyan-500",
    border: "border-cyan-500/50 hover:border-cyan-400",
    bg: "bg-white/95 dark:bg-slate-900/95",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-500 dark:text-cyan-400",
  },
  yellow: {
    name: "Post-it",
    dot: "bg-yellow-400",
    border: "border-yellow-400/70 hover:border-yellow-300",
    bg: "bg-yellow-50/95 dark:bg-yellow-500/10",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
};

const LEGACY_PRESETS: Record<
  string,
  { category: string; icon: IconName; color: CardColor }
> = {
  client: { category: "Frontend / App", icon: "globe", color: "sky" },
  gateway: { category: "Gateway / Edge", icon: "layers", color: "violet" },
  service: { category: "Microsserviço", icon: "server", color: "indigo" },
  queue: { category: "Stream / Fila", icon: "cpu", color: "amber" },
  database: { category: "Banco de Dados", icon: "database", color: "emerald" },
  note: { category: "Nota (Miro)", icon: "note", color: "yellow" },
};

/**
 * Parses either legacy 5-column or full generic 7-column DSL:
 * [id | categoria | Nome | Subtítulo | x, y | icone | cor]
 */
export function parseArchitectureBlock(raw: string): ArchDiagramData {
  const trimmed = raw.trim();
  const nodes: ArchNode[] = [];
  const edges: ArchEdge[] = [];
  let title = "Quadro de Arquitetura (Estilo Miro)";

  const lines = trimmed.split(/\r?\n/);
  let autoIndex = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) continue;

    if (line.toLowerCase().startsWith("title:")) {
      title = line.slice(6).trim();
      continue;
    }

    const nodeMatch = line.match(/^\[(.+)\]$/);
    if (nodeMatch) {
      const parts = nodeMatch[1].split("|").map((s) => s.trim());
      const id = parts[0] || `node_${autoIndex + 1}`;
      const rawTypeOrCategory = parts[1] || "Microsserviço";
      const label = parts[2] || id;
      const subtitle = parts[3] || "";
      const coords = (parts[4] || "").split(",").map((n) => parseFloat(n.trim()));

      const col = autoIndex % 3;
      const row = Math.floor(autoIndex / 3);
      const x = !isNaN(coords[0]) ? coords[0] : 80 + col * 280;
      const y = !isNaN(coords[1]) ? coords[1] : 80 + row * 150;

      const preset = LEGACY_PRESETS[rawTypeOrCategory.toLowerCase()];
      const category = preset ? preset.category : rawTypeOrCategory;

      const rawIcon = (parts[5] || "").toLowerCase() as IconName;
      const icon: IconName = ICON_CATALOG[rawIcon]
        ? rawIcon
        : preset
        ? preset.icon
        : "server";

      const rawColor = (parts[6] || "").toLowerCase() as CardColor;
      const color: CardColor = COLOR_PALETTE[rawColor]
        ? rawColor
        : preset
        ? preset.color
        : "indigo";

      nodes.push({ id, category, label, subtitle, x, y, icon, color });
      autoIndex++;
      continue;
    }

    const edgeMatch = line.match(
      /^([a-zA-Z0-9_-]+)\s*(-+>)\s*([a-zA-Z0-9_-]+)(?:\s*:\s*(.+))?$/
    );
    if (edgeMatch) {
      const from = edgeMatch[1];
      const arrow = edgeMatch[2];
      const to = edgeMatch[3];
      const label = edgeMatch[4]?.trim();
      edges.push({
        id: `${from}-${to}-${edges.length}`,
        from,
        to,
        label,
        animated: arrow.includes("--"),
      });
    }
  }

  return { title, nodes, edges };
}

export function serializeArchitectureBlock(data: ArchDiagramData): string {
  const lines: string[] = [];
  if (data.title) {
    lines.push(`title: ${data.title}`);
    lines.push("");
  }
  lines.push(
    "# Componentes: [id | Categoria | Nome | Subtítulo | x, y | icone | cor]"
  );
  for (const n of data.nodes) {
    lines.push(
      `[${n.id} | ${n.category} | ${n.label} | ${n.subtitle || ""} | ${Math.round(
        n.x
      )}, ${Math.round(n.y)} | ${n.icon} | ${n.color}]`
    );
  }
  if (data.edges.length > 0) {
    lines.push("");
    lines.push("# Conexões: origem --> destino : Rótulo");
    for (const e of data.edges) {
      const arrow = e.animated !== false ? "-->" : "->";
      lines.push(
        `${e.from} ${arrow} ${e.to}${e.label ? ` : ${e.label}` : ""}`
      );
    }
  }
  return "```architecture\n" + lines.join("\n") + "\n```";
}

export function ArchitectureBoard({
  rawCode,
  relativePath,
}: {
  rawCode: string;
  relativePath?: string;
}) {
  const router = useRouter();
  const initialData = React.useMemo(
    () => parseArchitectureBlock(rawCode),
    [rawCode]
  );

  const [boardTitle, setBoardTitle] = useState(
    initialData.title || "Arquitetura Interativa"
  );
  const [nodes, setNodes] = useState<ArchNode[]>(initialData.nodes);
  const [edges, setEdges] = useState<ArchEdge[]>(initialData.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const lastSavedBlockRef = useRef<string>(rawCode);

  // Canvas Pan & Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBoardTitle(initialData.title || "Arquitetura Interativa");
    setNodes(initialData.nodes);
    setEdges(initialData.edges);
    lastSavedBlockRef.current = rawCode;
    setIsDirty(false);
  }, [initialData, rawCode]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const updateSelectedNode = (patch: Partial<ArchNode>) => {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((n) => (n.id === selectedNodeId ? { ...n, ...patch } : n))
    );
    setIsDirty(true);
  };

  const handleSaveToMarkdownFile = async () => {
    if (!relativePath) return;
    setIsSaving(true);
    setSaveFeedback(null);

    const newBlockCode = serializeArchitectureBlock({
      title: boardTitle,
      nodes,
      edges,
    });

    try {
      const res = await fetch("/api/docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relativePath,
          oldBlockCode: lastSavedBlockRef.current,
          newBlockCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha ao salvar no arquivo .md");
      }

      // Extract inner code without ``` fences to track latest saved block
      lastSavedBlockRef.current = newBlockCode
        .replace(/^```architecture\n/, "")
        .replace(/\n```$/, "");
      setIsDirty(false);
      setSaveFeedback("Salvo no .md!");
      router.refresh();
      setTimeout(() => setSaveFeedback(null), 3000);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Erro ao salvar alterações no arquivo .md"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseDownNode = (e: React.MouseEvent, node: ArchNode) => {
    e.stopPropagation();

    if (connectingFromId) {
      if (connectingFromId !== node.id) {
        const label = window.prompt(
          "Rótulo da conexão (ex: HTTPS, gRPC, Kafka):",
          "HTTPS"
        );
        if (label !== null) {
          setEdges((prev) => [
            ...prev,
            {
              id: `${connectingFromId}-${node.id}-${Date.now()}`,
              from: connectingFromId,
              to: node.id,
              label: label.trim() || undefined,
              animated: true,
            },
          ]);
          setIsDirty(true);
        }
      }
      setConnectingFromId(null);
      return;
    }

    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    const rect = containerRef.current?.getBoundingClientRect();
    const clientX = (e.clientX - (rect?.left || 0) - pan.x) / zoom;
    const clientY = (e.clientY - (rect?.top || 0) - pan.y) / zoom;
    dragOffset.current = {
      x: clientX - node.x,
      y: clientY - node.y,
    };
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelectedNodeId(null);
    setConnectingFromId(null);
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingNodeId) {
        const rect = containerRef.current?.getBoundingClientRect();
        const clientX = (e.clientX - (rect?.left || 0) - pan.x) / zoom;
        const clientY = (e.clientY - (rect?.top || 0) - pan.y) / zoom;
        const nextX = Math.round((clientX - dragOffset.current.x) / 10) * 10;
        const nextY = Math.round((clientY - dragOffset.current.y) / 10) * 10;

        setNodes((prev) =>
          prev.map((n) =>
            n.id === draggingNodeId ? { ...n, x: nextX, y: nextY } : n
          )
        );
        setIsDirty(true);
      } else if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [draggingNodeId, isPanning, pan.x, pan.y, panStart.x, panStart.y, zoom]
  );

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const addCustomCard = () => {
    const id = `card_${Date.now().toString().slice(-4)}`;
    const newNode: ArchNode = {
      id,
      category: "Componente",
      label: "Novo Card",
      subtitle: "Clique para personalizar",
      icon: "box",
      color: "indigo",
      x: Math.round((-pan.x + 160 + (nodes.length % 4) * 50) / zoom),
      y: Math.round((-pan.y + 120 + (nodes.length % 4) * 40) / zoom),
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    setIsDirty(true);
  };

  const deleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) =>
      prev.filter(
        (e) => e.from !== selectedNodeId && e.to !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
    setIsDirty(true);
  };

  const deleteEdge = (edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    setIsDirty(true);
  };

  const resetBoard = () => {
    setBoardTitle(initialData.title || "Arquitetura Interativa");
    setNodes(initialData.nodes);
    setEdges(initialData.edges);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setSelectedNodeId(null);
    setConnectingFromId(null);
    setIsDirty(false);
  };

  const copyUpdatedMarkdown = async () => {
    const serialized = serializeArchitectureBlock({
      title: boardTitle,
      nodes,
      edges,
    });
    try {
      await navigator.clipboard.writeText(serialized);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`my-6 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg dark:border-slate-800 dark:bg-slate-950 ${
        isFullscreen
          ? "fixed inset-4 z-50 my-0 h-[calc(100vh-2rem)]"
          : "h-[620px]"
      }`}
    >
      {/* Top Miro-like Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => {
                setBoardTitle(e.target.value);
                setIsDirty(true);
              }}
              className="w-44 bg-transparent font-bold text-indigo-600 focus:outline-none dark:text-indigo-400 sm:w-56"
              title="Clique para editar o título do quadro"
            />
          </div>
          <span className="hidden text-xs text-slate-400 xl:inline">
            Clique em qualquer card para mudar Categoria, Ícone, Cor e Texto
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={addCustomCard}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/20 dark:text-indigo-300"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Novo Card</span>
          </button>

          {selectedNodeId && (
            <>
              <button
                type="button"
                onClick={() =>
                  setConnectingFromId(
                    connectingFromId === selectedNodeId ? null : selectedNodeId
                  )
                }
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  connectingFromId === selectedNodeId
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>
                  {connectingFromId === selectedNodeId
                    ? "Clique no card de destino..."
                    : "Conectar Seta"}
                </span>
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                title="Remover card selecionado"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-800" />

          <button
            type="button"
            onClick={copyUpdatedMarkdown}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Copiar bloco Markdown para a área de transferência"
          >
            {copiedMd ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar MD</span>
              </>
            )}
          </button>

          {relativePath && (
            <button
              type="button"
              onClick={handleSaveToMarkdownFile}
              disabled={isSaving}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all ${
                saveFeedback
                  ? "bg-emerald-600"
                  : isDirty
                  ? "bg-indigo-600 hover:bg-indigo-500 ring-2 ring-indigo-500/30"
                  : "bg-slate-700 hover:bg-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
              title="Grava as alterações deste quadro diretamente no arquivo .md (persiste ao dar F5)"
            >
              {saveFeedback ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>{saveFeedback}</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>
                    {isSaving
                      ? "Salvando..."
                      : isDirty
                      ? "Salvar no .md *"
                      : "Salvar no .md"}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Board Area + Floating Inspector */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Infinite Canvas */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            backgroundImage:
              "radial-gradient(rgba(148, 163, 184, 0.35) 1.5px, transparent 1.5px)",
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
          className={`relative flex-1 overflow-hidden select-none ${
            isPanning ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
            className="absolute inset-0"
          >
            {/* SVG Connections */}
            <svg
              className="pointer-events-none overflow-visible"
              width="4000"
              height="3000"
            >
              <defs>
                <marker
                  id="arch-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 0 1 L 10 5 L 0 9 z"
                    className="fill-indigo-500 dark:fill-indigo-400"
                  />
                </marker>
              </defs>

              {edges.map((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.x + NODE_WIDTH / 2;
                const y1 = fromNode.y + NODE_HEIGHT / 2;
                const x2 = toNode.x + NODE_WIDTH / 2;
                const y2 = toNode.y + NODE_HEIGHT / 2;

                const dx = x2 - x1;
                const cx1 = x1 + dx * 0.45;
                const cy1 = y1;
                const cx2 = x1 + dx * 0.55;
                const cy2 = y2;

                const pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={edge.id} className="pointer-events-auto">
                    <path
                      d={pathD}
                      fill="none"
                      strokeWidth="2.2"
                      markerEnd="url(#arch-arrow)"
                      strokeDasharray={edge.animated ? "6 4" : undefined}
                      className="stroke-indigo-500/75 dark:stroke-indigo-400/80"
                    >
                      {edge.animated && (
                        <animate
                          attributeName="stroke-dashoffset"
                          from="20"
                          to="0"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      )}
                    </path>
                    {edge.label && (
                      <g
                        transform={`translate(${midX}, ${midY})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextLabel = window.prompt(
                            "Editar rótulo da conexão (deixe vazio para remover a seta):",
                            edge.label
                          );
                          if (nextLabel === "") {
                            deleteEdge(edge.id);
                          } else if (nextLabel !== null) {
                            setEdges((prev) =>
                              prev.map((item) =>
                                item.id === edge.id
                                  ? { ...item, label: nextLabel }
                                  : item
                              )
                            );
                            setIsDirty(true);
                          }
                        }}
                      >
                        <title>Clique para editar ou apagar esta conexão</title>
                        <rect
                          x={-edge.label.length * 3.8 - 10}
                          y={-11}
                          width={edge.label.length * 7.6 + 20}
                          height={22}
                          rx={6}
                          className="fill-white stroke-slate-200 hover:stroke-indigo-500 dark:fill-slate-900 dark:stroke-slate-700"
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          dy="4"
                          className="fill-slate-600 font-mono text-[10px] font-semibold dark:fill-slate-300"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Generic Cards */}
            {nodes.map((node) => {
              const palette =
                COLOR_PALETTE[node.color] || COLOR_PALETTE.indigo;
              const iconEntry =
                ICON_CATALOG[node.icon] || ICON_CATALOG.server;
              const IconComponent = iconEntry.Icon;
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleMouseDownNode(e, node)}
                  style={{
                    width: `${NODE_WIDTH}px`,
                    minHeight: `${NODE_HEIGHT}px`,
                    transform: `translate(${node.x}px, ${node.y}px)`,
                  }}
                  className={`absolute left-0 top-0 cursor-move rounded-xl border-2 p-3 shadow-md backdrop-blur-xs transition-shadow ${
                    palette.bg
                  } ${palette.border} ${
                    isSelected
                      ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 shadow-xl"
                      : "hover:shadow-lg"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-1">
                    <span className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {node.category}
                    </span>
                    <Move className="h-3 w-3 shrink-0 text-slate-300 dark:text-slate-600" />
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${palette.iconBg} ${palette.iconColor}`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-slate-900 dark:text-white">
                        {node.label}
                      </div>
                      {node.subtitle && (
                        <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {node.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Zoom & Reset Controls */}
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/90 p-1 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90"
          >
            <button
              type="button"
              onClick={() =>
                setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))
              }
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Diminuir Zoom"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[44px] text-center font-mono text-xs font-medium text-slate-600 dark:text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() =>
                setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2)))
              }
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Aumentar Zoom"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="mx-0.5 h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <button
              type="button"
              onClick={resetBoard}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Descartar alterações não salvas"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              title={
                isFullscreen ? "Sair da Tela Cheia" : "Expandir em Tela Cheia"
              }
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Right Side Card Customizer Drawer (Opens when a card is selected) */}
        {selectedNode && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white/95 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:w-80"
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2.5 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Settings2 className="h-4 w-4" />
                <span>Personalizar Card</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Custom Category Badge (e.g., Microsserviço, Squad, Lambda, etc.) */}
              <div>
                <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Categoria / Tipo (Topo do Card)
                </label>
                <input
                  type="text"
                  value={selectedNode.category}
                  onChange={(e) =>
                    updateSelectedNode({ category: e.target.value })
                  }
                  placeholder="Ex: Microsserviço, BFF, Lambda, Squad..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Card Title */}
              <div>
                <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Nome do Card
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) =>
                    updateSelectedNode({ label: e.target.value })
                  }
                  placeholder="Ex: Order Service"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Card Subtitle */}
              <div>
                <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Subtítulo / Tecnologia
                </label>
                <input
                  type="text"
                  value={selectedNode.subtitle || ""}
                  onChange={(e) =>
                    updateSelectedNode({ subtitle: e.target.value })
                  }
                  placeholder="Ex: Node.js + PostgreSQL"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                  Cor do Card
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(COLOR_PALETTE) as CardColor[]).map((colorKey) => {
                    const item = COLOR_PALETTE[colorKey];
                    const active = selectedNode.color === colorKey;
                    return (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => updateSelectedNode({ color: colorKey })}
                        title={item.name}
                        className={`h-6 w-6 rounded-full ${item.dot} transition-transform ${
                          active
                            ? "scale-110 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900"
                            : "opacity-75 hover:opacity-100"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Icon Picker Grid */}
              <div>
                <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
                  Ícone do Card
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(ICON_CATALOG) as IconName[]).map((iconKey) => {
                    const entry = ICON_CATALOG[iconKey];
                    const IconComp = entry.Icon;
                    const active = selectedNode.icon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => updateSelectedNode({ icon: iconKey })}
                        title={entry.label}
                        className={`flex h-9 items-center justify-center rounded-lg border transition-colors ${
                          active
                            ? "border-indigo-500 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800"
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {relativePath && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveToMarkdownFile}
                    disabled={isSaving}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>
                      {isSaving ? "Salvando..." : "Salvar Alterações no .md"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
