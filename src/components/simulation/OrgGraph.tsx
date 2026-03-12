"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  ConnectionLineType,
  Panel,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { fetchOrgData } from "@/lib/api";
import { useSimulationStore } from "@/store/simulationStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize2, Layers } from "lucide-react";
import { EmployeeNodeCard } from "./EmployeeNodeCard";
import { cn } from "@/lib/utils";

const nodeTypes = {
  employee: EmployeeNodeCard,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 240;
  const nodeHeight = 120;

  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export function OrgGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  const selectedEmployee = useSimulationStore((s: any) => s.selectedEmployee);
  const setConfig = useSimulationStore((s: any) => s.setConfig);

  const loadData = useCallback(async () => {
    setLoadingLocal(true);
    try {
      const data = await fetchOrgData();
      if (!data.nodes) return;

      const baseNodes: Node[] = data.nodes.map((n: any) => ({
        id: n.id,
        type: "employee",
        data: {
          ...n.data,
          name: n.data?.label || n.id,
          role: n.data?.role || "Team Member",
          department: n.data?.department || "Operations",
          risk: n.data?.risk || Math.random(),
        },
        position: { x: 0, y: 0 },
      }));

      const baseEdges: Edge[] = (data.edges || []).map((e: any) => ({
        ...e,
        type: ConnectionLineType.SmoothStep,
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 1.5 },
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        baseNodes,
        baseEdges
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (err) {
      toast.error("Could not load organization map. Backend offline?");
    } finally {
      setLoadingLocal(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Highlight logic
  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      setConfig({ selectedEmployee: node.id });
    },
    [setConfig]
  );

  // Highlight logic for subtree
  const selectedSubtreeIds = useMemo(() => {
    if (!selectedEmployee) return new Set();

    const subtree = new Set<string>();
    subtree.add(selectedEmployee);

    // Simple BFS to find all descendants
    const queue = [selectedEmployee];
    while (queue.length > 0) {
      const currentId = queue.shift();
      const children = edges
        .filter((e) => e.source === currentId)
        .map((e) => e.target);

      children.forEach((childId) => {
        if (!subtree.has(childId)) {
          subtree.add(childId);
          queue.push(childId);
        }
      });
    }

    return subtree;
  }, [selectedEmployee, edges]);

  const processedNodes = useMemo(() => {
    if (!selectedEmployee) return nodes;

    return nodes.map((n) => {
      const isInSubtree = selectedSubtreeIds.has(n.id);
      return {
        ...n,
        selected: n.id === selectedEmployee,
        style: {
          ...n.style,
          opacity: isInSubtree ? 1 : 0.2,
          filter: isInSubtree ? "none" : "grayscale(0.5) blur(0.5px)",
          zIndex: n.id === selectedEmployee ? 50 : (isInSubtree ? 25 : 1),
        },
      };
    });
  }, [nodes, selectedEmployee, selectedSubtreeIds]);

  const processedEdges = useMemo(() => {
    if (!selectedEmployee) return edges;
    return edges.map((e) => {
      const isRelated = selectedSubtreeIds.has(e.source) && selectedSubtreeIds.has(e.target);
      return {
        ...e,
        animated: isRelated,
        style: {
          ...e.style,
          stroke: isRelated ? "hsl(var(--primary))" : "hsl(var(--border))",
          strokeWidth: isRelated ? 2.5 : 1.5,
          opacity: isRelated ? 1 : 0.1,
        },
      };
    });
  }, [edges, selectedEmployee, selectedSubtreeIds]);

  return (
    <div className="w-full h-full min-h-[600px] bg-muted/5 relative">
      <ReactFlowProvider>
        <ReactFlow
          nodes={processedNodes}
          edges={processedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          maxZoom={1.5}
          minZoom={0.2}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        >
          <Background color="hsl(var(--border))" gap={20} size={1} variant={BackgroundVariant.Dots} />

          <Panel position="top-left" className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur border-border"
              onClick={loadData}
            >
              <RefreshCw className={cn("mr-2 h-3 w-3", loadingLocal && "animate-spin")} />
              Sync
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur border-border"
            >
              <Layers className="mr-2 h-3 w-3" />
              Hierarchy View
            </Button>
          </Panel>

          <Controls
            showInteractive={false}
            className="bg-background/80 backdrop-blur border-border shadow-sm rounded-lg overflow-hidden"
          />
        </ReactFlow>
      </ReactFlowProvider>

      {loadingLocal && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px] z-50">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Compiling Tree...</span>
          </div>
        </div>
      )}
    </div>
  );
}
