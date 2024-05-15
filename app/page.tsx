"use client";
import Flow from "@/components/flow";
import ReactFlow, {addEdge, Background, Connection, Controls, Edge, MiniMap, Node, useEdgesState, useNodes, useNodesState} from "reactflow";

import 'reactflow/dist/style.css';
import { convertToXML } from "@/utils/convertXML";
import { useCallback } from "react";
import AnnotationNode from "@/components/AnnotationNode";

export default function Home() {

  const nodeTypes = {
    "AnnotationNode": AnnotationNode,
  }

  const initialNodes: Node[] = [
    {
      id: "1",
      data: {
        label: "Hello",
      },
      position: {x:0, y:0}
    },
    {
      id: "2",
      data: {
        label: "world",
      },
      position: {x:150, y:100}
    },
    {
      id: "3",
      type: "AnnotationNode",
      data: {
        level: 10,
        label: "aaa",
      },
      position: {x:350, y:100}
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: '3',
      source: '1',
      target: "2",
      animated: true,
    },
    {
      id: '4',
      source: '2',
      target: "1",
      animated: true,
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Connection) => {
    const edge = {...connection, animated: true, id: `${edges.length + 1}`};
    setEdges(prevState => addEdge(edge, prevState));
  }, []);

  return (
    <main className="border h-screen w-screen bg-black">
      <div className="h-[90%] w-full p-5 bg-white">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView nodeTypes={nodeTypes}>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="flex justify-center items-center">

        <button className="h-[10%] border bg-white" onClick={() => {
          convertToXML({nodes, edges});
        }} >Export to XML</button>
      
        </div>
      {/* <div className="h-full w-full">
        <Flow />
      </div> */}
    </main>
  );
}
