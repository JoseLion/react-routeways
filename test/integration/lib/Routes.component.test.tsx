import { render, waitFor } from "@testing-library/react";
import { BrowserRouter, Link } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { Route } from "../../../src/lib/Route.component";
import { TestScreen } from "../../helpers/renderWith";
import { TestRoutes } from "../../helpers/routes";
import { Routes } from "../../../src/lib/Routes.component";

const { home, library } = TestRoutes;

describe("[Integration] Routes.component.test.tsx", () => {
  it("creates a Route and passing the template to the path", async () => {
    window.history.pushState({ }, "", home.makeUrl());

    const { getByRole, getByText } = render(
      <BrowserRouter>
        <nav>
          <h4>
            <Link to={home.makeUrl()}>
              {"Go Home"}
            </Link>
          </h4>
          <h4>
            <Link to={library.makeUrl({ libId: 1 })}>
              {"Go Library"}
            </Link>
          </h4>
          <h4>
            <Link to={library.author.makeUrl({ authorId: 1, libId: 1 })}>
              {"Go Author"}
            </Link>
          </h4>
          <h4>
            <Link to={library.author.book.makeUrl({ authorId: 1, bookId: 1, libId: 1 })}>
              {"Go Book"}
            </Link>
          </h4>
        </nav>

        <Routes>
          <Route route={home} element={<TestScreen title="Home" />} />
          <Route route={library} element={<TestScreen title="Library" />} />
          <Route route={library.author} element={<TestScreen title="Author" />} />
          <Route route={library.author.book} element={<TestScreen title="Book" />} />
        </Routes>
      </BrowserRouter>
    );

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
