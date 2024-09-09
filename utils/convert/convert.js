import { nodeTypeMap, edgeTypeMap } from './constant';
import { parseBusinessActivityNode, parseDecisionNode, getFlowAttributeForId, parseVariableNode, parseActivityNode } from './methods';

export function convertToADXML({id, qmlId, nodes, edges}) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

    xml += '<xmi:XMI xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ad="http://www.conformiq.com/emf/21/ActivityDiagram" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.2/notation">\n';

    // Start of the ActivityDiagram element
    xml += `<ad:ActivityDiagram xmi:id="${id}" type="${qmlId}">\n`;

    const parsedEdges = edges.filter((edge) => edge.type !== "note_flow");
    const parsedNodes = nodes.filter((node) => node.type !== "note_node");

    xml += parseEdges(parsedEdges);

    xml += parseNodes(parsedNodes, parsedEdges);

    xml += '</ad:ActivityDiagram>\n';
    xml += '</xmi:XMI>\n';

    return xml;
}

function parseEdges(edges) {
    let xml = '';

    edges.forEach(edge => {
        if (edge.type === "data_flow"){
            xml += `<dataFlows xmi:type="ad:ReadDataFlow" xmi:id="${edge.id}" to="${edge.target}" from="${edge.source}"/>\n`;
        } else {
            const xmiType = edgeTypeMap[edge.type] || "ad:NormalControlFlow";

            if (edge.type === "case_flow") {
                xml += `<controlFlows xmi:type="${xmiType}" xmi:id="${edge.id}" to="${edge.target}" from="${edge.source}">\n</controlFlows>\n`;
            } else {
                xml += `<controlFlows xmi:type="${xmiType}" xmi:id="${edge.id}" to="${edge.target}" from="${edge.source}"/>\n`;
            }
        }
    });

    return xml;
}

function parseNodes(nodes, edges) {
    let xml = ''

    nodes.forEach(node => {
        const xmiType = nodeTypeMap[node.type] || "ad:UnknownNode";

        let attributes = `xmi:type="${xmiType}" xmi:id="${node.id}" name="${node.data?.name || node.type}"`;

        if (node.type === "decision_node") {
            xml += parseDecisionNode(node, edges);  // Use the custom decision node parser
        } else if (node.type === "business_activity_node") {
            xml += parseBusinessActivityNode(node, edges);
        } else if (node.type === "variable_node") {
            xml += parseVariableNode(node);
        } else if (node.type === "activity_node") {
            xml += parseActivityNode(node, edges);
        } else {
            // Handle controlFlowsIn and controlFlowsOut
            attributes += getFlowAttributeForId(edges, node.id)

            xml += `<nodes ${attributes}/>\n`;
        }
    });

    return xml;
}