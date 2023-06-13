import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { parse } from "graphql";
import { describe, expect, test } from "vitest";
import { GET } from "../../../routes/graphql/+server";

const executor = buildHTTPExecutor({
  fetch: GET.fetch
});

const makeIntrospectionQuery = async (typeName: string) =>
  await executor({
    document: parse(`
    query {
      __type(name: "${typeName}") {
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `)
  });

const connectionIntrospection = await makeIntrospectionQuery(
  "UserProfileConnection"
);
const edgeIntrospection = await makeIntrospectionQuery("UserProfileEdge");

describe("UserProfileConnection", () => {
  describe("introspection query", () => {
    test("should return the proper response", () => {
      const json = (connectionIntrospection as any).data;

      expect(json.__type).toBeDefined();
      expect(json.__type.fields).toBeDefined();

      const fields = json.__type.fields as Array<any>;
      const expectedPageInfo = {
        name: "pageInfo",
        type: {
          name: null,
          kind: "NON_NULL",
          ofType: {
            name: "PageInfo",
            kind: "OBJECT"
          }
        }
      };

      expect(
        fields.some(
          (field) => JSON.stringify(field) === JSON.stringify(expectedPageInfo)
        )
      ).toBeTruthy();

      const expectedEdges = {
        name: "edges",
        type: {
          name: null,
          kind: "LIST",
          ofType: {
            name: "UserProfileEdge",
            kind: "OBJECT"
          }
        }
      };

      expect(
        fields.some(
          (field) => JSON.stringify(field) === JSON.stringify(expectedEdges)
        )
      ).toBeTruthy();
    });
  });
});

describe("UserProfileEdge", () => {
  describe("introspection query", () => {
    test("should return the proper response", () => {
      const json = (edgeIntrospection as any).data;

      expect(json.__type).toBeDefined();
      expect(json.__type.fields).toBeDefined();

      const fields = json.__type.fields as Array<any>;
      const expectedCursor = {
        name: "cursor",
        type: {
          name: null,
          kind: "NON_NULL",
          ofType: {
            name: "String",
            kind: "SCALAR"
          }
        }
      };

      expect(
        fields.some(
          (field) => JSON.stringify(field) === JSON.stringify(expectedCursor)
        )
      ).toBeTruthy();

      const expectedNode = {
        name: "node",
        type: {
          name: "User",
          kind: "OBJECT",
          ofType: null
        }
      };

      expect(
        fields.some(
          (field) => JSON.stringify(field) === JSON.stringify(expectedNode)
        )
      ).toBeTruthy();
    });
  });
});
