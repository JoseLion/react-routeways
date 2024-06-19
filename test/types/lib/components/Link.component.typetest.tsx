import { expectTypeOf } from "expect-type";
import { JSX } from "react";
import { LinkProps as OriginalLinkProps } from "react-router-dom";
import { Routeway } from "ts-routeways";

import { Link, LinkProps } from "../../../../src/lib/components/Link.component";
import { TestRoutes } from "../../../helpers/routes";

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
