import { expectTypeOf } from "expect-type";

import { type UsePathVars, usePathVars } from "../../../../src/lib/hooks/usePathVars.hook";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

expectTypeOf(usePathVars(home)).toEqualTypeOf<UsePathVars<Record<never, never>>>();
expectTypeOf(usePathVars(library)).toEqualTypeOf<UsePathVars<{ libId: number; }>>();
expectTypeOf(usePathVars(library.author)).toEqualTypeOf<UsePathVars<{
  authorId: number;
  libId: number;
}>>();
expectTypeOf(usePathVars(library.author.book)).toEqualTypeOf<UsePathVars<{
  authorId: number;
  bookId: number;
  libId: number;
}>>();

// @ts-expect-error
expectTypeOf(usePathVars(home)).toEqualTypeOf<UsePathVars<{ x: number; }>>();
// @ts-expect-error
expectTypeOf(usePathVars(library)).toEqualTypeOf<UsePathVars<Record<never, never>>>();
// @ts-expect-error
expectTypeOf(usePathVars(library.author)).toEqualTypeOf<UsePathVars<{ libId: number; }>>();
// @ts-expect-error
expectTypeOf(usePathVars(library)).toEqualTypeOf<UsePathVars<{ authorId: number; libId: number; }>>();
