import { render, RenderResult } from "@testing-library/react";
import { ReactElement } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { TestRoutes } from "./routes";

interface TestScreenProps {
  title: string;
}

function TestScreen({ title }: TestScreenProps): ReactElement {

  return (
    <div>
      <h1>{title}</h1>

      <Outlet />
    </div>
  );
}

export function renderWithRouter(Element: ReactElement): RenderResult {
  window.history.replaceState({ }, "", TestRoutes.home.makeUrl());

  return render(
    <BrowserRouter>
      {Element}

      <Routes>
        <Route path={TestRoutes.home.template()} element={<TestScreen title="Home" />} />

        <Route path={TestRoutes.library.template()} element={<TestScreen title="Library" />}>
          <Route path={"/library/:libId/author/:authorId"} element={<TestScreen title="Author" />}>
            <Route path={TestRoutes.library.author.book.template()} element={<TestScreen title="Book" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}