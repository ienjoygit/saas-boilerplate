/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type DeleteCrudDemoItemMutationInput = {
    id?: string | null;
    clientMutationId?: string | null;
};
export type crudDemoItemListItemDeleteMutationVariables = {
    input: DeleteCrudDemoItemMutationInput;
    connections: Array<string>;
};
export type crudDemoItemListItemDeleteMutationResponse = {
    readonly deleteCrudDemoItem: {
        readonly deletedIds: ReadonlyArray<string | null> | null;
    } | null;
};
export type crudDemoItemListItemDeleteMutation = {
    readonly response: crudDemoItemListItemDeleteMutationResponse;
    readonly variables: crudDemoItemListItemDeleteMutationVariables;
};



/*
mutation crudDemoItemListItemDeleteMutation(
  $input: DeleteCrudDemoItemMutationInput!
) {
  deleteCrudDemoItem(input: $input) {
    deletedIds
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
  "name": "deletedIds",
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
    "name": "crudDemoItemListItemDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteCrudDemoItemMutationPayload",
        "kind": "LinkedField",
        "name": "deleteCrudDemoItem",
        "plural": false,
        "selections": [
          (v3/*: any*/)
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
    "name": "crudDemoItemListItemDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteCrudDemoItemMutationPayload",
        "kind": "LinkedField",
        "name": "deleteCrudDemoItem",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedIds",
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
    "cacheID": "d54379ea3fcdb05533ddbdb9df4a022c",
    "id": null,
    "metadata": {},
    "name": "crudDemoItemListItemDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation crudDemoItemListItemDeleteMutation(\n  $input: DeleteCrudDemoItemMutationInput!\n) {\n  deleteCrudDemoItem(input: $input) {\n    deletedIds\n  }\n}\n"
  }
};
})();
(node as any).hash = '532725e3a1a057cbb00ec31b97faeeb9';
export default node;
