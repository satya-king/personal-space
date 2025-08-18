let showFn = null;
let hideFn = null;

export const loaderHandler = {
    register(show, hide) {
        showFn = show;
        hideFn = hide;
    },
    show() {
        if (showFn) showFn();
    },
    hide() {
        if (hideFn) hideFn();
    },
};
