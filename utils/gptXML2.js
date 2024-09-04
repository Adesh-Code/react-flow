import { v4 as uuidv4 } from 'uuid';
export function jsonToXml(jsonObj) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<xmi:XMI xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ad="http://www.conformiq.com/emf/21/ActivityDiagram" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.2/notation">\n';

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

        let attributes = `xmi:type="${xmiType}" xmi:id="${node.id}" name="${node.data?.name || node.type}"`;

        if (node.type === "Decision") {
            xml += parseDecisionNode(node, jsonObj);  // Use the custom decision node parser
        } else if (node.type === "Data") {
            xml += parseDataNode(node, jsonObj);
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
        if (clause.type === "date") {
            clauseElement += ` value="${daysFromDate(clause.value)}" />\n`;
        }
        else {
            clauseElement += ` value="${clause.value}" />\n`;
        }
    }
    return clauseElement;
}

function parseDecisionNode(node, jsonObj) {
    let nodeXml = `<nodes xmi:type="ad:DecisionNode" xmi:id="${node.id}" name="${node.data.name}"`;

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

function parseDataNode(node, jsonObj) {
    let nodeXml = `<nodes xmi:type="ad:BusinessActivityNode" xmi:id="${node.id}" name="${node.data.name}"`;

    const incomingFlows = jsonObj.edges.filter(edge => edge.target === node.id && edge.type === "control").map(edge => edge.id).join(' ');
    const outgoingFlows = jsonObj.edges.filter(edge => edge.source === node.id && edge.type === "control").map(edge => edge.id).join(' ');
    
    if (incomingFlows) {
        nodeXml += ` controlFlowsIn="${incomingFlows}"`;
    }

    if (outgoingFlows) {
        nodeXml += ` controlFlowsOut="${outgoingFlows}"`;
    }

    nodeXml += `>\n`;

    const actionTypeMap = {
        when: 'ad:WhenAction',
        then: 'ad:ThenAction',
        and: 'ad:AndAction',
        given: 'ad:GivenAction',
        nameTag: 'ad:NameTagBusinessAction',
        narrative: 'ad:NarrativeBusinessAction'
    };

    if (node.data && node.data.actions) {
        node.data.actions.sort((a, b) => a.order - b.order).forEach(action => {
            nodeXml += `<actions xmi:type="${actionTypeMap[action.type]}" xmi:id="${action.id}">\n`;
            nodeXml += parseActions(action);
            nodeXml += `</actions>\n`;
        });
    }

    if (node.data && node.data.parameters) {
        node.data.parameters.forEach(parameter => {
            nodeXml += `<potentiallyDeletedFields xmi:type="ad:BusinessField" name="${parameter.name}" xmi:id="${parameter.id}" qmlId="${parameter.qmlID}" ${parameter.kind === "Input" ? '' : 'kind="Output"'} >\n`;
            nodeXml += `<type xmi:type="ad:CustomTypeRef" xmi:id="${uuidv4()}" idRef="String"/>\n`;
            nodeXml += `</potentiallyDeletedFields>\n`;
        });
    }

    nodeXml += `<combinatorialStrength xmi:type="ad:Expression" xmi:id="_du25ATPbEe-CXr1AUSTgQA"/>\n`;
    
    if (node.data && node.data.rows) {
        node.data.rows.forEach(row => {
            nodeXml += `<rows xmi:type="ad:BusinessRow"  xmi:id="${row.id}" >\n`;
            nodeXml += parseRows(row);
            nodeXml += `</rows>\n`;
        });
    }
    
    nodeXml += `<spreadsheet xmi:type="ad:Expression" xmi:id="_du25AjPbEe-CXr1AUSTgQA"/>\n`;

    return nodeXml;
}   

function parseRows(row) {
    let xml = '';
    row.cells.forEach(cell => {
        xml += `<cells xmi:type="ad:BusinessCell" xmi:id="${cell.id}" key="${cell.key}">\n`;
        xml += ` <value xmi:type="ad:Expression" xmi:id="${uuidv4()}">\n`;
        xml += `  <clause xmi:type="ad:StringLiteralClause" xmi:id="${uuidv4()}" value="${cell.value}"/>\n`;
        xml += ` </value>\n`;
        xml += `</cells>\n`;
    } ); 
    return xml;
}

function parseActions(action) {
    let xml = '';
    action.value.sort((a, b) => a.order - b.order).forEach(val => {
        if (val.field) {
            xml += `  <textualRendering xmi:type="ad:BusinessActionFieldRef" xmi:id="${val.id}" field="${val.field}"/>\n`;
        } else {
            xml += `  <textualRendering xmi:type="ad:BusinessActionLiteral" xmi:id="${val.id}" value="${val.value}"/>\n`;
        }
    });
    return xml;
}

function daysFromDate(dateString) {
    const referenceDate = new Date("1970-01-01");
    const targetDate = new Date(dateString);
    const timeDifference = targetDate - referenceDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }