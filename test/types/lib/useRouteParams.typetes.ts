/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";

import { UseRouteParams, useRouteParams } from "../../../src/lib/useRouteParams";
import { TestRoutes } from "../../helpers/routes";

const { home, library } = TestRoutes;

expectTypeOf(useRouteParams(home)).toEqualTypeOf<UseRouteParams<Record<never, never>>>();
expectTypeOf(useRouteParams(library)).toEqualTypeOf<UseRouteParams<{
  libId: number;
  page?: number;
  search?: string;
}>>();
expectTypeOf(useRouteParams(library.author)).toEqualTypeOf<UseRouteParams<{
  authorId: number;
  libId: number;
}>>();
expectTypeOf(useRouteParams(library.author.book)).toEqualTypeOf<UseRouteParams<{
  authorId: number;
  bookId: number;
  libId: number;
}>>();

// @ts-expect-error
expectTypeOf(useRouteParams(home)).toEqualTypeOf<UseRouteParams<{ foo: string; }>>();
// @ts-expect-error
expectTypeOf(useRouteParams(library)).toEqualTypeOf<UseRouteParams<{
  page: number;
  search: string;
}>>();
// @ts-expect-error
expectTypeOf(useRouteParams(library.author)).toEqualTypeOf<UseRouteParams<{
  libId: number;
  page: number;
}>>();
// @ts-expect-error
expectTypeOf(useRouteParams(library.author.book)).toEqualTypeOf<UseRouteParams<{
  authorId: number;
  libId: number;
  search: string;
}>>();
