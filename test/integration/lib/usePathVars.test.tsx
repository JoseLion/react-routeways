import { waitFor } from "@testing-library/react";
import { ReactElement } from "react";

import { usePathVars } from "../../../src/lib/usePathVars";
import { renderWithRouter } from "../../helpers/renderWith";
import { TestRoutes } from "../../helpers/routes";

function TestComp(): ReactElement {
  const { authorId, bookId, libId } = usePathVars(TestRoutes.library.author.book);

  return (
    <div>
      <h1>{`Library: ${libId}`}</h1>
      <h1>{`Book: ${bookId}`}</h1>
      <h1>{`Author: ${authorId}`}</h1>
    </div>
  );
}

describe("[Integration] usePathVars.test.ts", () => {
  context("when the route is parsed", () => {
    it("returns the path variables of the route", async () => {
      const url = TestRoutes.library.author.book.makeUrl({ authorId: 1, bookId: 2, libId: 3 });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Library: 3" });
        getByRole("heading", { level: 1, name: "Book: 2" });
        getByRole("heading", { level: 1, name: "Author: 1" });
      });
    });
  });
});
