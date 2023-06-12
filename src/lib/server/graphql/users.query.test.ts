import type { UserProfileEdge } from "lib/types";
import { describe, expect, test } from "vitest";
import { handleUsersQuery } from "./users.query";

const mockUsers = [
  {
    id: 1,
    name: "Mignon Baxendale",
    avatar: "https://robohash.org/adsaepeofficiis.png?size=75x75&set=set1",
    email: "mbaxendale0@ibm.com"
  },
  {
    id: 2,
    name: "Kyla Marde",
    avatar: "https://robohash.org/voluptatumsitdolore.png?size=75x75&set=set1",
    email: "kmarde1@ycombinator.com"
  },
  {
    id: 3,
    name: "Kendre Shouler",
    avatar: "https://robohash.org/erroriustoest.png?size=75x75&set=set1",
    email: "kshouler2@uiuc.edu"
  },
  {
    id: 4,
    name: "Milzie Forcade",
    avatar: "https://robohash.org/aperiametdeserunt.png?size=75x75&set=set1",
    email: "mforcade3@toplist.cz"
  },
  {
    id: 5,
    name: "Sheela Bart",
    avatar: "https://robohash.org/rationedelenitiquia.png?size=75x75&set=set1",
    email: "sbart4@de.vu"
  },
  {
    id: 6,
    name: "Sean Elton",
    avatar: "https://robohash.org/aliasdeseruntdolores.png?size=75x75&set=set1",
    email: "selton5@guardian.co.uk"
  },
  {
    id: 7,
    name: "Ebba Lowth",
    avatar: "https://robohash.org/placeatdoloruma.png?size=75x75&set=set1",
    email: "elowth6@parallels.com"
  },
  {
    id: 8,
    name: "Onfre Lynes",
    avatar:
      "https://robohash.org/quosperferendisconsequuntur.png?size=75x75&set=set1",
    email: "olynes7@chronoengine.com"
  },
  {
    id: 9,
    name: "Jonie Pettwood",
    avatar: "https://robohash.org/eosvoluptatesunde.png?size=75x75&set=set1",
    email: "jpettwood8@slate.com"
  },
  {
    id: 10,
    name: "Deloris Pattison",
    avatar: "https://robohash.org/quiseditaque.png?size=75x75&set=set1",
    email: "dpattison9@vkontakte.ru"
  },
  {
    id: 11,
    name: "Town Brandino",
    avatar:
      "https://robohash.org/sequievenietconsequatur.png?size=75x75&set=set1",
    email: "tbrandinoa@etsy.com"
  }
];
const mockUserEdges: UserProfileEdge[] = mockUsers.map((user) => ({
  cursor: user.id.toString(),
  node: {
    ...user,
    id: user.id.toString()
  }
}));

