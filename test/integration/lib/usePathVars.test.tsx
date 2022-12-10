import { expect } from "@stackbuilders/assertive-ts";
import { renderHook } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { usePathVars } from "../../../src/lib/usePathVars";
import { TestRoutes } from "../../helpers/routes";

describe("[Integration] usePathVars.test.ts", () => {
  context("when the route is parsed", () => {
    it("returns the path variables of the route", () => {
      const url = TestRoutes.library.author.book.makeUrl({ authorId: 1, bookId: 2, libId: 3 });
      window.history.replaceState({ }, "", url);

      const { result } = renderHook(() => usePathVars(TestRoutes.library.author.book), { wrapper: BrowserRouter });

      expect(result.current).toBeEqual({
        authorId: 1,
        bookId: 2,
        libId: 3,
      });
    });
  });
});
