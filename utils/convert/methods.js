import { v4 as uuidv4 } from 'uuid';
import {clauseTypeMap, actionTypeMap, primitiveTypeMap} from './constant';

export function getFlowAttributeForId(edges, id) {
    let attributes = '';
    
    const incomingFlows = edges.filter(edge => edge.target === id).map(edge => edge.id).join(' ');
    const outgoingFlows = edges.filter(edge => edge.source === id).map(edge => edge.id).join(' ');

    if (incomingFlows) {
        attributes += ` controlFlowsIn="${incomingFlows}"`;
    }

    if (outgoingFlows) {
        attributes += ` controlFlowsOut="${outgoingFlows}"`;
    }

    return attributes;
}

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
        } else if(node.data.condition.objectRef) {
            xml += `<condition xmi:type="ad:Expression" xmi:id="${node.data.condition.id} >\n`;
            xml += `<clause xmi:type="ad:DataObjectAccessClause" xmi:id="${uuidv4()}" objectRef="${node.data.condition.objectRef}" />\n`;
            xml += `</condition>\n`;
        } else {
            xml += `<condition xmi:type="ad:Expression" xmi:id="${node.data.condition.id}">\n`;
            xml += parseClause(node.data.condition.clause);
            xml += `</condition>\n`;
        }
    }

    xml += `</nodes> \n`;
    return xml;
}

export function parseBusinessActivityNode(node, edges){
    let xml = `<nodes xmi:type="ad:BusinessActivityNode" xmi:id="${node.id}" name="${node.data.name}"`;

    xml += getFlowAttributeForId(edges, node.id);

    xml += `>\n`;

    if (node.data && node.data.actions) {
        node.data.actions.sort((a, b) => a.order - b.order).forEach(action => {
            xml += `<actions xmi:type="${actionTypeMap[action.type]}" xmi:id="${action.id}">\n`;
            xml += parseBusinessAction(action);
            xml += `</actions>\n`;
        });
    }

    if (node.data && node.data.parameters) {
        node.data.parameters.forEach(parameter => {
            xml += `<potentiallyDeletedFields xmi:type="ad:BusinessField" name="${parameter.name}" xmi:id="${parameter.id}" qmlId="${parameter.qmlID}" ${parameter.kind === "Input" ? '' : 'kind="Output"'} >\n`;
            xml += `<type xmi:type="ad:CustomTypeRef" xmi:id="${uuidv4()}" idRef="String"/>\n`;
            xml += `</potentiallyDeletedFields>\n`;
        });
    }

    xml += `<combinatorialStrength xmi:type="ad:Expression" xmi:id="${uuidv4()}"/>\n`;
    
    if (node.data && node.data.rows) {
        node.data.rows.forEach(row => {
            xml += `<rows xmi:type="ad:BusinessRow" xmi:id="${row.id}">\n`;
            xml += parseRows(row);
            xml += `</rows>\n`;
        });
    }
    
    xml += `<spreadsheet xmi:type="ad:Expression" xmi:id="${uuidv4()}"/>\n`;

    return xml;
}

export function parseVariableNode(node){
    let xml = `<nodes xmi:type="ad:VariableDataObject" xmi:id="${node.id}" name="${node.data.name}" qmlId="${node.data.qmlID}"`;

    if (node.data.visibility === "Local") {
        xml += ` visibility="Local"`;
    }

    xml += `>\n`;

    if (node.data && node.data.type) {
        xml += `<type xmi:type="ad:CustomTypeRef" xmi:id="${uuidv4()}" idRef="${primitiveTypeMap[node.data.type]}"/>\n`;
    }

    xml += `</nodes> \n`;

    return xml;
}

export function parseActivityNode(node, edges){
    let xml = `<nodes xmi:type="ad:ActivityNode" xmi:id="${node.id}" name="${node.data.name}"`;

    xml += getFlowAttributeForId(edges, node.id);

    xml += `>\n`;

    if(node.data && node.data.actions) {
        node.data.actions.forEach(action => {
            xml += `<actionInvocations xmi:type="ad:ActionInvocation" xmi:id="${action.id} methodRef="${action.methodRef}"`;
            xml += parseActivityAction(action);
            xml += `</actionInvocations>\n`;
        });
    }
}

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
        if (clause.type === "date_clause") {
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

function parseBusinessAction(action) {
    let xml = '';
    action.value.sort((a, b) => a.order - b.order).forEach(val => {
        if (val.field) {
            xml += `<textualRendering xmi:type="ad:BusinessActionFieldRef" xmi:id="${val.id}" field="${val.field}"/>\n`;
        } else {
            xml += `<textualRendering xmi:type="ad:BusinessActionLiteral" xmi:id="${val.id}" value="${val.value}"/>\n`;
        }
    });
    return xml;
}

function parseRows(row) {
    let xml = '';
    row.cells.forEach(cell => {
        xml += `<cells xmi:type="ad:BusinessCell" xmi:id="${cell.id}" key="${cell.key}">\n`;
        xml += `<value xmi:type="ad:Expression" xmi:id="${uuidv4()}">\n`;
        xml += `<clause xmi:type="ad:StringLiteralClause" xmi:id="${uuidv4()}" value="${cell.value}"/>\n`;
        xml += `</value>\n`;
        xml += `</cells>\n`;
    }); 
    return xml;
}

function parseActivityAction(action) {
    let xml = '';
    action.data.sort((a, b) => a.order - b.order).forEach(data => {
        xml += `<inputArgs xmi:type="ad:Expression" xmi:id="${data.id}">\n`;
        xml += parseClause(data.clause);
        xml += `</inputArgs>\n`;
    });
    if (['evaluateBoolean', 'evaluateDate', 'evaluateInt', 'evaluateString'].includes(action.methodRef)) {
        xml += `<outputLocation xmi:type="ad:DataObjectAccessClause" xmi:id="${uuidv4()}"" objectRef="${action.objectRef}"/>\n`;
    }
    return xml;
}