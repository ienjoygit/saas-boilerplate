/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type CreateDocumentDemoItemMutationInput = {
    file?: string | null;
    createdBy?: string | null;
    clientMutationId?: string | null;
};
export type documentsListCreateMutationVariables = {
    input: CreateDocumentDemoItemMutationInput;
    connections: Array<string>;
};
export type documentsListCreateMutationResponse = {
    readonly createDocumentDemoItem: {
        readonly documentDemoItemEdge: {
            readonly node: {
                readonly createdAt: string;
                readonly file: {
                    readonly name: string | null;
                    readonly url: string | null;
                } | null;
            } | null;
        } | null;
    } | null;
};
export type documentsListCreateMutation = {
    readonly response: documentsListCreateMutationResponse;
    readonly variables: documentsListCreateMutationVariables;
};



/*
mutation documentsListCreateMutation(
  $input: CreateDocumentDemoItemMutationInput!
) {
  createDocumentDemoItem(input: $input) {
    documentDemoItemEdge {
      node {
        createdAt
        file {
          name
          url
        }
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "FieldType",
  "kind": "LinkedField",
  "name": "file",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "documentsListCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateDocumentDemoItemMutationPayload",
        "kind": "LinkedField",
        "name": "createDocumentDemoItem",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DocumentDemoItemEdge",
            "kind": "LinkedField",
            "name": "documentDemoItemEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "DocumentDemoItemType",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "ApiMutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "documentsListCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateDocumentDemoItemMutationPayload",
        "kind": "LinkedField",
        "name": "createDocumentDemoItem",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DocumentDemoItemEdge",
            "kind": "LinkedField",
            "name": "documentDemoItemEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "DocumentDemoItemType",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "documentDemoItemEdge",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "25d18c564990c767b29bc6ef20dd189c",
    "id": null,
    "metadata": {},
    "name": "documentsListCreateMutation",
    "operationKind": "mutation",
    "text": "mutation documentsListCreateMutation(\n  $input: CreateDocumentDemoItemMutationInput!\n) {\n  createDocumentDemoItem(input: $input) {\n    documentDemoItemEdge {\n      node {\n        createdAt\n        file {\n          name\n          url\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '61e39efb312c3c795ebb4cba04c35562';
export default node;
