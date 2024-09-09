export const edgeTypeMap = {
    normal_flow: "ad:NormalControlFlow",
    case_flow: "ad:CaseControlFlow",
    else_flow: "ad:ElseControlFlow",
    data_flow: "ad:ReadDataFlow"
};

export const nodeTypeMap = {
    initial_node: "ad:InitialNode",
    block_node: "ad:BlockNode",
    return_node: "ad:FinalNode",
    end_node: "ad:TerminateNode",
    business_activity_node: "ad:BusinessActivityNode",
    activity_node: "ad:ActivityNode",
    decision_node: "ad:DecisionNode",
    merge_node: "ad:MergeNode",
    event_node: "ad:EventNode",
    variable_node: "ad:VariableDataObject"
};

export const clauseTypeMap = {
    function_clause: "ad:FunctionCallClause",
    date_clause: "ad:DateLiteralClause",
    number_clause: "ad:NumberLiteralClause",
    string_clause: "ad:StringLiteralClause",
    data_object_access_clause: "ad:DataObjectAccessClause",
    diagram_ref_clause: "ad:DiagramRefClause"
};

export const actionTypeMap = {
    when_action: 'ad:WhenAction',
    then_action: 'ad:ThenAction',
    and_action: 'ad:AndAction',
    given_action: 'ad:GivenAction',
    nameTag_action: 'ad:NameTagBusinessAction',
    narrative_action: 'ad:NarrativeBusinessAction'
};

export const primitiveTypeMap = {
    String: "String",
    Boolean: "boolean",
    Number: "int",
    Date: "Date"
  }
