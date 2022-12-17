import { waitFor } from "@testing-library/react";
import { ReactElement, useCallback } from "react";
import userEvent from "@testing-library/user-event";
import { expect } from "@stackbuilders/assertive-ts";

import { usePathVars } from "../../../src/lib/usePathVars";
import { renderWithRouter } from "../../helpers/renderWith";
import { TestRoutes } from "../../helpers/routes";

function TestComp(): ReactElement {
  const [pathVars, setPathVars] = usePathVars(TestRoutes.library.author.book);

  const changeBook = useCallback((): void => {
    setPathVars(prev => ({ ...prev, bookId: 5 }));
  }, []);

  return (
    <div>
      <h1>{`Library: ${pathVars.libId}`}</h1>
      <h1>{`Author: ${pathVars.authorId}`}</h1>
      <h1>{`Book: ${pathVars.bookId}`}</h1>

      <button onClick={changeBook}>{"Change Book"}</button>
    </div>
  );
}

describe("[Integration] usePathVars.test.ts", () => {
  context("when path var state is used", () => {
    it("parses the url to get the values", async () => {
      const url = TestRoutes.library.author.book.makeUrl({ authorId: 1, bookId: 2, libId: 3 });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Library: 3" });
        getByRole("heading", { level: 1, name: "Author: 1" });
        getByRole("heading", { level: 1, name: "Book: 2" });
      });
    });
  });

  context("when a path variable is changed", () => {
    it("updates it state and navigates to the new url", async () => {
      const url = TestRoutes.library.author.book.makeUrl({ authorId: 1, bookId: 2, libId: 3 });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Library: 3" });
        getByRole("heading", { level: 1, name: "Author: 1" });
        getByRole("heading", { level: 1, name: "Book: 2" });
      });

      await userEvent.click(getByRole("button", { name: "Change Book" }));

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Library: 3" });
        getByRole("heading", { level: 1, name: "Author: 1" });
        getByRole("heading", { level: 1, name: "Book: 5" });
      });

      expect(window.location.pathname).toBeEqual("/library/3/author/1/book/5");
    });
  });
});
