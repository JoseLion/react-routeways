import { expect } from "@assertive-ts/core";
import { waitFor } from "@testing-library/dom";
import { describe, expectTypeOf, it, suite } from "vitest";

import { Navigate, type NavigateProps } from "../../../../src/lib/components/Navigate.component";
import { renderWithNav } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

import type { JSX } from "react";
import type { NavigateProps as OriginalnavigateProps } from "react-router-dom";
import type { Routeway } from "ts-routeways";

const { home, library } = TestRoutes;

suite("[Integration] Navigate.component.test.tsx", () => {
  describe.each([
    [
      "Home",
      <Navigate key={0} to={home} />,
      "http://localhost:3000/home",
    ], [
      "Library",
      <Navigate key={1} to={library} params={{ libId: 1, page: 3, search: "foo" }} />,
      "http://localhost:3000/library/1?page=3&search=foo",
    ], [
      "Author",
      <Navigate key={2} to={library.author} params={{ authorId: 2, libId: 1 }} />,
      "http://localhost:3000/library/1/author/2",
    ], [
      "Book",
      <Navigate key={3} to={library.author.book} params={{ authorId: 2, bookId: 3, libId: 1 }} />,
      "http://localhost:3000/library/1/author/2/book/3",
    ],
  ])("when the route is set for %s", (title, NotFound, href) => {
    it(`navigates to ${title}`, async () => {
      const { getByRole } = renderWithNav(<></>, { NotFound, url: "/" });

      await waitFor(() => getByRole("heading", { name: title }));

      expect(window.location.href).toBeEqual(href);
    });
  });

  it("defines the proper types", () => {
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

    // @ts-expect-error missing params
    expectTypeOf(<Navigate to={library} />);
    // @ts-expect-error wrong params
    expectTypeOf(<Navigate to={library.author} params={{ libId: 1 }} />);
    // @ts-expect-error wrong nested params
    expectTypeOf(<Navigate to={library.author.book} params={{ authorId: 1, libId: 1 }} />);
  });
});
