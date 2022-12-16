/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectTypeOf } from "expect-type";

import { useNavigation } from "../../../src/lib/useNavigation";
import { TestRoutes } from "../../helpers/routes";

const { goTo, navigate, reset, resetTo } = useNavigation();

expectTypeOf(goTo(TestRoutes.home)).toEqualTypeOf<() => void>();
expectTypeOf(goTo(TestRoutes.library, { libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(goTo(TestRoutes.library.author, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(goTo(TestRoutes.library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(goTo(TestRoutes.library)).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(goTo(TestRoutes.library.author, { libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(goTo(TestRoutes.library.author.book, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();

expectTypeOf(navigate(TestRoutes.home)).toBeVoid();
expectTypeOf(navigate(TestRoutes.library, { libId: 1 })).toBeVoid();
expectTypeOf(navigate(TestRoutes.library.author, { authorId: 1, libId: 1 })).toBeVoid();
expectTypeOf(navigate(TestRoutes.library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(navigate(TestRoutes.library)).toBeVoid();
// @ts-expect-error
expectTypeOf(navigate(TestRoutes.library.author, { libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(navigate(TestRoutes.library.author.book, { authorId: 1, libId: 1 })).toBeVoid();

expectTypeOf(reset(TestRoutes.home)).toBeVoid();
expectTypeOf(reset(TestRoutes.library, { libId: 1 })).toBeVoid();
expectTypeOf(reset(TestRoutes.library.author, { authorId: 1, libId: 1 })).toBeVoid();
expectTypeOf(reset(TestRoutes.library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(reset(TestRoutes.library)).toBeVoid();
// @ts-expect-error
expectTypeOf(reset(TestRoutes.library.author, { libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(reset(TestRoutes.library.author.book, { authorId: 1, libId: 1 })).toBeVoid();

expectTypeOf(resetTo(TestRoutes.home)).toEqualTypeOf<() => void>();
expectTypeOf(resetTo(TestRoutes.library, { libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(resetTo(TestRoutes.library.author, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(resetTo(TestRoutes.library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(resetTo(TestRoutes.library)).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(resetTo(TestRoutes.library.author, { libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(resetTo(TestRoutes.library.author.book, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();

