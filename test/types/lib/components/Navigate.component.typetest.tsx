import { expectTypeOf } from "expect-type";

import { Navigate, type NavigateProps } from "../../../../src/lib/components/Navigate.component";
import { TestRoutes } from "../../../helpers/routes";

import type { JSX } from "react";
import type { NavigateProps as OriginalnavigateProps } from "react-router-dom";
import type { Routeway } from "ts-routeways";

const { home, library } = TestRoutes;

expectTypeOf<Omit<NavigateProps<Routeway>, "to">>().toMatchTypeOf<Omit<OriginalnavigateProps, "to">>();

expectTypeOf(<Navigate to={home} />).toEqualTypeOf<JSX.Element>();
expectTypeOf(<Navigate to={library} params={{ libId: 1, page: 1 }} />).toEqualTypeOf<JSX.Element>();
expectTypeOf(<Navigate to={library.author} params={{ authorId: 1, libId: 1 }} />).toEqualTypeOf<JSX.Element>();
expectTypeOf(
  <Navigate
    to={library.author.book}
    params={{ authorId: 1, bookId: 1, libId: 1 }}
  />,
)
.toEqualTypeOf<JSX.Element>();

// @ts-expect-error
expectTypeOf(<Navigate to={library} />).toEqualTypeOf<JSX.Element>();
// @ts-expect-error
expectTypeOf(<Navigate to={library.author} params={{ libId: 1 }} />).toEqualTypeOf<JSX.Element>();
// @ts-expect-error
expectTypeOf(<Navigate to={library.author.book} params={{ authorId: 1, libId: 1 }} />).toEqualTypeOf<JSX.Element>();
