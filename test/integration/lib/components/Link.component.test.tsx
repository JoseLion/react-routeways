import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { expectTypeOf, it, suite } from "vitest";

import { Link, type LinkProps } from "../../../../src/lib/components/Link.component";
import { renderWithNav } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

import type { JSX, ReactElement } from "react";
import type { LinkProps as OriginalLinkProps } from "react-router-dom";
import type { Routeway } from "ts-routeways";

const { home, library } = TestRoutes;

function TestNav(): ReactElement {
  return (
    <nav>
      <Link to={home}>{"Go Home"}</Link>
      <Link to={library} params={{ libId: 1, page: 2, search: "foo" }}>{"Go Library"}</Link>
      <Link to={library.author} params={{ authorId: 2, libId: 1 }}>{"Go Author"}</Link>
      <Link to={library.author.book} params={{ authorId: 2, bookId: 3, libId: 1 }}>{"Go Book"}</Link>
    </nav>
  );
}

suite("[Integration] Link.component.test.tsx", () => {
  it("navigates to the route's url", async () => {
    const { getByRole, getByText } = renderWithNav(<TestNav />);

    await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));

    await userEvent.click(getByText("Go Library"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Library" }));

    await userEvent.click(getByText("Go Author"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Author" }));

    await userEvent.click(getByText("Go Book"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Book" }));

    await userEvent.click(getByText("Go Home"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));
  });

  it("defines the proper types", () => {
    expectTypeOf<Omit<LinkProps<Routeway>, "to">>().toMatchTypeOf<Omit<OriginalLinkProps, "to">>();
    expectTypeOf(<Link to={home}>{"..."}</Link>).toEqualTypeOf<JSX.Element>();
    expectTypeOf(<Link to={library} params={{ libId: 1, page: 1 }}>{"..."}</Link>).toEqualTypeOf<JSX.Element>();
    expectTypeOf(
      <Link
        to={library.author}
        params={{ authorId: 1, libId: 1 }}
      >
        {"..."}
      </Link>,
    )
    .toEqualTypeOf<JSX.Element>();
    expectTypeOf(
      <Link
        to={library.author.book}
        params={{ authorId: 1, bookId: 1, libId: 1 }}
      >
        {"..."}
      </Link>,
    )
    .toEqualTypeOf<JSX.Element>();

    // @ts-expect-error missing param
    expectTypeOf(<Link to={library} />);
    // @ts-expect-error wrong param
    expectTypeOf(<Link to={library.author} params={{ libId: 1 }} />);
    // @ts-expect-error wrong nested param
    expectTypeOf(<Link to={library.author.book} params={{ authorId: 1, libId: 1 }} />);
  });
});
