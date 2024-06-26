import { expect } from "@assertive-ts/core";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement, useCallback } from "react";
import { describe, expectTypeOf, it, suite } from "vitest";

import { type UseQueryParameters, useQueryParameters } from "../../../../src/lib/hooks/useQueryParameters.hook";
import { renderWithRouter } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

function TestComp(): ReactElement {
  const [queryParams, setQueryParams] = useQueryParameters(library);

  const changeParam = useCallback((): void => {
    setQueryParams({ page: 5, search: "bar" });
  }, [setQueryParams]);

  return (
    <div>
      <h1>{`Page: ${String(queryParams.page)}`}</h1>
      <h1>{`Search: ${String(queryParams.search)}`}</h1>

      <button onClick={changeParam}>{"Change Params"}</button>

      <Inner />
    </div>
  );
}

function Inner(): ReactElement {
  const [queryParams, setQueryParams] = useQueryParameters(library);

  const changeParams = useCallback((): void => {
    setQueryParams(({ page = 0 }) => ({
      page: page - 2,
      search: "other",
    }));
  }, [setQueryParams]);

  return (
    <div>
      <h2>{`Inner Page: ${String(queryParams.page)}`}</h2>
      <h2>{`Inner Search: ${String(queryParams.search)}`}</h2>

      <button onClick={changeParams}>{"Inner Change Params"}</button>
    </div>
  );
}

suite("[Integration] useQueryParameters.hook.test.tsx", () => {
  describe("when the query params state is used", () => {
    it("parses the url to get the values", async () => {
      const url = library.makeUrl({ libId: 1, page: 3, search: "foo" });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 3" });
        getByRole("heading", { level: 1, name: "Search: foo" });
      });
    });
  });

  describe("when the query params are changed", () => {
    it("updates all states and the url", async () => {
      const url = library.makeUrl({ libId: 1, page: 3, search: "foo" });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 3" });
        getByRole("heading", { level: 1, name: "Search: foo" });

        getByRole("heading", { level: 2, name: "Inner Page: 3" });
        getByRole("heading", { level: 2, name: "Inner Search: foo" });
      });

      await userEvent.click(getByRole("button", { name: "Change Params" }));

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 5" });
        getByRole("heading", { level: 1, name: "Search: bar" });

        getByRole("heading", { level: 2, name: "Inner Page: 5" });
        getByRole("heading", { level: 2, name: "Inner Search: bar" });
      });

      expect(window.location.search).toBeEqual("?page=5&search=bar");
    });
  });

  describe("when the query params are update from an inner component", () => {
    it("updates all states and the url", async () => {
      const url = library.makeUrl({ libId: 1, page: 3, search: "foo" });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 3" });
        getByRole("heading", { level: 1, name: "Search: foo" });

        getByRole("heading", { level: 2, name: "Inner Page: 3" });
        getByRole("heading", { level: 2, name: "Inner Search: foo" });
      });

      await userEvent.click(getByRole("button", { name: "Inner Change Params" }));

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 1" });
        getByRole("heading", { level: 1, name: "Search: other" });

        getByRole("heading", { level: 2, name: "Inner Page: 1" });
        getByRole("heading", { level: 2, name: "Inner Search: other" });
      });

      expect(window.location.search).toBeEqual("?page=1&search=other");
    });
  });

  it.fails("defines the proper types", () => {
    expectTypeOf(useQueryParameters(home)).toEqualTypeOf<UseQueryParameters<Record<never, never>>>();
    expectTypeOf(useQueryParameters(library)).toEqualTypeOf<UseQueryParameters<{
      page?: number;
      search?: string;
    }>>();

    expectTypeOf(useQueryParameters(library)).not.toEqualTypeOf<UseQueryParameters<{
      foo?: boolean;
      other?: string;
    }>>();
  });
});
