import { expect } from "@assertive-ts/core";
import { waitFor } from "@testing-library/dom";

import { Navigate } from "../../../../src/lib/components/Navigate.component";
import { renderWithNav } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

describe("[Integration] Navigate.component.test.tsx", () => {
  const variants = [[
    "Home",
    <Navigate key={0} to={home} />,
    "http://localhost/home",
  ], [
    "Library",
    <Navigate key={1} to={library} params={{ libId: 1, page: 3, search: "foo" }} />,
    "http://localhost/library/1?page=3&search=foo",
  ], [
    "Author",
    <Navigate key={2} to={library.author} params={{ authorId: 2, libId: 1 }} />,
    "http://localhost/library/1/author/2",
  ], [
    "Book",
    <Navigate key={3} to={library.author.book} params={{ authorId: 2, bookId: 3, libId: 1 }} />,
    "http://localhost/library/1/author/2/book/3",
  ]] as const;

  variants.forEach(([title, NotFound, href]) => {
    context(`when the route is set for ${title}`, () => {
      it(`navigates to ${title}`, async () => {
        const { getByRole } = renderWithNav(<></>, { NotFound, url: "/" });

        await waitFor(() => getByRole("heading", { name: title }));

        expect(window.location.href).toBeEqual(href);
      });
    });
  });
});
