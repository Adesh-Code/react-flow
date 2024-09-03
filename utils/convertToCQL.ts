import { xml2js, js2xml, ElementCompact } from 'xml-js';
import { v4 as uuidv4 } from 'uuid';

// Sample input XML
export const inputXML = `
<elements nodes="7" edges="4">
  <nodes>
    <Start id="1" label="" posX="-18.5" posY="0" edges="1"/>
    <Data id="2" label="Request user to login" posX="-58.5" posY="132" edges="2"/>
    <Data id="5" label="Invalid login" posX="100" posY="300"/>
    <Decision id="3" label="ValidUser" posX="-45" posY="250" edges="3,4"/>
    <End id="4" label="" posX="-192.5" posY="292"/>
    <Datatype id="6" label="User Info" posX="-158.5" posY="132"/>
    <Comment id="7" label="Here we validate our &quot;Entered User Info&quot; data. Since we don't have a users table,
         we must explicitly define here multiple sets of values that can cause this test to pass.
        Anything else will fail. Our test generator will generate data for any variable filled with
         &quot;Don't care&quot; values to make sure as many decisio..." posX="-158.5" posY="350"/>
  </nodes>
</elements>
<edges>
  <edge source="1" target="2"/>
  <edge source="2" target="3"/>
  <edge source="3" target="4"/>
  <edge source="3" target="5"/>
</edges>
`;

interface XMLNodeAttributes {
  id: string;
  label: string;
  posX: string;
  posY: string;
  edges?: string;
}

interface XMLNode {
  _attributes: XMLNodeAttributes;
  _name: string;  // Add the node name to infer the type
}

interface XMLEdge {
  _attributes: {
    source: string;
    target: string;
  };
}

export function transformXML(input: string): string {
  const parsedInput = xml2js(input, { compact: true }) as ElementCompact;

  const nodes = parsedInput.elements.nodes as Record<string, XMLNode>;
  const edges: XMLEdge[] = parsedInput.edges.edge as XMLEdge[];

  const transformedNodes = Object.entries(nodes).map(([nodeType, nodeArray]) => {
    return (Array.isArray(nodeArray) ? nodeArray : [nodeArray]).map(node => {
      const id = uuidv4();
      let transformedNodeType = '';

      switch (nodeType) {
        case 'Start':
          transformedNodeType = 'InitialNode';
          break;
        case 'End':
          transformedNodeType = 'FinalNode';
          break;
        case 'Data':
          transformedNodeType = 'BusinessActivityNode';
          break;
        case 'Decision':
          transformedNodeType = 'DecisionNode';
          break;
        default:
          transformedNodeType = 'CommentNode';
      }

      return {
        _attributes: {
          'xmi:type': `ad:${transformedNodeType}`,
          'xmi:id': id,
          'name': node._attributes.label || 'Unnamed',
          'controlFlowsOut': node._attributes.edges || ''
        }
      };
    });
  }).flat();

  const transformedEdges = edges.map(edge => ({
    _attributes: {
      'xmi:type': 'ad:NormalControlFlow',
      'xmi:id': uuidv4(),
      'to': edge._attributes.target,
      'from': edge._attributes.source
    }
  }));

  const transformedXML = {
    'xmi:XMI': {
      _attributes: {
        'xmi:version': '2.0',
        'xmlns:xmi': 'http://www.omg.org/XMI',
        'xmlns:ad': 'http://www.conformiq.com/emf/21/ActivityDiagram',
        'xmlns:notation': 'http://www.eclipse.org/gmf/runtime/1.0.2/notation'
      },
      'ad:ActivityDiagram': {
        _attributes: {
          'xmi:id': uuidv4(),
          'type': 'qml5788885ec00f4fad95865618a30612e7'
        },
        'controlFlows': { edge: transformedEdges },
        'nodes': { node: transformedNodes }
      }
    }
  };

  const result = js2xml(transformedXML, { compact: true, spaces: 2, });

  console.log(result);

  return result;
}

