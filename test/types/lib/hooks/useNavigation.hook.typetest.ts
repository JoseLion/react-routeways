/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectTypeOf } from "expect-type";

import { useNavigation } from "../../../../src/lib/hooks/useNavigation.hook";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

const { goTo, navigate, reset, resetTo } = useNavigation();

expectTypeOf(goTo(home)).toEqualTypeOf<() => void>();
expectTypeOf(goTo(library, { libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(goTo(library.author, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(goTo(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(goTo(library)).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(goTo(library.author, { libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(goTo(library.author.book, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();

expectTypeOf(navigate(home)).toBeVoid();
expectTypeOf(navigate(library, { libId: 1 })).toBeVoid();
expectTypeOf(navigate(library.author, { authorId: 1, libId: 1 })).toBeVoid();
expectTypeOf(navigate(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(navigate(library)).toBeVoid();
// @ts-expect-error
expectTypeOf(navigate(library.author, { libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(navigate(library.author.book, { authorId: 1, libId: 1 })).toBeVoid();

expectTypeOf(reset(home)).toBeVoid();
expectTypeOf(reset(library, { libId: 1 })).toBeVoid();
expectTypeOf(reset(library.author, { authorId: 1, libId: 1 })).toBeVoid();
expectTypeOf(reset(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(reset(library)).toBeVoid();
// @ts-expect-error
expectTypeOf(reset(library.author, { libId: 1 })).toBeVoid();
// @ts-expect-error
expectTypeOf(reset(library.author.book, { authorId: 1, libId: 1 })).toBeVoid();

expectTypeOf(resetTo(home)).toEqualTypeOf<() => void>();
expectTypeOf(resetTo(library, { libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(resetTo(library.author, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();
expectTypeOf(resetTo(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(resetTo(library)).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(resetTo(library.author, { libId: 1 })).toEqualTypeOf<() => void>();
// @ts-expect-error
expectTypeOf(resetTo(library.author.book, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();

