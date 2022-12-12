import { expect } from "@stackbuilders/assertive-ts";
import { renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";

import { useQueryParameters } from "../../../src/lib/useQueryParameters";
import { renderWithRouter } from "../../helpers/renderWith";
import { TestRoutes } from "../../helpers/routes";

function Parent(): ReactElement {
  const [queryParams] = useQueryParameters(TestRoutes.library);

  return (
    <div>
      <h4>{`Page: ${queryParams.page ?? ""}`}</h4>
      <h4>{`Search: ${queryParams.search ?? ""}`}</h4>

      <Inner />
    </div>
  );
}

function Inner(): ReactElement {
  const [_queryParams, setQueryParams] = useQueryParameters(TestRoutes.library);

  const changeParams = useCallback((): void => {
    setQueryParams({ page: 5, search: "other" });
  }, [setQueryParams]);

  return (
    <button onClick={changeParams}>
      {"Change Params"}
    </button>
  );
}

describe("[Integration] useQueryParameters.test.tsx", () => {
  context("when the route is parsed", () => {
    it("returns the query parameters of the route", () => {
      const url = TestRoutes.library.makeUrl({ libId: 1, page: 3, search: "foo" });
      window.history.pushState({ }, "", url);

      const { result } = renderHook(() => useQueryParameters(TestRoutes.library), { wrapper: BrowserRouter });

      expect(result.current[0]).toBeEqual({ page: 3, search: "foo" });
    });
  });

  context("when the query params are changed", () => {
    it("updates the query params state and the url", async () => {
      const url = TestRoutes.library.makeUrl({ libId: 1, page: 3, search: "foo" });
      window.history.pushState({ }, "", url);

      const { result } = renderHook(() => useQueryParameters(TestRoutes.library), { wrapper: BrowserRouter });

      expect(result.current[0]).toBeEqual({ page: 3, search: "foo" });

      result.current[1]({ page: 5, search: "bar" });

      await waitFor(() => {
        expect(result.current[0]).toBeEqual({ page: 5, search: "bar" });
        expect(window.location.search).toBeEqual("?page=5&search=bar");
      });
    });
  });

  context("when the query params are update from an inner component", () => {
    it("updates the state on the parent", async () => {
      const url = TestRoutes.library.makeUrl({ libId: 1, page: 3, search: "foo" });
      const { getByRole } = renderWithRouter(<Parent />, { url });

      await waitFor(() => {
        getByRole("heading", { name: "Page: 3" });
        getByRole("heading", { name: "Search: foo" });
      });

      await userEvent.click(getByRole("button", { name: "Change Params" }));

      await waitFor(() => {
        getByRole("heading", { name: "Page: 5" });
        getByRole("heading", { name: "Search: other" });
      });
    });
  });
});
