import jsdomGlobal from "jsdom-global";

jsdomGlobal(undefined, { url: "http://localhost" });

global.MutationObserver = window.MutationObserver;
