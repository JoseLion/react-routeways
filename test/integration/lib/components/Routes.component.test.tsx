import { render, waitFor } from "@testing-library/react";
import { BrowserRouter, Link as RRLink } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { Route } from "../../../../src/lib/components/Route.component";
import { TestScreen } from "../../../helpers/renderWith";
import { TestRoutes } from "../../../helpers/routes";
import { Routes } from "../../../../src/lib/components/Routes.component";
import { Link } from "../../../../src/lib/components/Link.component";

const { home, library } = TestRoutes;

describe("[Integration] Routes.component.test.tsx", () => {
  it("creates a Route and passing the template to the path", async () => {
    window.history.pushState({ }, "", "/");

    const { getByRole, getByText } = render(
      <BrowserRouter>
        <nav>
          <h4>
            <Link to={home}>
              {"Go Home"}
            </Link>
          </h4>
          <h4>
            <RRLink to={`${home.makeUrl()}/plus/splat/path`}>
              {"Go Home Splat"}
            </RRLink>
          </h4>
          <h4>
            <Link to={library} params={{ libId: 1 }}>
              {"Go Library"}
            </Link>
          </h4>
          <h4>
            <Link to={library.author} params={{ authorId: 1, libId: 1 }}>
              {"Go Author"}
            </Link>
          </h4>
          <h4>
            <Link to={library.author.book} params={{ authorId: 1, bookId: 1, libId: 1 }}>
              {"Go Book"}
            </Link>
          </h4>
        </nav>

        <Routes>
          <Route route="*" element={<TestScreen title="404" />} />
          <Route route={home} catchAll={true} element={<TestScreen title="Home Splat" />} />
          <Route route={home} element={<TestScreen title="Home" />} />
          <Route route={library} element={<TestScreen title="Library" />} />
          <Route route={library.author} element={<TestScreen title="Author" />} />
          <Route route={library.author.book} element={<TestScreen title="Book" />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => getByRole("heading", { level: 1, name: "404" }));

    await userEvent.click(getByText("Go Home"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Home" }));

    await userEvent.click(getByText("Go Home Splat"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Home Splat" }));

    await userEvent.click(getByText("Go Library"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Library" }));

    await userEvent.click(getByText("Go Author"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Author" }));

    await userEvent.click(getByText("Go Book"));

    await waitFor(() => getByRole("heading", { level: 1, name: "Book" }));
  });
});
