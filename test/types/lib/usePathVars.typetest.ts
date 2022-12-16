/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";

import { usePathVars } from "../../../src/lib/usePathVars";
import { TestRoutes } from "../../helpers/routes";

expectTypeOf(usePathVars(TestRoutes.home)).toEqualTypeOf<Record<never, never>>();
expectTypeOf(usePathVars(TestRoutes.library)).toEqualTypeOf<{ libId: number; }>();
expectTypeOf(usePathVars(TestRoutes.library.author)).toEqualTypeOf<{
  authorId: number;
  libId: number;
}>();
expectTypeOf(usePathVars(TestRoutes.library.author.book)).toEqualTypeOf<{
  authorId: number;
  bookId: number;
  libId: number;
}>();

// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.home)).toEqualTypeOf({ x: 1 });
// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.library)).toEqualTypeOf({ });
// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.library.author)).toEqualTypeOf({ libId: 1 });
// @ts-expect-error
expectTypeOf(usePathVars(TestRoutes.library)).toEqualTypeOf({ authorId: 1, libId: 1 });
