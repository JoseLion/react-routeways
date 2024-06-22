import { expectTypeOf } from "expect-type";

import { Link, type LinkProps } from "../../../../src/lib/components/Link.component";
import { TestRoutes } from "../../../helpers/routes";

import type { JSX } from "react";
import type { LinkProps as OriginalLinkProps } from "react-router-dom";
import type { Routeway } from "ts-routeways";

const { home, library } = TestRoutes;

expectTypeOf<Omit<LinkProps<Routeway>, "to">>().toMatchTypeOf<Omit<OriginalLinkProps, "to">>();

expectTypeOf(<Link to={home}>{"..."}</Link>).toEqualTypeOf<JSX.Element>();
expectTypeOf(<Link to={library} params={{ libId: 1, page: 1 }}>{"..."}</Link>).toEqualTypeOf<JSX.Element>();
expectTypeOf(<Link to={library.author} params={{ authorId: 1, libId: 1 }}>{"..."}</Link>).toEqualTypeOf<JSX.Element>();
expectTypeOf(
  <Link
    to={library.author.book}
    params={{ authorId: 1, bookId: 1, libId: 1 }}
  >
    {"..."}
  </Link>,
)
.toEqualTypeOf<JSX.Element>();

// @ts-expect-error
expectTypeOf(<Link to={library} />).toEqualTypeOf<JSX.Element>();
// @ts-expect-error
expectTypeOf(<Link to={library.author} params={{ libId: 1 }} />).toEqualTypeOf<JSX.Element>();
// @ts-expect-error
expectTypeOf(<Link to={library.author.book} params={{ authorId: 1, libId: 1 }} />).toEqualTypeOf<JSX.Element>();
