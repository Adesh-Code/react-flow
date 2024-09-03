"use client";
import ReactFlow, {addEdge, Background, Connection, Controls, Edge, MiniMap, Node, useEdgesState, useNodes, useNodesState} from "reactflow";

import 'reactflow/dist/style.css';
import { convertToXML } from "@/utils/convertXML";
import { useCallback } from "react";
import CommentNode from "@/components/nodes/CommentNode";
import EndNode from "@/components/nodes/EndNode";
import StartNode from "@/components/nodes/StartNode";
import DecisionNode from "@/components/nodes/DecisionNode";
import DataNode from "@/components/nodes/DataNode";
import DatatypeNode from "@/components/nodes/DatatypeNode";
import { inputXML, transformXML } from "@/utils/convertToCQL";

export default function Home() {

  const nodeTypes = {
    "Comment": CommentNode,
    "End": EndNode,
    "Start": StartNode,
    "Decision": DecisionNode,
    "Data": DataNode,
    "Datatype": DatatypeNode,
  }

  const initialNodes: Node[] = [
    {
      id: "1",
      type: "Start",
      position: { x: -18.5, y: 0 },
      data: null
    },
    {
      id: "2",
      type: "Data",
      data: {
        label: "Request user to login",
        entities: 
          {
            "DS" : "'Login' screen",
            "FF" : "'UserInfo' Form",
            "CB" : "'OK' button"
          }
        ,
      },
      position: {x:-58.5, y:132}
    },
    {
      id: "3",
      type: "Decision",
      data: {
        label: "ValidUser",
      },
      position: {x:-45, y:250}
    },
    {
      id: "4",
      type: "End",
      data: null,
      position: {x:-192.5, y:292}
    },
    {
      id: "5",
      type: "Data",
      data: {
        label: "Invalid login",
        entities: 
          {
            "DP" : "'Error' popup",
          },
      },
      position: {x:100, y:300}
    },
    {
      id: "6",
      type: "Datatype",
      data: {
        label: "User Info",
        entities: {
          "username": "String",
          "password": "String"
        }
      },
      position: {x:-158.5, y:132}
    },
    {
      id: "7",
      type: "Comment",
      data: {
        label: `Here we validate our "Entered User Info" data. Since we don't have a users table,
         we must explicitly define here multiple sets of values that can cause this test to pass.
        Anything else will fail. Our test generator will generate data for any variable filled with
         "Don't care" values to make sure as many decisio...`,

      },
      position: {x: -158.5, y: 350},
    }
  ]

  const initialEdges: Edge[] = [
    {
      id: '8',
      source: '1',
      target: "2",
      animated: true,
    },
    {
      id: '9',
      source: '2',
      target: "3",
      animated: true,
    },
    {
      id: '10',
      source: '3',
      sourceHandle: 'left',
      target: "4",
      animated: true,
    },
    {
      id: '11',
      source: '3',
      sourceHandle: 'right',
      target: "5",
      animated: true,
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Connection) => {
    const edge = {...connection, animated: true, id: `${edges.length + 2}`};
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
          // transformXML(inputXML);
          // convertToXML({nodes, edges});
        }} >Export to XML</button>
      
        </div>
      {/* <div className="h-full w-full">
        <Flow />
      </div> */}
    </main>
  );
}
