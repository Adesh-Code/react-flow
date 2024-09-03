export function jsonToXml(jsonObj) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<xmi:XMI xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:ad="http://www.conformiq.com/emf/21/ActivityDiagram" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.2/notation">\n';

    // Start of the ActivityDiagram element
    xml += `<ad:ActivityDiagram xmi:id="${jsonObj.id || ''}" type="${jsonObj.type || ''}">\n`;

    // Add controlFlows elements (edges)
    jsonObj.edges.forEach(edge => {
        const edgeTypeMap = {
            "control": "ad:NormalControlFlow",
            "case_control": "ad:CaseControlFlow",
            "else_control": "ad:ElseControlFlow",
            "data_flow": "ad:DataControlFlow"
        };

        const xmiType = edgeTypeMap[edge.type] || "ad:UnknownControlFlow";
        const selfClosingTag = ["ad:NormalControlFlow", "ad:DataControlFlow"].includes(xmiType);

        if (selfClosingTag) {
            xml += `  <controlFlows xmi:type="${xmiType}" xmi:id="${edge.id}" to="${edge.target}" from="${edge.source}"/>\n`;
        } else {
            xml += `  <controlFlows xmi:type="${xmiType}" xmi:id="${edge.id}" to="${edge.target}" from="${edge.source}"></controlFlows>\n`;
        }
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
        const selfClosingNode = ["ad:InitialNode", "ad:TerminateNode", "ad:FinalNode", "ad:CommentNode"].includes(xmiType);

        let attributes = `xmi:type="${xmiType}" xmi:id="${node.id}" name="${node.data?.label || node.type}"`;

        // Handle controlFlowsIn and controlFlowsOut
        const incomingFlows = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "control").map(edge => edge.id).join(' ');
        const outgoingFlows = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "control").map(edge => edge.id).join(' ');

        if (incomingFlows) {
            attributes += ` controlFlowsIn="${incomingFlows}"`;
        }

        if (outgoingFlows) {
            attributes += ` controlFlowsOut="${outgoingFlows}"`;
        }

        // Additional attributes for Decision nodes
        if (node.type === "Decision") {
            const caseControlFlowsIn = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "case_control").map(edge => edge.id).join(' ');
            const caseControlFlowsOut = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "case_control").map(edge => edge.id).join(' ');
            const elseControlFlowsIn = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "else_control").map(edge => edge.id).join(' ');
            const elseControlFlowsOut = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "else_control").map(edge => edge.id).join(' ');

            if (caseControlFlowsIn) attributes += ` caseControlFlowsIn="${caseControlFlowsIn}"`;
            if (caseControlFlowsOut) attributes += ` caseControlFlowsOut="${caseControlFlowsOut}"`;
            if (elseControlFlowsIn) attributes += ` elseControlFlowsIn="${elseControlFlowsIn}"`;
            if (elseControlFlowsOut) attributes += ` elseControlFlowsOut="${elseControlFlowsOut}"`;
        }

        if (selfClosingNode) {
            xml += `  <nodes ${attributes}/>\n`;
        } else {
            xml += `  <nodes ${attributes}>\n`;
            // Additional details inside the node could go here if needed
            xml += '  </nodes>\n';
        }
    });

    // Close the ActivityDiagram element
    xml += '</ad:ActivityDiagram>\n';

    // Close the XMI element
    xml += '</xmi:XMI>';

    return xml;
}
