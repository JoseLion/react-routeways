import { waitFor } from "@testing-library/dom";
import { ReactElement, useCallback } from "react";
import userEvent from "@testing-library/user-event";
import { expect } from "@stackbuilders/assertive-ts";

import { useQueryParam } from "../../../src/lib/useQueryParam";
import { renderWithRouter } from "../../helpers/renderWith";
import { TestRoutes } from "../../helpers/routes";

const { library } = TestRoutes;

function TestComp(): ReactElement {
  const [page, setPage] = useQueryParam(library, "page");
  const [search, setSearch] = useQueryParam(library, "search", "foo");

  const changePage = useCallback((): void => {
    setPage(5);
  }, [setPage]);

  const changeSearch = useCallback((): void => {
    setSearch("bar");
  }, [setSearch]);

  return (
    <div>
      <h1>{`Page: ${String(page)}`}</h1>

      <h1>{`Search: ${search}`}</h1>

      <button onClick={changePage}>{"Change page"}</button>

      <button onClick={changeSearch}>{"Change search"}</button>

      <Inner />
    </div>
  );
}

function Inner(): ReactElement {
  const [page, setPage] = useQueryParam(library, "page");

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

describe("[Integration] useQueryParam.test.tsx", () => {
  context("when the query param state is used", () => {
    context("and the query param exists in the url", () => {
      it("parses the url to get the value", async () => {
        const url = library.makeUrl({ libId: 1, page: 3 });
        const { getByRole } = renderWithRouter(<TestComp />, { url });

        await waitFor(() => getByRole("heading", { level: 1, name: "Page: 3" }));
      });
    });

    context("and the query param does not exist in the url", () => {
      context("and a fallback is not provided", () => {
        it("leaves the value as undefined", async () => {
          const url = library.makeUrl({ libId: 1 });
          const { getByRole } = renderWithRouter(<TestComp />, { url });

          await waitFor(() => getByRole("heading", { level: 1, name: "Page: undefined" }));
        });
      });

      context("and a fallback is provided", () => {
        it("initilizes the value with the fallback", async () => {
          const url = library.makeUrl({ libId: 1 });
          const { getByRole } = renderWithRouter(<TestComp />, { url });

          await waitFor(() => getByRole("heading", { level: 1, name: "Search: foo" }));
        });
      });
    });
  });

  context("when the query param is changed", () => {
    it("updates all query param states and the url", async () => {
      const url = library.makeUrl({ libId: 1, page: 3 });
      const { getByRole } = renderWithRouter(<TestComp />, { url });

      await waitFor(() => {
        getByRole("heading", { level: 1, name: "Page: 3" });
        getByRole("heading", { level: 1, name: "Search: foo" });

        getByRole("heading", { level: 2, name: "Inner Page: 3" });
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

  context("when the query param is changed from an inner component", () => {
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
});