describe("handleUsersQuery", () => {
  // Pagination algorithm: supplying first & last together is discouraged
  // https://relay.dev/graphql/connections.htm#note-a97ec
  test("should not include both 'first' and 'last' args", () => {
    expect(() => handleUsersQuery([], { first: 10, last: 10 })).toThrowError();
  });

  test("should not include both 'before' and 'after' args", () => {
    expect(() =>
      handleUsersQuery([], { before: "b", after: "a" })
    ).toThrowError();
  });

  describe("Forward pagination", () => {
    test("should throw error if argument 'first' is not a non-negative integer", () => {
      expect(() => handleUsersQuery([], { first: -1 })).toThrowError();
      expect(() => handleUsersQuery([], { first: 0 })).not.toThrowError();
      expect(() => handleUsersQuery([], { first: 1 })).not.toThrowError();
    });

    test("should return the first n elements from the list", () => {
      const expected = [
        {
          id: "1",
          name: "Mignon Baxendale",
          avatar:
            "https://robohash.org/adsaepeofficiis.png?size=75x75&set=set1",
          email: "mbaxendale0@ibm.com"
        },
        {
          id: "2",
          name: "Kyla Marde",
          avatar:
            "https://robohash.org/voluptatumsitdolore.png?size=75x75&set=set1",
          email: "kmarde1@ycombinator.com"
        }
      ];
      const connection = handleUsersQuery(mockUserEdges, { first: 2 });
      const edges = connection.edges;

      expect(edges.length).toBe(2);
      expect(edges[0].node).toEqual(expected[0]);
      expect(edges[1].node).toEqual(expected[1]);
    });

    test("should have next page if there are more elements to query", () => {
      const connection = handleUsersQuery(mockUserEdges, { first: 5 });
      const pageInfo = connection.pageInfo;

      expect(pageInfo.hasNextPage).toBeTruthy();
    });

    test("should not have next page if there are no more elements to query", () => {
      const connection = handleUsersQuery(mockUserEdges, { first: 11 });
      const pageInfo = connection.pageInfo;

      expect(pageInfo.hasNextPage).toBeFalsy();
    });
  });

  describe("Backward pagination", () => {
    test("should throw error if argument 'last' is not a non-negative integer", () => {
      expect(() => handleUsersQuery([], { last: -1 })).toThrowError();
      expect(() => handleUsersQuery([], { last: 0 })).not.toThrowError();
      expect(() => handleUsersQuery([], { last: 1 })).not.toThrowError();
    });

    test("should return the last n elements from the list", () => {
      const expected = [
        {
          id: "10",
          name: "Deloris Pattison",
          avatar: "https://robohash.org/quiseditaque.png?size=75x75&set=set1",
          email: "dpattison9@vkontakte.ru"
        },
        {
          id: "11",
          name: "Town Brandino",
          avatar:
            "https://robohash.org/sequievenietconsequatur.png?size=75x75&set=set1",
          email: "tbrandinoa@etsy.com"
        }
      ];
      const connection = handleUsersQuery(mockUserEdges, { last: 2 });
      const edges = connection.edges;

      expect(edges.length).toBe(2);
      expect(edges[0].node).toEqual(expected[0]);
      expect(edges[1].node).toEqual(expected[1]);
    });

    test("should have next page if there are more elements to query", () => {
      const connection = handleUsersQuery(mockUserEdges, {
        last: 5,
        before: "90"
      });
      const pageInfo = connection.pageInfo;

      expect(pageInfo.hasNextPage).toBeTruthy();
    });

    test("should not have next page if there are no more elements to query", () => {
      const connection = handleUsersQuery(mockUserEdges, { last: 11 });
      const pageInfo = connection.pageInfo;

      expect(pageInfo.hasNextPage).toBeFalsy();
    });
  });

  describe("Default pagination", () => {
    test("should return the first 10 elements from the list", () => {
      const expected = [
        {
          id: "1",
          name: "Mignon Baxendale",
          avatar:
            "https://robohash.org/adsaepeofficiis.png?size=75x75&set=set1",
          email: "mbaxendale0@ibm.com"
        },
        {
          id: "2",
          name: "Kyla Marde",
          avatar:
            "https://robohash.org/voluptatumsitdolore.png?size=75x75&set=set1",
          email: "kmarde1@ycombinator.com"
        },
        {
          id: "3",
          name: "Kendre Shouler",
          avatar: "https://robohash.org/erroriustoest.png?size=75x75&set=set1",
          email: "kshouler2@uiuc.edu"
        },
        {
          id: "4",
          name: "Milzie Forcade",
          avatar:
            "https://robohash.org/aperiametdeserunt.png?size=75x75&set=set1",
          email: "mforcade3@toplist.cz"
        },
        {
          id: "5",
          name: "Sheela Bart",
          avatar:
            "https://robohash.org/rationedelenitiquia.png?size=75x75&set=set1",
          email: "sbart4@de.vu"
        },
        {
          id: "6",
          name: "Sean Elton",
          avatar:
            "https://robohash.org/aliasdeseruntdolores.png?size=75x75&set=set1",
          email: "selton5@guardian.co.uk"
        },
        {
          id: "7",
          name: "Ebba Lowth",
          avatar:
            "https://robohash.org/placeatdoloruma.png?size=75x75&set=set1",
          email: "elowth6@parallels.com"
        },
        {
          id: "8",
          name: "Onfre Lynes",
          avatar:
            "https://robohash.org/quosperferendisconsequuntur.png?size=75x75&set=set1",
          email: "olynes7@chronoengine.com"
        },
        {
          id: "9",
          name: "Jonie Pettwood",
          avatar:
            "https://robohash.org/eosvoluptatesunde.png?size=75x75&set=set1",
          email: "jpettwood8@slate.com"
        },
        {
          id: "10",
          name: "Deloris Pattison",
          avatar: "https://robohash.org/quiseditaque.png?size=75x75&set=set1",
          email: "dpattison9@vkontakte.ru"
        }
      ];
      const connection = handleUsersQuery(mockUserEdges, {});
      const edges = connection.edges;

      expect(edges.length).toBe(10);
      expect(edges[0].node).toEqual(expected[0]);
      expect(edges[9].node).toEqual(expected[9]);
    });
  });
});
