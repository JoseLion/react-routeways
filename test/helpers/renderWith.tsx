import { type RenderResult, render } from "@testing-library/react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { TestRoutes } from "./routes";

import type { ReactElement, ReactNode } from "react";

interface TestScreenProps {
  title: string;
}

interface RenderOptions {
  NotFound?: ReactNode;
  url?: string;
}

const { home, library } = TestRoutes;

export function TestScreen({ title }: TestScreenProps): ReactElement {
  return (
    <div>
      <h1>{title}</h1>

      <Outlet />
    </div>
  );
}

export function renderWithNav(Element: ReactElement, options: RenderOptions = { }): RenderResult {
  const url = options.url ?? home.makeUrl();
  window.history.replaceState({ }, "", url);

  return render(
    <BrowserRouter>
      {Element}

      <Routes>
        <Route path="*" element={options.NotFound ?? <TestScreen title="404" />} />

        <Route path={home.template()} element={<TestScreen title="Home" />} />

        <Route path={library.template()} element={<TestScreen title="Library" />}>
          <Route path="/library/:libId/author/:authorId" element={<TestScreen title="Author" />}>
            <Route path={library.author.book.template()} element={<TestScreen title="Book" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>,
  );
}

export function renderWithRouter(Element: ReactElement, options: RenderOptions = { }): RenderResult {
  const url = options.url ?? home.makeUrl();
  window.history.replaceState({ }, "", url);

  return render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={Element} />
      </Routes>
    </BrowserRouter>,
  );
}
