import { expectTypeOf, it, suite } from "vitest";

import { type UseRouteParams, useRouteParams } from "../../../../src/lib/hooks/useRouteParams.hook";
import { TestRoutes } from "../../../helpers/routes";

import type { Codec, CodecMap, RouteParams } from "ts-routeways";

const { home, library } = TestRoutes;

suite("[Integration] useRouteParams.hook.test.tsx", () => {
  it.fails("defines the proper types", () => {
    expectTypeOf(useRouteParams(home)).toEqualTypeOf<
      UseRouteParams<
        RouteParams<
          Record<never, Codec<unknown>>,
          CodecMap
        >
      >
    >();
    expectTypeOf(useRouteParams(library)).toEqualTypeOf<
      UseRouteParams<
        RouteParams<
          { libId: Codec<number>; },
          { page: Codec<number>; search: Codec<string>; }
        >
      >
    >();
    expectTypeOf(useRouteParams(library.author)).toEqualTypeOf<
      UseRouteParams<
        RouteParams<
        { authorId: Codec<number>; libId: Codec<number>; },
        CodecMap
        >
      >
    >();
    expectTypeOf(useRouteParams(library.author.book)).toEqualTypeOf<
      UseRouteParams<
        RouteParams<
          {
            authorId: Codec<number>;
            bookId: Codec<number>;
            libId: Codec<number>;
          },
          CodecMap
        >
      >
    >();

    expectTypeOf(useRouteParams(home)).not.toEqualTypeOf<
      UseRouteParams<
        RouteParams<
          { foo: Codec<string>; },
          CodecMap
        >
      >
    >();
    expectTypeOf(useRouteParams(library)).not.toEqualTypeOf<
      UseRouteParams<
        RouteParams<
          { page: Codec<number>; },
          { search: Codec<string>; }
        >
      >
    >();
    expectTypeOf(useRouteParams(library.author)).not.toEqualTypeOf<
      UseRouteParams<
        RouteParams<
          { libId: Codec<number>; },
          { page: Codec<number>; }
        >
      >
    >();
    expectTypeOf(useRouteParams(library.author.book)).not.toEqualTypeOf<
      UseRouteParams<
        RouteParams<
          { authorId: Codec<number>; libId: Codec<number>; },
          { search: Codec<string>; }
        >
      >
    >();
  });
});
