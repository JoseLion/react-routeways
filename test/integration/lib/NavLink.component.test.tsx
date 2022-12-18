import { waitFor } from "@testing-library/dom";
import { ReactElement } from "react";
import userEvent from "@testing-library/user-event";

import { renderWithNav } from "../../helpers/renderWith";
import { TestRoutes } from "../../helpers/routes";
import { NavLink } from "../../../src/lib/NavLink.component";

const { home, library } = TestRoutes;

function TestNav(): ReactElement {

  return (
    <nav>
      <NavLink to={home}>{"Go Home"}</NavLink>
      <NavLink to={library} params={{ libId: 1, page: 2, search: "foo" }}>{"Go Library"}</NavLink>
      <NavLink to={library.author} params={{ authorId: 2, libId: 1 }}>{"Go Author"}</NavLink>
      <NavLink to={library.author.book} params={{ authorId: 2, bookId: 3, libId: 1 }}>{"Go Book"}</NavLink>
    </nav>
  );
}

describe("[Integration] NavLink.component.test.tsx", () => {
  it("navigates to the route's url", async () => {
    const { getByRole, getByText } = renderWithNav(<TestNav />);

    await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));

    await userEvent.click(getByText("Go Library"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Library" }));

    await userEvent.click(getByText("Go Author"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Author" }));

    await userEvent.click(getByText("Go Book"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Book" }));

    await userEvent.click(getByText("Go Home"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));
  });
});
