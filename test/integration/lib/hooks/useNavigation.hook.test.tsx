import { expect } from "@assertive-ts/core";
import { renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, expectTypeOf, it, suite } from "vitest";

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

suite("[Integration] useNavigation.hook.test.tsx", () => {
  it("creates a Navigation object", () => {
    const { result } = renderHook(useNavigation, { wrapper: BrowserRouter });

    expect(result.current).toContainAllKeys("goTo", "navigate", "reset", "resetTo");
    expect(safeKeys(result.current)).toSatisfyAll(key => {
      expect(typeof result.current[key]).toBeEqual("function");
    });
  });

  describe("when the goTo function is called", () => {
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

  describe("when the navigate function is called", () => {
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

  describe("when the reset function is called", () => {
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

  describe("when the resetTo funciton is called", () => {
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

  it.fails("defines the proper routes", () => {
    const { goTo, navigate, reset, resetTo } = useNavigation();

    expectTypeOf(goTo(home)).toEqualTypeOf<() => void>();
    expectTypeOf(goTo(library, { libId: 1 })).toEqualTypeOf<() => void>();
    expectTypeOf(goTo(library.author, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();
    expectTypeOf(goTo(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toEqualTypeOf<() => void>();
    // @ts-expect-error missing params arg
    expectTypeOf(goTo(library)).toEqualTypeOf<() => void>();
    // @ts-expect-error missing param
    expectTypeOf(goTo(library.author, { libId: 1 })).toEqualTypeOf<() => void>();
    // @ts-expect-error missing nested param
    expectTypeOf(goTo(library.author.book, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();

    expectTypeOf(navigate(home)).toBeVoid();
    expectTypeOf(navigate(library, { libId: 1 })).toBeVoid();
    expectTypeOf(navigate(library.author, { authorId: 1, libId: 1 })).toBeVoid();
    expectTypeOf(navigate(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toBeVoid();
    // @ts-expect-error missing params arg
    expectTypeOf(navigate(library)).toBeVoid();
    // @ts-expect-error missing param
    expectTypeOf(navigate(library.author, { libId: 1 })).toBeVoid();
    // @ts-expect-error missing nested param
    expectTypeOf(navigate(library.author.book, { authorId: 1, libId: 1 })).toBeVoid();

    expectTypeOf(reset(home)).toBeVoid();
    expectTypeOf(reset(library, { libId: 1 })).toBeVoid();
    expectTypeOf(reset(library.author, { authorId: 1, libId: 1 })).toBeVoid();
    expectTypeOf(reset(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toBeVoid();
    // @ts-expect-error missing params arg
    expectTypeOf(reset(library)).toBeVoid();
    // @ts-expect-error missing param
    expectTypeOf(reset(library.author, { libId: 1 })).toBeVoid();
    // @ts-expect-error missing nested param
    expectTypeOf(reset(library.author.book, { authorId: 1, libId: 1 })).toBeVoid();

    expectTypeOf(resetTo(home)).toEqualTypeOf<() => void>();
    expectTypeOf(resetTo(library, { libId: 1 })).toEqualTypeOf<() => void>();
    expectTypeOf(resetTo(library.author, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();
    expectTypeOf(resetTo(library.author.book, { authorId: 1, bookId: 1, libId: 1 })).toEqualTypeOf<() => void>();
    // @ts-expect-error missing params arg
    expectTypeOf(resetTo(library)).toEqualTypeOf<() => void>();
    // @ts-expect-error missing param
    expectTypeOf(resetTo(library.author, { libId: 1 })).toEqualTypeOf<() => void>();
    // @ts-expect-error missing nested param
    expectTypeOf(resetTo(library.author.book, { authorId: 1, libId: 1 })).toEqualTypeOf<() => void>();
  });
});
