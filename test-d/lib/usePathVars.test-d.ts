/* eslint-disable react-hooks/rules-of-hooks */
import { expectAssignable } from "tsd";

import { usePathVars } from "../../src/lib/usePathVars";
import { TestRoutes } from "../../test/helpers/routes";

expectAssignable<Record<never, unknown>>(usePathVars(TestRoutes.home));
expectAssignable<{ libId: number; }>(usePathVars(TestRoutes.library));
expectAssignable<{ authorId: number; libId: number; }>(usePathVars(TestRoutes.library.author));
expectAssignable<{ authorId: number; bookId: number; libId: number; }>(usePathVars(TestRoutes.library.author.book));
