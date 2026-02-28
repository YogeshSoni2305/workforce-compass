import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { fetchOrgData } from "@/lib/api";
import { useSimulationStore } from "@/store/simulationStore";

const nodeStyle = {
  background: "hsl(222.2, 84%, 4.9%)",
  color: "hsl(210, 40%, 98%)",
  borderRadius: "50%",
  width: 72,
  height: 72,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 600,
  border: "none",
};

const selectedNodeStyle = {
  ...nodeStyle,
  boxShadow: "0 0 0 3px hsl(222.2, 84%, 4.9%), 0 0 0 6px hsl(210, 40%, 96.1%)",
};

export function OrgGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState<string | null>(null);
  const selectedEmployee = useSimulationStore((s) => s.selectedEmployee);
  const setConfig = useSimulationStore((s) => s.setConfig);

  useEffect(() => {
    fetchOrgData()
      .then((data) => {
        if (!data.nodes) return;
        const formattedNodes: Node[] = data.nodes.map((n: any, i: number) => ({
          id: String(n.id),
          data: { label: n.label || n.id },
          position: {
            x: 150 + (i % 4) * 180,
            y: 80 + Math.floor(i / 4) * 140,
          },
          style: nodeStyle,
        }));

        const formattedEdges: Edge[] = (data.edges || []).map((e: any) => ({
          id: `${e.source}-${e.target}`,
          source: String(e.source),
          target: String(e.target),
          style: { stroke: "hsl(214.3, 31.8%, 91.4%)", strokeWidth: 2 },
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      })
      .catch(() => setError("Could not load org data. Is the backend running?"));
  }, []);

  // Update node styles when selection changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: n.id === selectedEmployee ? selectedNodeStyle : nodeStyle,
      }))
    );
  }, [selectedEmployee]);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      setConfig({ selectedEmployee: node.id });
    },
    [setConfig]
  );

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(214.3, 31.8%, 91.4%)" gap={24} size={1} />
        <Controls
          showInteractive={false}
          style={{ borderRadius: 8, border: "1px solid hsl(214.3, 31.8%, 91.4%)" }}
        />
      </ReactFlow>
    </div>
  );
}
