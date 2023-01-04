import { expect } from "@stackbuilders/assertive-ts";
import { renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";

import { createNavigatorHook } from "../../../../src/lib/hooks/createNavigatorHook";
import { renderWithNav } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";

const useNavigator = createNavigatorHook(TestRoutes);

function NavComponent(): ReactElement {
  const navigation = useNavigator();

  const goHome = useCallback((): void => {
    navigation.home.navigate();
  }, [navigation]);

  const goLib = useCallback((): void => {
    navigation.library.navigate({ libId: 1 });
  }, [navigation]);

  const redirectAuthor = useCallback((): void => {
    navigation.library.author.reset({ authorId: 1, libId: 1 });
  }, [navigation]);

  return (
    <nav>
      <ul>
        <li onClick={goHome}>{"Go Home"}</li>
        <li onClick={goLib}>{"Go Library"}</li>
        <ul>
          <li onClick={redirectAuthor}>{"Redirect Author"}</li>
        </ul>
      </ul>
    </nav>
  );
}

describe("[Integration] createNavigatiorHook.test.tsx", () => {
  context("when the created hook is used", () => {
    it("returns a navigator with the passed route structure", () => {
      const { result } = renderHook(useNavigator, { wrapper: BrowserRouter });

      const routes = [
        result.current.home,
        result.current.library,
        result.current.library.author,
        result.current.library.author.book,
      ];

      expect(routes).toSatisfyAll(route => {
        expect(route).toContainAllKeys(["navigate", "reset"]);
        expect(typeof route.navigate).toBeEqual("function");
        expect(typeof route.reset).toBeEqual("function");
      });
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

  context("when the replace function is called", () => {
    it("resets the history with the route's location", async () => {
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
});
