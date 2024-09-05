import {clauseTypeMap} from './constant';

export function parseDecisionNode(node, edges){
    let xml = `<nodes xmi:type="ad:DecisionNode" xmi:id="${node.id}" name="${node.data.name}"`;

    const incomingFlows = edges.filter(edge => edge.target === node.id && edge.type !== "data_flow").map(edge => edge.id).join(' ');
    const outgoingFlows = edges.filter(edge => edge.source === node.id && edge.type !== "data_flow").map(edge => edge.id).join(' ');
    
    if (incomingFlows) {
        xml += ` controlFlowsIn="${incomingFlows}"`;
    }

    if (outgoingFlows) {
        xml += ` controlFlowsOut="${outgoingFlows}"`;
    }

    const caseControlFlowsIn = edges.filter(edge => edge.target === node.id && edge.type === "case_control").map(edge => edge.id).join(' ');
    const caseControlFlowsOut = edges.filter(edge => edge.source === node.id && edge.type === "case_control").map(edge => edge.id).join(' ');
    const elseControlFlowsIn = edges.filter(edge => edge.target === node.id && edge.type === "else_control").map(edge => edge.id).join(' ');
    const elseControlFlowsOut = edges.filter(edge => edge.source === node.id && edge.type === "else_control").map(edge => edge.id).join(' ');

    if (caseControlFlowsIn) xml += ` caseControlFlowsIn="${caseControlFlowsIn}"`;
    if (caseControlFlowsOut) xml += ` caseControlFlowsOut="${caseControlFlowsOut}"`;
    if (elseControlFlowsIn) xml += ` elseControlFlowsIn="${elseControlFlowsIn}"`;
    if (elseControlFlowsOut) xml += ` elseControlFlowsOut="${elseControlFlowsOut}"`;

    xml += `>\n`;

    if (node.data && node.data.condition) {
        if (node.data.condition.readDataFlow) {
            xml += `<condition xmi:type="ad:Expression" xmi:id="${node.data.condition.id} readDataFlow="${node.data.condition.readDataFlow}"/>\n`;
        } else {
            xml += `<condition xmi:type="ad:Expression" xmi:id="${node.data.condition.id}">\n`;
            xml += parseClause(node.data.condition.clause);
            xml += `</condition>\n`;
        }
    }

    xml += `</nodes> \n`;
    return xml;
}

export function parseBusinessActivityNode(node, edges){}

export function parseActivityNode(node, edges){}

export function parseVariableNode(node, edges){}


function parseClause(clause) {
    let clauseElement = `<clause xmi:type="${clauseTypeMap[clause.type]}" xmi:id="${clause.id}"`;
    
    if (clause.type === "function_clause") {
        clauseElement += ` methodRef="${clause.methodRef}">\n`;

        if (clause.data && clause.data.length > 0) {
            clause.data.forEach(inputArg => {
                clauseElement += `<inputArgs xmi:type="ad:Expression" xmi:id="${inputArg.id}">\n`;
                clauseElement += parseClause(inputArg.clause);
                clauseElement += `</inputArgs>\n`;
            });
        }
        clauseElement += `</clause>\n`;

    } else if (clause.type === 'data_object_access_clause') {
        clauseElement += ` objectRef="${clause.objectRef}"/>\n`;
    } else if (clause.type === 'diagram_ref_clause') {
        clauseElement += ` diagramRef="${clause.diagramRef}"/>\n`;
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

function daysFromDate(dateString) {
    const referenceDate = new Date("1970-01-01");
    const targetDate = new Date(dateString);
    const timeDifference = targetDate - referenceDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
}