import { expect } from "@assertive-ts/core";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { type ReactElement, useCallback } from "react";
import { describe, expectTypeOf, it, suite } from "vitest";

import { type UseQueryParam, useQueryParam } from "../../../../src/lib/hooks/useQueryParam.hook";
import { renderWithRouter } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

import type { Optional } from "../../../../src/lib/helpers/commons";

const { home, library } = TestRoutes;

function TestComp(): ReactElement {
  const [page, setPage] = useQueryParam(library, "page", 1);
  const [search, setSearch] = useQueryParam(library, "search");

  const changePage = useCallback((): void => {
    setPage(5);
  }, [setPage]);

  const changeSearch = useCallback((): void => {
    setSearch("bar");
  }, [setSearch]);

  const clear = useCallback((): void => {
    setSearch(undefined);
  }, [setSearch]);

  return (
    <div>
      <h1>{`Page: ${page}`}</h1>

      <h1>{`Search: ${String(search)}`}</h1>

      <button onClick={changePage}>{"Change page"}</button>

      <button onClick={changeSearch}>{"Change search"}</button>

      <button onClick={clear}>{"Clear search"}</button>

      <Inner />
    </div>
  );
}

function Inner(): ReactElement {
  const [page, setPage] = useQueryParam(library, "page", 1);

  const fistPage = useCallback((): void => {
    setPage((prev = 0) => prev - 2);
  }, [setPage]);

  return (
    <div>
      <h2>{`Inner Page: ${String(page)}`}</h2>

      <button onClick={fistPage}>{"First page"}</button>
    </div>
  );
}

suite("[Integration] useQueryParam.hook.test.tsx", () => {
  describe("when the query param state is used", () => {
    describe("and the query param exists in the url", () => {
      it("parses the url to get the value", async () => {
        const url = library.makeUrl({ libId: 1, page: 3 });
        const { getByRole } = renderWithRouter(<TestComp />, { url });

        await waitFor(() => getByRole("heading", { level: 1, name: "Page: 3" }));
      });
    });

    describe("and the query param does not exist in the url", () => {
      describe("and a fallback is not provided", () => {
        it("leaves the value as undefined", async () => {
          const url = library.makeUrl({ libId: 1 });
          const { getByRole } = renderWithRouter(<TestComp />, { url });

          await waitFor(() => getByRole("heading", { level: 1, name: "Search: undefined" }));
        });
      });

      describe("and a fallback is provided", () => {
        it("initilizes the value with the fallback", async () => {
          const url = library.makeUrl({ libId: 1 });
          const { getByRole } = renderWithRouter(<TestComp />, { url });

          await waitFor(() => getByRole("heading", { level: 1, name: "Page: 1" }));
        });
      });
    });
  });

  describe("when the query param is changed", () => {
    it("updates all query param states and the url", async () => {
      const url = library.makeUrl({ libId: 1 });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 1" });

        getByRole("heading", { level: 2, name: "Inner Page: 1" });
      });

      await userEvent.click(getByRole("button", { name: "Change page" }));

      await waitFor(() => getByRole("heading", { level: 1, name: "Page: 5" }));

      expect(window.location.search).toBeEqual("?page=5");

      await userEvent.click(getByRole("button", { name: "Change search" }));

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 5" });
        getByRole("heading", { level: 1, name: "Search: bar" });

        getByRole("heading", { level: 2, name: "Inner Page: 5" });
      });

      expect(window.location.search).toBeEqual("?page=5&search=bar");
    });
  });

  describe("when the query param is changed from an inner component", () => {
    it("updates all query param states and the url", async () => {
      const url = library.makeUrl({ libId: 1, page: 3 });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 3" });
        getByRole("heading", { level: 2, name: "Inner Page: 3" });
      });

      await userEvent.click(getByRole("button", { name: "First page" }));

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 1" });
        getByRole("heading", { level: 2, name: "Inner Page: 1" });
      });

      expect(window.location.search).toBeEqual("?page=1");
    });
  });

  describe("when the query param is set to undefined", () => {
    it("changes the state to undefined and removes the query string", async () => {
      const url = library.makeUrl({ libId: 1 });
      const { getByRole, findByRole } = renderWithRouter(<TestComp />, { url });

      const changeButton = await findByRole("button", { name: "Change search" });

      await userEvent.click(changeButton);

      await waitFor(() => getByRole("heading", { level: 1, name: "Search: bar" }));

      expect(window.location.search).toBeEqual("?search=bar");

      await userEvent.click(getByRole("button", { name: "Clear search" }));

      await waitFor(() => getByRole("heading", { level: 1, name: "Search: undefined" }));

      expect(window.location.search).toBeEmpty();
    });
  });

  it.fails("defines the proper types", () => {
    expectTypeOf(useQueryParam(home, "foo")).toEqualTypeOf<UseQueryParam<Optional<unknown>>>();
    expectTypeOf(useQueryParam(library, "page")).toEqualTypeOf<UseQueryParam<Optional<number>>>();
    expectTypeOf(useQueryParam(library, "search")).toEqualTypeOf<UseQueryParam<Optional<string>>>();
    expectTypeOf(useQueryParam(library, "page", 1)).toEqualTypeOf<UseQueryParam<number>>();
    expectTypeOf(useQueryParam(library, "search", "foo")).toEqualTypeOf<UseQueryParam<string>>();

    // @ts-expect-error wrong query param
    expectTypeOf(useQueryParam(library, "foo")).toEqualTypeOf<UseQueryParam<Optional<unknown>>>();
    // @ts-expect-error wrong value type
    expectTypeOf(useQueryParam(library, "search", 1)).toEqualTypeOf<UseQueryParam<number>>();
  });
});
