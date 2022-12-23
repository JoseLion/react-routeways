[![CircleCI](https://dl.circleci.com/status-badge/img/gh/JoseLion/react-routeways/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/JoseLion/react-routeways/tree/main)
[![NPM version](https://img.shields.io/npm/v/react-routeways)](https://www.npmjs.com/package/react-routeways)
[![NPM bundle size](https://img.shields.io/bundlephobia/min/react-routeways)](https://www.npmjs.com/package/react-routeways)
[![NPM downloads](https://img.shields.io/npm/dm/react-routeways)](https://www.npmjs.com/package/react-routeways)
[![NPM license](https://img.shields.io/npm/l/react-routeways)](./LICENSE)
[![GitHub Release Date](https://img.shields.io/github/release-date/JoseLion/react-routeways)](https://github.com/JoseLion/react-routeways/releases)
[![Snyk Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/react-routeways)](https://snyk.io/)

# React Routeways

This is not another React routing library. Instead, it's a complete abstraction to use [ts-routeways](https://github.com/JoseLion/ts-routeways) together with [react-router-dom](https://reactrouter.com/), providing all the type safety, url parsing/generation, and codecs definition of `ts-routeways` to the your `react-router-dom` routes, hooks, and components.

## Install

React Routeways has some required peer dependencies:

| Dependency       | Version  |
| ---------------- | :------: |
| react            | >=16.8.0 |
| react-dom        | >=16.8.0 |
| react-router-dom | >=6.0.0  |
| ts-routeways     | >=1.4.7  |

The React dependencies yopu should already have, so to install React Routeway you can:

**With Yarn:**
```sh
yarn add react-routeways ts-routeways react-router-dom
```

**With NPM:**
```sh
npm i react-routeways ts-routeways react-router-dom
```

## Usage

React Routeways is basically a set of React hooks and components which you can use with your `Routeways` routes. The following are available:

- [Components](#components)
  - [Link](#link)
  - [Navigate](#navigate)
  - [NavLink](#navlink)
  - [Route](#route)
  - [Routes](#routes)
- [Hooks](#hooks)
  - [createNavigatorHook](#createnavigatorhook)
  - [useNavigation](#usenavigation)
  - [usePathVars](#usepathvars)
  - [useQueryParam](#usequeryparam)
  - [useQueryParameters](#usequeryparameters)
  - [useRouteParams](#userouteparams)

You can also check the [📚 API Reference](https://JoseLion.github.io/react-routeways/docs/build/) for more details and type definitions on each of the above.

### Components

This set of components are mostly `react-router-dom` replacement drop-in components. The main difference is that wherever those components required a prop with a url/path string, now the will require a `ts-routeways` route instead.

#### Link

A wrapper over react-router-dom's [<Link>](https://reactrouter.com/en/main/components/link) component, with the difference that the `to` prop expects a `Routeway` route instead of a path string. If the route requires path variables and/or query parameters, you can pass them over the `params` prop.

```tsx
const { users } = MainRoutes;

export function HomeScreen(): ReactElement {

  return (
    <Link to={users.view} params={{ userId: 153 }}>
      {"Go to user 153"}
    </Link>
  );
}
```

#### Navigate

A wrapper over react-router-dom's [<Navigate>](https://reactrouter.com/en/main/components/navigate) component, with the difference that the `to` prop expects a `Routeway` route instead of a path string. If the route requires path variables and/or query parameters, you can pass them over the `params` prop.

```tsx
const { home } = MainRoutes;

export function UserScreen(): ReactElement {

  return (
    <>
      {userId === undefined && (
        <Navigate to={home} />
      )}
    </>
  )
}
```

#### NavLink

A wrapper over react-router-dom's [<NavLink>](https://reactrouter.com/en/main/components/nav-link) component, with the difference that the `to` prop expects a `Routeway` route instead of a path string. If the route requires path variables and/or query parameters, you can pass them over the `params` prop.

```tsx
const { users } = MainRoutes;

export function NavScreen(): ReactElement {

  return (
    <NavLink to={users} style={({ isActive }) => isActive ? activeStyle : undefined}>
      {"Go to user 153"}
    </Link>
  );
}
```

#### Route

Same as react-router-dom's [<Route>](https://reactrouter.com/en/main/components/route) component, but it replaces the `path` prop with `route`, where you can pass as `Routeway` route which will be used to create the path.

See the usage example in react-routeways' [<Routes>](#routes) component.

#### Routes

A "wrapper" over react-router-dom's [<Routes>](https://reactrouter.com/en/main/components/routes) component which allows the use of react-routeways' [<Route>](#route) components as children.

The `route` prop also allows a `"*"` literal string to match anything, and as a replacement of the [splat segments](https://reactrouter.com/en/main/route/route#splats) support, you can use the `catchAll` prop, which basically appends a `/*` string to the end of the path.

```tsx
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-routeways";

const { home, users, settings } = MainRoutes;

export function MainNavigation(): ReactElement {

  return (
    <BrowserRouter>
      <Routes>
        <Route route="*" element={<NotFound />} />
        <Route route={home} element={<HomeScreen />} />
        <Route route={users} element={<UsersScreen />}>
          <Route route={users.view} catchAll={true} element={<ViewUserScreen />} />
          <Route route={users.edit} catchAll={true} element={<EditUserScreen />} />
        </Route>
        <Route route={settings} element={<SettingsScreen />}>
      </Routes>
    </BrowserRouter>
  )
}
```

### Hooks

This is a set of hooks which provides a reactive way of using navigation, path variables, and query parameters. As well as the components, they are all based on `Routeways` routes instead of unsage string paths/urls. Another big advantage is that the path variables and query parameters hooks create react states which source of thruth is the current location. This means that updating path variables and/or query parameters states will reflect in other components using the same hook(s) with the same route, without the need of extra React providers.

#### createNavigatorHook

Creates a hook that returns a "Navigator" obeject from your custom routes. This provides natural experience of imperative navigation based on your routes structure.

```tsx
const useNavigator = createNavigatorHook(MainRoutes);

export function HomeScreen(): ReactElement {
  const { logout, users } = useNavigator();

  useEffect(() => {
    if (session !== null) {
      logout.reset();
    } else {
      users.view.navigate({ userId: 463 });
    }
  }, [session]);

  return (
    // ...
  )
}
```

#### useNavigation

Returns an object which contains navigation functions that can be used along with `Routeways` routes. A big benefit of this hook is that provides te `goTo` and `resetTo` functions, which are stable callback versions of `navigate` and `reset`, so they are ideal to use on event-like props.

```tsx
const { home, logout, users } = MainRoutes;

export function HomeScreen(): ReactElement {
  const { goTo, navigate, reset, resetTo } = useNavigation();

  useEffect(() => {
    if (session !== null) {
      reset(logout);
    } else {
      navigate(users.view, { userId: 463 });
    }
  }, [session]);

  return (
    <button onClick={goTo(users.edit, { userId: 463 })}>{"Edit User"}</button>
    <button onClick={resetTo(home)}>{"Go Home"}</button>
  )
}
```

#### usePathVars

Returns a tuple of a stateful value of the path variables, and a function to update them. Just like the [useState](https://beta.reactjs.org/apis/react/useState) hook would. However, because changing path variables means that the current location may also be different, an update to the path variables will produce a navigate using the updated values.

```tsx
const { user } = MainRoutes;

export function EditUserScreen(): ReactElement {
  const [pathVars, setPathVars] = usePathVars(user.edit);

  const changeUser = useCallback((userId: number) => (): void => {
    setPathVars({ usertId });
  }, [setPathVars]);

  return (
    <div>
      <h2>{`Current User: ${pathVars.userId}`}</h2>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            <button onClick={changeUser(user.id)}>{user.name}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### useQueryParam

Returns a tuple of a stateful value of the specified query param, and a function to update it. Just like the [useState](https://beta.reactjs.org/apis/react/useState) hook would. However, because the source of truth for this state is the current location, whenever the state is updated in one component, it will be also updated in other components using the same query param state. This keeps consistency across the state and the location all the time.

```tsx
const { user } = MainRoutes;

export function ViewUserScreen(): ReactElement {
  const [page, setPage] = useQueryParam(user.view, "page", 1);
  const [search, setSearch] = useQueryParam(user.view, "search");

  const nextPage = useCallback((): void => {
    setPage(prev => prev + 1);
  }, [setPage]);

  const handleSearch = useCallback((value: string): void => {
    setSearch(value);
  }, [setSearch]);

  return (
    <div>
      <Pagination current={page} onNext={nextPage} />

      <SearchInput value={search} onChange={handleSearch} />
    </div>
  )
}
```

#### useQueryParameters

Returns a tuple of a stateful value of all query parameters, and a function to update them. Just like the [useState](https://beta.reactjs.org/apis/react/useState) hook would. However, because the source of truth for this state is the current location, whenever the state is updated in one component, it will be also updated in other components using the same state from this hook. This keeps consistency across the state and the location all the time.

```tsx
const { user } = MainRoutes;

export function ViewUserScreen(): ReactElement {
  const [queryParams, setQueryParams] = useQueryParameters(user.view);

  const nextPage = useCallback((): void => {
    setQueryParams(prev => ({ ...prev, page: (prev.page ?? 0) + 1 }));
  }, [setQueryParams]);

  const handleSearch = useCallback((search: string): void => {
    setQueryParams({ page: 1, search });
  }, [setQueryParams]);

  return (
    <div>
      <Pagination current={queryParams.page ?? 1} onNext={nextPage} />

      <SearchInput value={queryParams.search} onChange={handleSearch} />
    </div>
  )
}
```

#### useRouteParams

Returns a tuple of a stateful value of both the path variables and query parameters, and a function to update them. Just like the [useState](https://beta.reactjs.org/apis/react/useState) hook would. This hook uses both [usePathVars](#usepathvars) and [useQueryParameters](#usequeryparameters), so updating parameters may have the same effects as in both hooks.

```tsx
const { user } = MainRoutes;

export function ViewUserScreen(): ReactElement {
  const [params, setParams] = useRouteParams(user.view);

  const nextPage = useCallback((): void => {
    setParams(prev => ({ ...prev, page: (prev.page ?? 0) + 1 }));
  }, [setParams]);

  const handleSearch = useCallback((search: string): void => {
    setParams(prev => ({ ...prev, page: 1, search }));
  }, [setParams]);

  useEffect(() => {
    fetchUserData(params.userId).then(() => ...);
  }, []);

  return (
    <div>
      <Pagination current={params.page ?? 1} onNext={nextPage} />

      <SearchInput value={params.search} onChange={handleSearch} />
    </div>
  )
}
```

## Something's missing?

Suggestions are always welcome! Please create an [issue](https://github.com/JoseLion/react-routeways/issues/new) describing the request, feature, or bug. I'll try to look into it as soon as possible 🙂

## Contributions

Contributions are very welcome! To do so, please fork this repository and open a Pull Request against the `main` branch.

## License

[MIT License](./LICENSE)
