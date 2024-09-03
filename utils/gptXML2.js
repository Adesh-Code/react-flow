
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

        if (node.type === "Decision") {
            xml += parseDecisionNode(node, jsonObj);  // Use the custom decision node parser
        } else {
            // Handle controlFlowsIn and controlFlowsOut
            const incomingFlows = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "control").map(edge => edge.id).join(' ');
            const outgoingFlows = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "control").map(edge => edge.id).join(' ');

            if (incomingFlows) {
                attributes += ` controlFlowsIn="${incomingFlows}"`;
            }

            if (outgoingFlows) {
                attributes += ` controlFlowsOut="${outgoingFlows}"`;
            }

            if (selfClosingNode) {
                xml += `  <nodes ${attributes}/>\n`;
            } else {
                xml += `  <nodes ${attributes}>\n`;
                // Additional details inside the node could go here if needed
                xml += '  </nodes>\n';
            }
        }
    });

    // Close the ActivityDiagram element
    xml += '</ad:ActivityDiagram>\n';

    // Close the XMI element
    xml += '</xmi:XMI>';

    return xml;
}

function parseClause(clause) {
    let clauseTypeMap = {
        "function": "ad:FunctionCallClause",
        "date": "ad:DateLiteralClause",
        "number": "ad:NumberLiteralClause",
        "string": "ad:StringLiteralClause"
    };

    let clauseElement = `<clause xmi:type="${clauseTypeMap[clause.type]}" xmi:id="${clause.id}"`;
    
    if (clause.type === "function") {
        clauseElement += ` methodRef="${clause.methodRef}">\n`;

        if (clause.data && clause.data.length > 0) {
            clause.data.forEach(inputArg => {
                clauseElement += `<inputArgs xmi:type="ad:Expression" xmi:id="${inputArg.id}">\n`;
                clauseElement += parseClause(inputArg.clause);
                clauseElement += `</inputArgs>\n`;
            });
        }
    clauseElement += `</clause>\n`;

    } else {
        clauseElement += ` value="${clause.value}" />\n`;
    }
    return clauseElement;
}

function parseDecisionNode(node, jsonObj) {
    let nodeXml = `<nodes xmi:type="ad:DecisionNode" xmi:id="${node.id}" name="${node.data.label}"`;

    const incomingFlows = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "control").map(edge => edge.id).join(' ');
    const outgoingFlows = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "control").map(edge => edge.id).join(' ');
    
    if (incomingFlows) {
        nodeXml += ` controlFlowsIn="${incomingFlows}"`;
    }

    if (outgoingFlows) {
        nodeXml += ` controlFlowsOut="${outgoingFlows}"`;
    }

    const caseControlFlowsIn = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "case_control").map(edge => edge.id).join(' ');
    const caseControlFlowsOut = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "case_control").map(edge => edge.id).join(' ');
    const elseControlFlowsIn = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "else_control").map(edge => edge.id).join(' ');
    const elseControlFlowsOut = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "else_control").map(edge => edge.id).join(' ');

    if (caseControlFlowsIn) nodeXml += ` caseControlFlowsIn="${caseControlFlowsIn}"`;
    if (caseControlFlowsOut) nodeXml += ` caseControlFlowsOut="${caseControlFlowsOut}"`;
    if (elseControlFlowsIn) nodeXml += ` elseControlFlowsIn="${elseControlFlowsIn}"`;
    if (elseControlFlowsOut) nodeXml += ` elseControlFlowsOut="${elseControlFlowsOut}"`;

    nodeXml += `>\n`;

    if (node.data && node.data.condition) {
        nodeXml += `<condition xmi:type="ad:Expression" xmi:id="${node.data.condition.id}">\n`;
        nodeXml += parseClause(node.data.condition.clause);
        nodeXml += `</condition>\n`;
    }

    nodeXml += `</nodes> \n`;
    return nodeXml;
}
