/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectTypeOf } from "expect-type";
import { NavLinkProps as OriginalNavLinkProps } from "react-router-dom";
import { Routeway } from "ts-routeways";

import { NavLink, NavLinkProps } from "../../../../src/lib/components/NavLink.component";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

expectTypeOf<Omit<NavLinkProps<Routeway>, "to">>().toMatchTypeOf<Omit<OriginalNavLinkProps, "to">>();

expectTypeOf(<NavLink to={home}>{"..."}</NavLink>).toEqualTypeOf<JSX.Element>();
expectTypeOf(<NavLink to={library} params={{ libId: 1, page: 1 }}>{"..."}</NavLink>).toEqualTypeOf<JSX.Element>();
expectTypeOf(
  <NavLink
    to={library.author}
    params={{ authorId: 1, libId: 1 }}
  >
      {"..."}
  </NavLink>,
)
.toEqualTypeOf<JSX.Element>();
expectTypeOf(
  <NavLink
    to={library.author.book}
    params={{ authorId: 1, bookId: 1, libId: 1 }}
  >
    {"..."}
  </NavLink>,
)
.toEqualTypeOf<JSX.Element>();

// @ts-expect-error
expectTypeOf(<NavLink to={library} />).toEqualTypeOf<JSX.Element>();
// @ts-expect-error
expectTypeOf(<NavLink to={library.author} params={{ libId: 1 }} />).toEqualTypeOf<JSX.Element>();
// @ts-expect-error
expectTypeOf(<NavLink to={library.author.book} params={{ authorId: 1, libId: 1 }} />).toEqualTypeOf<JSX.Element>();
