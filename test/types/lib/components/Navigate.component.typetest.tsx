import { expectTypeOf } from "expect-type";
import { JSX } from "react";
import { NavigateProps as OriginalnavigateProps } from "react-router-dom";
import { Routeway } from "ts-routeways";

import { Navigate, NavigateProps } from "../../../../src/lib/components/Navigate.component";
import { TestRoutes } from "../../../helpers/routes";

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
