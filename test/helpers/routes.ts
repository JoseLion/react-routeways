import { Codecs, Routeways } from "ts-routeways";

export const TestRoutes = Routeways()
  .path({ name: "home", path: "/home" })
  .nest({
    name: "library",
    path: "/library/:libId",
    pathVars: { libId: Codecs.Number },
    subRoutes: Routeways()
      .nest({
        name: "author",
        path: "/author/:authorId",
        pathVars: { authorId: Codecs.Number },
        subRoutes: Routeways()
          .path({
            name: "book",
            path: "/book/:bookId",
            pathVars: { bookId: Codecs.Number },
          }),
      }),
  })
  .build();
