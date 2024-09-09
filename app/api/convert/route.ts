import { convertToADXML } from "@/utils/convert/convert";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function GET(res: NextResponse, req: NextRequest) {

  const node1Id = uuidv4();
  const node2Id = uuidv4();
  const node3Id = uuidv4();
  const node4Id = uuidv4();
  const node5Id = uuidv4();
  
  const node6Id = uuidv4();
  const node7Id = uuidv4();
  const node8Id = uuidv4();
  const node9Id = uuidv4();
  const node10Id = uuidv4();
  const node11Id = uuidv4();
  const node12Id = uuidv4();
  const node13Id = uuidv4();
  const node14Id = uuidv4();
  const node15Id = uuidv4();

  const edge1Id = uuidv4();
  const edge2Id = uuidv4();
  const edge3Id = uuidv4();

  const variable1Id = uuidv4();
  const variable2Id = uuidv4();
  const variable3Id = uuidv4();
  

    const complexDecision = {
        id: node2Id,
        type: "decision_node",
        data: {
          name: "Check Condition",
          condition: {
            id: node3Id,
            clause: {
              id: node4Id,
              type: "function_clause",
              methodRef: "concat",
              data: [
                {
                  id: node5Id,
                  order: 1,
                  clause: {
                    id: "clause2",
                    type: "string_clause",
                    value: "Hello"
                  }
                },
                {
                  id: node6Id,
                  order: 2,
                  clause: {
                    id: node7Id,
                    type: "function_clause",
                    methodRef: "dateToString",
                    data: [
                      {
                        id: node8Id,
                        clause: {
                          id: node9Id,
                          type: "date_clause",
                          value: "2024-09-03"
                        }
                      }
                    ]
                  }
                },
                {
                  id: node10Id,
                  order: 3,
                  clause: {
                    id: node11Id,
                    type: "function_clause",
                    methodRef: "numberToString",
                    data: [
                      {
                        id: node12Id,
                        clause: {
                          id: node13Id,
                          type: "function_clause",
                          methodRef: "add",
                          data: [
                            {
                              id: node14Id,
                              clause: {
                                id: "clause7",
                                type: "number_clause",
                                value: "10"
                              }
                            },
                            {
                              id: node15Id,
                              clause: {
                                id: "clause8",
                                type: "number_clause",
                                value: "20"
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
    } 

    const simpleDecision1 = {
      id: node2Id,
      type: "decision_node",
      data: {
        name: "Check Condition2",
        condition: {
          id: node14Id,
          readDataFlow: variable1Id,
        }
      }
    }

    const simpleDecision2 = {
      id: node3Id,
      type: "decision_node",
      data: {
        name: "Check Condition2",
        condition: {
          id: node13Id,
          objectRef: variable1Id,
        }
      }
    }

    const businessNode = {
        id: node2Id,
        type: "business_activity_node",
        data: {
            name: "business",
            actions: [
                {
                    id: node3Id,
                    type: "when_action",
                    order: 1,
                    value: [
                        {
                            id: node4Id,
                            order: 2,
                            value: "val2",
                        },
                        {
                            id: node6Id,
                            order: 1,
                            value: "val",
                        },
                    ],
                },
                {
                    id: node7Id,
                    type: "and_action",
                    order: 3,
                    value: [
                        {
                            id: node8Id,
                            value: "val5",
                        },
                    ]
                },
                {
                    id: node9Id,
                    type: "then_action",
                    order: 2,
                    value: [
                        {
                            id: node10Id,
                            value: "val2",
                        },
                    ]
                },
            ],
            parameters: [
                
            ],
            rows: [
                
            ]
        }
    }

    const variableNode = {
      id: node15Id,
      type: "variable_node",
      data: {
          name: "Val",
          errorMessages: [],
          visibility: "Global",
          qmlID: variable1Id,
          type: "String",
      },
      position: {
          x: 10,
          y: 80,
      },
  }
  
    const activityNode = {}

    const nodes = [
      {
        id: node1Id,
        type: "initial_node",
        data: {
            name: "Start",
            errorMessages: [],
        },
        position: {
            x: 10,
            y: 80,
        },
      },
      businessNode
      // simpleDecision1,
      // simpleDecision2,
      // variableNode
        // complexDecision,
      ];

    const edges = [
        {
          id: edge1Id,
          source: node1Id,
          target: node2Id,
          animated: true,
          type: 'control'
        },
      ];

    const val = convertToADXML({
      id: "1",
      qmlId: "qml1b8c133ef92c4f088d3dfa62203f3dc4",
      nodes: nodes,
      edges: edges
    });

    console.log(val);

    return NextResponse.json(val, { status: 200, headers: {
         "content-type": "application/json"
    } });
}