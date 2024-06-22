import { expect } from "@assertive-ts/core";
import { renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";

import { safeKeys } from "../../../../src/lib/helpers/commons";
import { useNavigation } from "../../../../src/lib/hooks/useNavigation.hook";
import { renderWithNav } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

function NavComponent(): ReactElement {
  const { goTo, navigate, reset, resetTo } = useNavigation();

  const goHome = useCallback((): void => {
    navigate(home);
  }, [navigate]);

  const goLib = useCallback((): void => {
    navigate(library, { libId: 1 });
  }, [navigate]);

  const redirectAuthor = useCallback((): void => {
    reset(library.author, { authorId: 1, libId: 1 });
  }, [reset]);

  return (
    <nav>
      <ul>
        <li onClick={goHome}>{"Go Home"}</li>
        <li onClick={goLib}>{"Go Library"}</li>
        <li onClick={goTo(library.author, { authorId: 1, libId: 1 })}>{"Go Author"}</li>
        <li onClick={redirectAuthor}>{"Redirect Author"}</li>
        <li onClick={resetTo(library.author.book, { authorId: 1, bookId: 1, libId: 1 })}>
          {"Reset Book"}
        </li>
      </ul>
    </nav>
  );
}

describe("[Integration] useNavigation.hook.test.tsx", () => {
  it("creates a Navigation object", () => {
    const { result } = renderHook(useNavigation, { wrapper: BrowserRouter });

    expect(result.current).toContainAllKeys("goTo", "navigate", "reset", "resetTo");
    expect(safeKeys(result.current)).toSatisfyAll(key => {
      expect(typeof result.current[key]).toBeEqual("function");
    });
  });

  context("when the goTo function is called", () => {
    it("returns a callback that pushes another location to the history", async () => {
      const { getByRole, findByText } = renderWithNav(<NavComponent />);

      await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));

      const authorItem = await findByText("Go Author");

      await userEvent.click(authorItem);

      await waitFor(() => getByRole("heading", { level: 1, name: "Author" }));

      window.history.back();

      await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));
    });
  });

  context("when the navigate function is called", () => {
    it("pushes another location to the history", async () => {
      const { getByRole, findByText } = renderWithNav(<NavComponent />);

      await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));

      const libItem = await findByText("Go Library");

      await userEvent.click(libItem);

      await waitFor(() => getByRole("heading", { level: 1, name: "Library" }));

      window.history.back();

      await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));
    });
  });

  context("when the reset function is called", () => {
    it("resets the history to the route's location", async () => {
      const { getByRole, findByText, queryByRole } = renderWithNav(<NavComponent />);

      await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));

      const authorItem = await findByText("Redirect Author");

      await userEvent.click(authorItem);

      await waitFor(() => getByRole("heading", { level: 1, name: "Author" }));

      window.history.back();

      await waitFor(() => getByRole("heading", { level: 1, name: "Author" }));

      expect(queryByRole("heading", { level: 1, name: "Home" })).toBeNull();
    });
  });

  context("when the resetTo funciton is called", () => {
    it("returns a callback that resets the history to the route's location", async () => {
      const { getByRole, findByText, queryByRole } = renderWithNav(<NavComponent />);

      await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));

      const bookItem = await findByText("Reset Book");

      await userEvent.click(bookItem);

      await waitFor(() => getByRole("heading", { level: 1, name: "Book" }));

      window.history.back();

      await waitFor(() => getByRole("heading", { level: 1, name: "Book" }));

      expect(queryByRole("heading", { level: 1, name: "Home" })).toBeNull();
    });
  });
});
