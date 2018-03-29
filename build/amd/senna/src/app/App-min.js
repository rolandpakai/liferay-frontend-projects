define(["exports","metal-dom/src/all/dom","metal/src/metal","metal-events/src/events","metal-promise/src/promise/Promise","metal-debounce/src/debounce","../globals/globals","../route/Route","../screen/Screen","../surface/Surface","metal-uri/src/Uri","../utils/utils"],function(e,t,a,n,r,o,i,l,s,u,c,f){"use strict";function d(e){return e&&e.__esModule?e:{"default":e}}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function v(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function g(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(e,"__esModule",{value:!0});var p=d(r),y=d(o),m=d(i),S=d(l),P=d(s),w=d(u),b=d(c),_=d(f),k=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),N=function H(e,t,a){null===e&&(e=Function.prototype);var n=Object.getOwnPropertyDescriptor(e,t);if(void 0===n){var r=Object.getPrototypeOf(e);return null===r?void 0:H(r,t,a)}if("value"in n)return n.value;var o=n.get;if(void 0!==o)return o.call(a)},E=function(e){function r(){h(this,r);var e=v(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return e.activeScreen=null,e.activePath=null,e.allowPreventNavigate=!0,e.basePath="",e.browserPathBeforeNavigate=_["default"].getCurrentBrowserPathWithoutHash(),e.captureScrollPositionFromScrollEvent=!0,e.defaultTitle=m["default"].document.title,e.formSelector='form[enctype="multipart/form-data"]:not([data-senna-off])',e.ignoreQueryStringFromRoutePath=!1,e.linkSelector='a:not([data-senna-off]):not([target="_blank"])',e.loadingCssClass="senna-loading",e.nativeScrollRestorationSupported="scrollRestoration"in m["default"].window.history,e.isNavigationPending=!1,e.pendingNavigate=null,e.popstateScrollLeft=0,e.popstateScrollTop=0,e.redirectPath=null,e.routes=[],e.screens={},e.skipLoadPopstate=!1,e.surfaces={},e.updateScrollPosition=!0,e.appEventHandlers_=new n.EventHandler,e.appEventHandlers_.add((0,t.on)(m["default"].window,"scroll",(0,y["default"])(e.onScroll_.bind(e),100)),(0,t.on)(m["default"].window,"load",e.onLoad_.bind(e)),(0,t.on)(m["default"].window,"popstate",e.onPopstate_.bind(e))),e.on("startNavigate",e.onStartNavigate_),e.on("beforeNavigate",e.onBeforeNavigate_),e.on("beforeNavigate",e.onBeforeNavigateDefault_,!0),e.on("beforeUnload",e.onBeforeUnloadDefault_),e.setLinkSelector(e.linkSelector),e.setFormSelector(e.formSelector),e.maybeOverloadBeforeUnload_(),e}return g(r,e),k(r,[{key:"addRoutes",value:function(e){var t=this;return Array.isArray(e)||(e=[e]),e.forEach(function(e){e instanceof S["default"]||(e=new S["default"](e.path,e.handler)),t.routes.push(e)}),this}},{key:"addSurfaces",value:function(e){var t=this;return Array.isArray(e)||(e=[e]),e.forEach(function(e){(0,a.isString)(e)&&(e=new w["default"](e)),t.surfaces[e.getId()]=e}),this}},{key:"canNavigate",value:function(e){var t=_["default"].isWebUri(e);if(!t)return!1;var a=_["default"].getUrlPath(e);return!!this.isLinkSameOrigin_(t.getHost())&&(!!this.isSameBasePath_(a)&&((!t.getHash()||!_["default"].isCurrentBrowserPath(a))&&!!this.findRoute(a)))}},{key:"clearScreensCache",value:function(){var e=this;Object.keys(this.screens).forEach(function(t){t===e.activePath?e.activeScreen.clearCache():e.removeScreen(t)})}},{key:"createScreenInstance",value:function(e,t){if(!this.pendingNavigate&&e===this.activePath)return this.activeScreen;var a=this.screens[e];if(!a){var n=t.getHandler();a=n===P["default"]||P["default"].isImplementedBy(n.prototype)?new n:n(t)||new P["default"]}return a}},{key:"disposeInternal",value:function(){this.activeScreen&&this.removeScreen(this.activePath),this.clearScreensCache(),this.formEventHandler_.removeListener(),this.linkEventHandler_.removeListener(),this.appEventHandlers_.removeAllListeners(),N(r.prototype.__proto__||Object.getPrototypeOf(r.prototype),"disposeInternal",this).call(this)}},{key:"dispatch",value:function(){return this.navigate(_["default"].getCurrentBrowserPath(),!0)}},{key:"doNavigate_",value:function(e,t){var a=this,n=this.findRoute(e);if(!n)return this.pendingNavigate=p["default"].reject(new p["default"].CancellationError("No route for "+e)),this.pendingNavigate;this.stopPendingNavigate_(),this.isNavigationPending=!0;var r=this.createScreenInstance(e,n);return this.maybePreventDeactivate_().then(function(){return a.maybePreventActivate_(r)}).then(function(){return r.load(e)}).then(function(){a.activeScreen&&a.activeScreen.deactivate(),a.prepareNavigateHistory_(e,r,t),a.prepareNavigateSurfaces_(r,a.surfaces,a.extractParams(n,e))}).then(function(){return r.evaluateStyles(a.surfaces)}).then(function(){return r.flip(a.surfaces)}).then(function(){return r.evaluateScripts(a.surfaces)}).then(function(){return a.maybeUpdateScrollPositionState_()}).then(function(){return a.syncScrollPositionSyncThenAsync_()}).then(function(){return a.finalizeNavigate_(e,r)}).then(function(){return a.maybeOverloadBeforeUnload_()})["catch"](function(t){throw a.isNavigationPending=!1,a.handleNavigateError_(e,r,t),t})}},{key:"extractParams",value:function(e,t){return e.extractParams(this.getRoutePath(t))}},{key:"finalizeNavigate_",value:function(e,t){t.activate(),this.activeScreen&&!this.activeScreen.isCacheable()&&this.activeScreen!==t&&this.removeScreen(this.activePath),this.activePath=e,this.activeScreen=t,this.browserPathBeforeNavigate=_["default"].getCurrentBrowserPathWithoutHash(),this.screens[e]=t,this.isNavigationPending=!1,this.pendingNavigate=null,m["default"].capturedFormElement=null,m["default"].capturedFormButtonElement=null}},{key:"findRoute",value:function(e){e=this.getRoutePath(e);for(var t=0;t<this.routes.length;t++){var a=this.routes[t];if(a.matchesPath(e))return a}return null}},{key:"getAllowPreventNavigate",value:function(){return this.allowPreventNavigate}},{key:"getBasePath",value:function(){return this.basePath}},{key:"getDefaultTitle",value:function(){return this.defaultTitle}},{key:"getFormSelector",value:function(){return this.formSelector}},{key:"getIgnoreQueryStringFromRoutePath",value:function(){return this.ignoreQueryStringFromRoutePath}},{key:"getLinkSelector",value:function(){return this.linkSelector}},{key:"getLoadingCssClass",value:function(){return this.loadingCssClass}},{key:"getRoutePath",value:function(e){return this.getIgnoreQueryStringFromRoutePath()?(e=_["default"].getUrlPathWithoutHashAndSearch(e),_["default"].getUrlPathWithoutHashAndSearch(e.substr(this.basePath.length))):(e=_["default"].getUrlPathWithoutHash(e),_["default"].getUrlPathWithoutHash(e.substr(this.basePath.length)))}},{key:"getUpdateScrollPosition",value:function(){return this.updateScrollPosition}},{key:"handleNavigateError_",value:function(e,t,a){var n=this;this.emit("navigationError",{error:a,nextScreen:t,path:e}),_["default"].isCurrentBrowserPath(e)||(this.isNavigationPending&&this.pendingNavigate?this.pendingNavigate.thenAlways(function(){return n.removeScreen(e)},this):this.removeScreen(e))}},{key:"hasRoutes",value:function(){return this.routes.length>0}},{key:"isLinkSameOrigin_",value:function(e){return e===m["default"].window.location.host}},{key:"isSameBasePath_",value:function(e){return 0===e.indexOf(this.basePath)}},{key:"lockHistoryScrollPosition_",value:function(){var e=m["default"].window.history.state;if(e){var t=!1,n=function r(){m["default"].document.removeEventListener("scroll",r,!1),t||(m["default"].window.scrollTo(e.scrollLeft,e.scrollTop),t=!0)};a.async.nextTick(n),m["default"].document.addEventListener("scroll",n,!1)}}},{key:"maybeDisableNativeScrollRestoration",value:function(){this.nativeScrollRestorationSupported&&(this.nativeScrollRestoration_=m["default"].window.history.scrollRestoration,m["default"].window.history.scrollRestoration="manual")}},{key:"maybeNavigate_",value:function(e,t){if(this.canNavigate(e)){m["default"].capturedFormElement=t.capturedFormElement,m["default"].capturedFormButtonElement=t.capturedFormButtonElement;var a=!1;try{this.navigate(_["default"].getUrlPath(e),!1,t)}catch(n){a=!0}a||t.preventDefault()}}},{key:"maybeOverloadBeforeUnload_",value:function(){var e=this;"function"==typeof window.onbeforeunload&&(window._onbeforeunload=window.onbeforeunload,window.onbeforeunload=function(t){if(e.emit("beforeUnload",t),t&&t.defaultPrevented)return!0},window.onbeforeunload._overloaded=!0)}},{key:"maybePreventActivate_",value:function(e){var t=this;return p["default"].resolve().then(function(){return e.beforeActivate()}).then(function(e){if(e)return t.pendingNavigate=p["default"].reject(new p["default"].CancellationError("Cancelled by next screen")),t.pendingNavigate})}},{key:"maybePreventDeactivate_",value:function(){var e=this;return p["default"].resolve().then(function(){if(e.activeScreen)return e.activeScreen.beforeDeactivate()}).then(function(t){if(t)return e.pendingNavigate=p["default"].reject(new p["default"].CancellationError("Cancelled by active screen")),e.pendingNavigate})}},{key:"maybeRepositionScrollToHashedAnchor",value:function(){var e=m["default"].window.location.hash;if(e){var t=m["default"].document.getElementById(e.substring(1));if(t){var a=_["default"].getNodeOffset(t),n=a.offsetLeft,r=a.offsetTop;m["default"].window.scrollTo(n,r)}}}},{key:"maybeRestoreNativeScrollRestoration",value:function(){this.nativeScrollRestorationSupported&&this.nativeScrollRestoration_&&(m["default"].window.history.scrollRestoration=this.nativeScrollRestoration_)}},{key:"maybeRestoreRedirectPathHash_",value:function(e,t,a){return t===_["default"].getUrlPathWithoutHash(e)?t+a:t}},{key:"maybeUpdateScrollPositionState_",value:function(){var e=m["default"].window.location.hash,t=m["default"].document.getElementById(e.substring(1));if(t){var a=_["default"].getNodeOffset(t),n=a.offsetLeft,r=a.offsetTop;this.saveHistoryCurrentPageScrollPosition_(r,n)}}},{key:"navigate",value:function(e,t,a){if(!_["default"].isHtml5HistorySupported())throw new Error("HTML5 History is not supported. Senna will not intercept navigation.");return e===this.activePath&&(t=!0),this.emit("beforeNavigate",{event:a,path:e,replaceHistory:!!t}),this.pendingNavigate}},{key:"onBeforeNavigate_",value:function(e){m["default"].capturedFormElement&&(e.form=m["default"].capturedFormElement)}},{key:"onBeforeNavigateDefault_",value:function(e){this.pendingNavigate&&this.pendingNavigate.path===e.path||(this.emit("beforeUnload",e),this.emit("startNavigate",{form:e.form,path:e.path,replaceHistory:e.replaceHistory}))}},{key:"onBeforeUnloadDefault_",value:function(e){var t=window._onbeforeunload;t&&!t._overloaded&&t()&&e.preventDefault()}},{key:"onDocClickDelegate_",value:function(e){e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.button||this.maybeNavigate_(e.delegateTarget.href,e)}},{key:"onDocSubmitDelegate_",value:function(e){var a=e.delegateTarget;if("get"!==a.method){e.capturedFormElement=a;var n="button:not([type]),button[type=submit],input[type=submit]";(0,t.match)(m["default"].document.activeElement,n)?e.capturedFormButtonElement=m["default"].document.activeElement:e.capturedFormButtonElement=a.querySelector(n),this.maybeNavigate_(a.action,e)}}},{key:"onLoad_",value:function(){var e=this;this.skipLoadPopstate=!0,setTimeout(function(){e.skipLoadPopstate=!1},0),this.maybeRepositionScrollToHashedAnchor()}},{key:"onPopstate_",value:function(e){if(!this.skipLoadPopstate){if(_["default"].isCurrentBrowserPath(this.browserPathBeforeNavigate))return void this.maybeRepositionScrollToHashedAnchor();var t=e.state;return t?void(t.senna&&(this.popstateScrollTop=t.scrollTop,this.popstateScrollLeft=t.scrollLeft,this.nativeScrollRestorationSupported||this.lockHistoryScrollPosition_(),this.once("endNavigate",function(){t.referrer&&_["default"].setReferrer(t.referrer)}),this.navigate(t.path,!0))):void(m["default"].window.location.hash?(this.redirectPath&&!_["default"].isCurrentBrowserPath(this.redirectPath)&&this.reloadPage(),this.maybeRepositionScrollToHashedAnchor()):this.reloadPage())}}},{key:"onScroll_",value:function(){this.captureScrollPositionFromScrollEvent&&this.saveHistoryCurrentPageScrollPosition_(m["default"].window.pageYOffset,m["default"].window.pageXOffset)}},{key:"onStartNavigate_",value:function(e){var a=this;this.maybeDisableNativeScrollRestoration(),this.captureScrollPositionFromScrollEvent=!1,(0,t.addClasses)(m["default"].document.documentElement,this.loadingCssClass);var n={form:e.form,path:e.path};this.pendingNavigate=this.doNavigate_(e.path,e.replaceHistory)["catch"](function(e){throw n.error=e,e}).thenAlways(function(){a.pendingNavigate||((0,t.removeClasses)(m["default"].document.documentElement,a.loadingCssClass),a.maybeRestoreNativeScrollRestoration(),a.captureScrollPositionFromScrollEvent=!0),a.emit("endNavigate",n)}),this.pendingNavigate.path=e.path}},{key:"prefetch",value:function(e){var t=this,a=this.findRoute(e);if(!a)return p["default"].reject(new p["default"].CancellationError("No route for "+e));var n=this.createScreenInstance(e,a);return n.load(e).then(function(){return t.screens[e]=n})["catch"](function(a){throw t.handleNavigateError_(e,n,a),a})}},{key:"prepareNavigateHistory_",value:function(e,t,n){var r=t.getTitle();(0,a.isString)(r)||(r=this.getDefaultTitle());var o=t.beforeUpdateHistoryPath(e),i={form:(0,a.isDefAndNotNull)(m["default"].capturedFormElement),path:e,redirectPath:o,scrollLeft:0,scrollTop:0,senna:!0};n&&(i.scrollTop=this.popstateScrollTop,i.scrollLeft=this.popstateScrollLeft);var l=new b["default"](e).getHash();o=this.maybeRestoreRedirectPathHash_(e,o,l),this.updateHistory_(r,o,t.beforeUpdateHistoryState(i),n),this.redirectPath=o}},{key:"prepareNavigateSurfaces_",value:function(e,t,a){Object.keys(t).forEach(function(n){var r=e.getSurfaceContent(n,a);t[n].addContent(e.getId(),r)})}},{key:"reloadPage",value:function(){m["default"].window.location.reload()}},{key:"removeRoute",value:function(e){return a.array.remove(this.routes,e)}},{key:"removeScreen",value:function(e){var t=this,a=this.screens[e];a&&(Object.keys(this.surfaces).forEach(function(e){return t.surfaces[e].remove(a.getId())}),a.dispose(),delete this.screens[e])}},{key:"saveHistoryCurrentPageScrollPosition_",value:function(e,t){var a=m["default"].window.history.state;if(a&&a.senna){var n=[e,t];a.scrollTop=n[0],a.scrollLeft=n[1],m["default"].window.history.replaceState(a,null,null)}}},{key:"setAllowPreventNavigate",value:function(e){this.allowPreventNavigate=e}},{key:"setBasePath",value:function(e){this.basePath=_["default"].removePathTrailingSlash(e)}},{key:"setDefaultTitle",value:function(e){this.defaultTitle=e}},{key:"setFormSelector",value:function(e){this.formSelector=e,this.formEventHandler_&&this.formEventHandler_.removeListener(),this.formEventHandler_=(0,t.delegate)(document,"submit",this.formSelector,this.onDocSubmitDelegate_.bind(this),this.allowPreventNavigate)}},{key:"setIgnoreQueryStringFromRoutePath",value:function(e){this.ignoreQueryStringFromRoutePath=e}},{key:"setLinkSelector",value:function(e){this.linkSelector=e,this.linkEventHandler_&&this.linkEventHandler_.removeListener(),this.linkEventHandler_=(0,t.delegate)(document,"click",this.linkSelector,this.onDocClickDelegate_.bind(this),this.allowPreventNavigate)}},{key:"setLoadingCssClass",value:function(e){this.loadingCssClass=e}},{key:"setUpdateScrollPosition",value:function(e){this.updateScrollPosition=e}},{key:"stopPendingNavigate_",value:function(){this.pendingNavigate&&(this.pendingNavigate.cancel("Cancel pending navigation"),this.pendingNavigate=null)}},{key:"syncScrollPositionSyncThenAsync_",value:function(){var e=this,t=m["default"].window.history.state;if(t){var n=t.scrollTop,r=t.scrollLeft,o=function(){e.updateScrollPosition&&m["default"].window.scrollTo(r,n)};return new p["default"](function(e){return o()&a.async.nextTick(function(){return o()&e()})})}}},{key:"updateHistory_",value:function(e,t,a,n){var r=m["default"].window.location.href;a&&(a.referrer=r),n?m["default"].window.history.replaceState(a,e,t):m["default"].window.history.pushState(a,e,t),_["default"].setReferrer(r);var o=m["default"].document.querySelector("title");o?o.innerHTML=e:m["default"].document.title=e}}]),r}(n.EventEmitter);e["default"]=E});