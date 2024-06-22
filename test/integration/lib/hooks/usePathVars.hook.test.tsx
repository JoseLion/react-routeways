import { expect } from "@assertive-ts/core";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement, useCallback } from "react";
import { describe, expectTypeOf, it, suite } from "vitest";

import { type UsePathVars, usePathVars } from "../../../../src/lib/hooks/usePathVars.hook";
import { renderWithRouter } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

function TestComp(): ReactElement {
  const [pathVars, setPathVars] = usePathVars(library.author.book);

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

suite("[Integration] usePathVars.hook.test.ts", () => {
  describe("when path var state is used", () => {
    it("parses the url to get the values", async () => {
      const url = library.author.book.makeUrl({ authorId: 1, bookId: 2, libId: 3 });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Library: 3" });
        getByRole("heading", { level: 1, name: "Author: 1" });
        getByRole("heading", { level: 1, name: "Book: 2" });
      });
    });
  });

  describe("when a path variable is changed", () => {
    it("updates it state and navigates to the new url", async () => {
      const url = library.author.book.makeUrl({ authorId: 1, bookId: 2, libId: 3 });
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

  it.fails("defines the proper types", () => {
    expectTypeOf(usePathVars(home)).toEqualTypeOf<UsePathVars<Record<never, never>>>();
    expectTypeOf(usePathVars(library)).toEqualTypeOf<UsePathVars<{ libId: number; }>>();
    expectTypeOf(usePathVars(library.author)).toEqualTypeOf<UsePathVars<{
      authorId: number;
      libId: number;
    }>>();
    expectTypeOf(usePathVars(library.author.book)).toEqualTypeOf<UsePathVars<{
      authorId: number;
      bookId: number;
      libId: number;
    }>>();

    expectTypeOf(usePathVars(home)).not.toEqualTypeOf<UsePathVars<{ x: number; }>>();
    expectTypeOf(usePathVars(library)).not.toEqualTypeOf<UsePathVars<Record<never, never>>>();
    expectTypeOf(usePathVars(library.author)).not.toEqualTypeOf<UsePathVars<{ libId: number; }>>();
    expectTypeOf(usePathVars(library)).not.toEqualTypeOf<UsePathVars<{ authorId: number; libId: number; }>>();
  });
});
