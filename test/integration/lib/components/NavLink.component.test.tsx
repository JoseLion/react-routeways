import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { expectTypeOf, it, suite } from "vitest";

import { NavLink, type NavLinkProps } from "../../../../src/lib/components/NavLink.component";
import { renderWithNav } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

import type { JSX, ReactElement } from "react";
import type { NavLinkProps as OriginalNavLinkProps } from "react-router-dom";
import type { Routeway } from "ts-routeways";

const { home, library } = TestRoutes;

function TestNav(): ReactElement {
  return (
    <nav>
      <NavLink to={home}>{"Go Home"}</NavLink>
      <NavLink to={library} params={{ libId: 1, page: 2, search: "foo" }}>{"Go Library"}</NavLink>
      <NavLink to={library.author} params={{ authorId: 2, libId: 1 }}>{"Go Author"}</NavLink>
      <NavLink to={library.author.book} params={{ authorId: 2, bookId: 3, libId: 1 }}>{"Go Book"}</NavLink>
    </nav>
  );
}

suite("[Integration] NavLink.component.test.tsx", () => {
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

    // @ts-expect-error missing params
    expectTypeOf(<NavLink to={library} />).toEqualTypeOf<JSX.Element>();
    // @ts-expect-error wrong params
    expectTypeOf(<NavLink to={library.author} params={{ libId: 1 }} />).toEqualTypeOf<JSX.Element>();
    // @ts-expect-error wrong nested params
    expectTypeOf(<NavLink to={library.author.book} params={{ authorId: 1, libId: 1 }} />).toEqualTypeOf<JSX.Element>();
  });
});
