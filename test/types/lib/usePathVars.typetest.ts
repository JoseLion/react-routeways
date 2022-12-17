/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";

import { UsePathVars, usePathVars } from "../../../src/lib/usePathVars";
import { TestRoutes } from "../../helpers/routes";

expectTypeOf(usePathVars(TestRoutes.home)).toEqualTypeOf<UsePathVars<Record<never, never>>>();
expectTypeOf(usePathVars(TestRoutes.library)).toEqualTypeOf<UsePathVars<{ libId: number; }>>();
expectTypeOf(usePathVars(TestRoutes.library.author)).toEqualTypeOf<UsePathVars<{
  authorId: number;
  libId: number;
}>>();
expectTypeOf(usePathVars(TestRoutes.library.author.book)).toEqualTypeOf<UsePathVars<{
  authorId: number;
  bookId: number;
  libId: number;
}>>();

// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.home)).toEqualTypeOf<UsePathVars<{ x: number; }>>();
// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.library)).toEqualTypeOf<UsePathVars<Record<never, never>>>();
// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.library.author)).toEqualTypeOf<UsePathVars<{ libId: number; }>>();
// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.library)).toEqualTypeOf<UsePathVars<{ authorId: number; libId: number; }>>();
