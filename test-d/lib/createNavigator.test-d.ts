/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectAssignable, expectType } from "tsd";

import { createNavigator, NavigatorHook } from "../../src/lib/createNavigator";
import { TestRoutes } from "../../test/helpers/routes";

const useNavigator = createNavigator(TestRoutes);

const { home, library } = useNavigator();

expectType<() => NavigatorHook<typeof TestRoutes>>(useNavigator);

expectType<NavigatorHook<typeof TestRoutes>["home"]>(home);
expectType<NavigatorHook<typeof TestRoutes>["library"]>(library);
expectType<NavigatorHook<typeof TestRoutes>["library"]["author"]>(library.author);
expectType<NavigatorHook<typeof TestRoutes>["library"]["author"]["book"]>(library.author.book);

expectAssignable<() => void>(home.navigate);
expectAssignable<(params: { libId: number; }) => void>(library.navigate);
expectAssignable<(params: { authorId: number; libId: number; }) => void>(library.author.navigate);
expectAssignable<(params: { authorId: number; bookId: number; libId: number; }) => void>(library.author.book.navigate);

expectAssignable<() => void>(home.reset);
expectAssignable<(params: { libId: number; }) => void>(library.reset);
expectAssignable<(params: { authorId: number; libId: number; }) => void>(library.author.reset);
expectAssignable<(params: { authorId: number; bookId: number; libId: number; }) => void>(library.author.book.reset);
