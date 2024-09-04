import {jsonToXml} from '@/utils/gptXML2';
import { NextRequest, NextResponse } from "next/server";

export async function GET(res: NextResponse, req: NextRequest) {

    const complexDecision = {
        id: "node2",
        type: "Decision",
        data: {
          name: "Check Condition",
          condition: {
            id: "condition1",
            clause: {
              id: "clause1",
              type: "function",
              methodRef: "concat",
              data: [
                {
                  id: "inputArg1",
                  order: 1,
                  clause: {
                    id: "clause2",
                    type: "string",
                    value: "Hello"
                  }
                },
                {
                  id: "inputArg2",
                  order: 2,
                  clause: {
                    id: "clause3",
                    type: "function",
                    methodRef: "dateToString",
                    data: [
                      {
                        id: "inputArg3",
                        clause: {
                          id: "clause4",
                          type: "date",
                          value: "2024-09-03"
                        }
                      }
                    ]
                  }
                },
                {
                  id: "inputArg4",
                  order: 3,
                  clause: {
                    id: "clause5",
                    type: "function",
                    methodRef: "numberToString",
                    data: [
                      {
                        id: "inputArg5",
                        clause: {
                          id: "clause6",
                          type: "function",
                          methodRef: "add",
                          data: [
                            {
                              id: "inputArg6",
                              clause: {
                                id: "clause7",
                                type: "number",
                                value: "10"
                              }
                            },
                            {
                              id: "inputArg7",
                              clause: {
                                id: "clause8",
                                type: "number",
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

    const businessNode = {
        id: "node2",
        type: "Data",
        data: {
            name: "business",
            actions: [
                {
                    id: "ID2",
                    type: "when",
                    order: 1,
                    value: [
                        {
                            id: "ID3",
                            order: 3,
                            value: "val2",
                        },
                        {
                            id: "ID4",
                            order: 2,
                            field: "KEY1",
                        },
                        {
                            id: "ID5",
                            order: 1,
                            value: "val",
                        },
                    ],
                },
                {
                    id: "ID7",
                    type: "and",
                    order: 3,
                    value: [
                        {
                            id: "ID8",
                            value: "val5",
                        },
                    ]
                },
                {
                    id: "ID6",
                    type: "then",
                    order: 2,
                    value: [
                        {
                            id: "ID",
                            value: "val2",
                        },
                    ]
                },
            ],
            parameters: [
                {
                    name: "param1",
                    id: "KEY1",
                    qmlID: "QMLID1",
                    kind: "Input",
                },
                {
                    name: "param2",
                    id: "KEY2",
                    qmlID: "QMLID2",
                    kind: "Output",
                },
            ],
            rows: [
                {
                    id: "ID13",
                    cells: [
                        {
                        id: "ID14" ,
                        key: "KEY1",
                        value: "val"
                    }, {
                        id: "ID18", 
                        key: "KEY2",
                        value: "vals"
                    }
                ]
                },
                {
                    id: "ID15",
                    cells: [{
                        id: "ID16", 
                        key: "KEY1",
                        value: "val"
                    }, {
                        id: "ID17", 
                        key: "KEY2",
                        value: "vals"
                    }]
                }
            ]
        }
    }

    const activityNode = {}

    const complex = {
        type: "qml1b8c133ef92c4f088d3dfa62203f3dc4",
        nodes: [
            {
                id: "1",
                type: "Start",
                position: { x: -18.5, y: 0 },
                data: null
              },
              complexDecision,
        ],
        edges: [
            {
                id: '8',
                source: '1',
                target: "node2",
                animated: true,
                type: 'control'
              },
        ]
    }

    const val = {
        type: "qml1b8c133ef92c4f088d3dfa62203f3dc4",
        nodes: [{
            id: "1",
            type: "Start",
            position: { x: -18.5, y: 0 },
            data: null
          },
          {
            id: "2",
            type: "Data",
            data: {
              name: "Request user to login",
              entities: 
                {
                  "DS" : "'Login' screen",
                  "FF" : "'UserInfo' Form",
                  "CB" : "'OK' button"
                },
            },
            position: {x:-58.5, y:132}
          },
          {
            id: "3",
            type: "Decision",
            data: {
              name: "ValidUser",
            },
            position: {x:-45, y:250}
          },
          {
            id: "4",
            type: "End",
            data: null,
            position: {x:-192.5, y:292}
          },
          {
            id: "5",
            type: "Data",
            data: {
              name: "Invalid login",
              entities: 
                {
                  "DP" : "'Error' popup",
                },
            },
            position: {x:100, y:300}
          },
          {
            id: "6",
            type: "Datatype",
            data: {
              name: "User Info",
              entities: {
                "username": "String",
                "password": "String"
              }
            },
            position: {x:-158.5, y:132}
          },
          {
            id: "7",
            type: "Comment",
            data: {
              name: `Here we validate our "Entered User Info" data. Since we don't have a users table,
               we must explicitly define here multiple sets of values that can cause this test to pass.
              Anything else will fail. Our test generator will generate data for any variable filled with
               "Don't care" values to make sure as many decisio...`,
      
            },
            position: {x: -158.5, y: 350},
          },
        ],
        edges: [
            {
                id: '8',
                source: '1',
                target: "2",
                animated: true,
                type: 'control'
              },
              {
                id: '9',
                source: '2',
                target: "3",
                animated: true,
                type: 'case_control'
              },
              {
                id: '10',
                source: '3',
                sourceHandle: 'left',
                target: "4",
                animated: true,
                type: 'case_control'
              },
              {
                id: '11',
                source: '3',
                sourceHandle: 'right',
                target: "5",
                animated: true,
                type: 'else_control'
              },
        ]
    }

    const man = jsonToXml(complex);

    console.log(man);

    return NextResponse.json(man, { status: 200, headers: {
         "content-type": "application/json"
    } });
}