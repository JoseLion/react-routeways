/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";
import { Codec, CodecMap, RouteParams } from "ts-routeways";

import { UseRouteParams, useRouteParams } from "../../../../src/lib/hooks/useRouteParams.hook";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

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

// @ts-expect-error
expectTypeOf(useRouteParams(home)).toEqualTypeOf<
  UseRouteParams<
    RouteParams<
      { foo: Codec<string>; },
      CodecMap
    >
  >
>();
// @ts-expect-error
expectTypeOf(useRouteParams(library)).toEqualTypeOf<
  UseRouteParams<
    RouteParams<
      { page: Codec<number>; },
      { search: Codec<string>; }
    >
  >
>();
// @ts-expect-error
expectTypeOf(useRouteParams(library.author)).toEqualTypeOf<
  UseRouteParams<
    RouteParams<
      { libId: Codec<number>; },
      { page: Codec<number>; }
    >
  >
>();
// @ts-expect-error
expectTypeOf(useRouteParams(library.author.book)).toEqualTypeOf<
  UseRouteParams<
    RouteParams<
      { authorId: Codec<number>; libId: Codec<number>; },
      { search: Codec<string>; }
    >
  >
>();
