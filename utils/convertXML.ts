import { Edge , Node} from "reactflow";
import { js2xml } from "xml-js";

  // Convert graph data to XML format
 export const convertToXML = ({nodes, edges} : {nodes: Node[], edges: Edge[]}) => {
    const xmlData = js2xml(
      {
        elements: {
          _attributes: {
            nodes: nodes.length,
            edges: edges.length
          },
          nodes: nodes.reduce((acc: any, node: Node) => {
            const connectedEdges = edges.filter((edge: Edge) => edge.source === node.id);
            const connectedEdgesIds = connectedEdges.map((edge: Edge) => edge.id);
            const attributes: any = {
              id: node.id,
              label: node.data?.label || '',
              posX: node.position.x,
              posY: node.position.y
            };
            if (connectedEdgesIds.length > 0) {
              attributes.edges = connectedEdgesIds.join(',');
            }
            const nodeName = node.type || 'node';
            acc[nodeName] = acc[nodeName] || [];
            acc[nodeName].push({ _attributes: attributes });
            return acc;
          }, {})
        },
          edges: {
            edge: edges.map((edge: Edge) => ({
              _attributes: {
                source: edge.source,
                target: edge.target
              }
            }))
          }
        
      },
      { compact: true, spaces: 2 }
    );
    downloadXML(xmlData);
  };

  // Trigger download of XML file
 export  const downloadXML = (xmlData: string) => {
    const blob = new Blob([xmlData], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.xml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };