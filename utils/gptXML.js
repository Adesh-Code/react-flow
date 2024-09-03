export function jsonToXml(jsonObj) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<xmi:XMI xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:ad="http://www.conformiq.com/emf/21/ActivityDiagram" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.2/notation">\n';

    // Start of the ActivityDiagram element
    xml += `<ad:ActivityDiagram xmi:id="${jsonObj.id || ''}" type="${jsonObj.type || ''}">\n`;

    // Add controlFlows elements (edges)
    jsonObj.edges.forEach(edge => {
        xml += `  <controlFlows xmi:type="ad:NormalControlFlow" xmi:id="${edge.id}" to="${edge.target}" from="${edge.source}"/>\n`;
    });

    // Add nodes elements
    jsonObj.nodes.forEach(node => {
        const nodeTypeMap = {
            "Start": "ad:InitialNode",
            "End": "ad:TerminateNode",
            "Data": "ad:BusinessActivityNode",
            "Decision": "ad:DecisionNode",
            "Datatype": "ad:DataTypeNode",
            "Comment": "ad:CommentNode"
        };

        const xmiType = nodeTypeMap[node.type] || "ad:UnknownNode";
        xml += `  <nodes xmi:type="${xmiType}" xmi:id="${node.id}" name="${node.data?.label || node.type}"`;

        // Placeholder for controlFlowsIn and controlFlowsOut (if available)
        const incomingFlows = jsonObj.edges.filter(edge => edge.target === node.id).map(edge => edge.id).join(' ');
        const outgoingFlows = jsonObj.edges.filter(edge => edge.source === node.id).map(edge => edge.id).join(' ');

        if (incomingFlows) {
            xml += ` controlFlowsIn="${incomingFlows}"`;
        }

        if (outgoingFlows) {
            xml += ` controlFlowsOut="${outgoingFlows}"`;
        }

        xml += '>\n';

        // Placeholder for additional details if needed

        xml += '  </nodes>\n';
    });

    // Close the ActivityDiagram element
    xml += '</ad:ActivityDiagram>\n';

    // Close the XMI element
    xml += '</xmi:XMI>';

    return xml;
}