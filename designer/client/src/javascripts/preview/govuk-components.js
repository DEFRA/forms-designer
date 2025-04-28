(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/accordion/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/accordion/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukAccordion");
context.setVariable("govukAccordion", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/accordion/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/accordion/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../../macros/i18n.njk", false, "components/accordion/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukI18nAttributes")) {
var t_8 = t_5.govukI18nAttributes;
} else {
cb(new Error("cannot import 'govukI18nAttributes'")); return;
}
context.setVariable("govukI18nAttributes", t_8);
var macro_t_9 = runtime.makeMacro(
["params", "item", "index"], 
[], 
function (l_params, l_item, l_index, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
frame.set("item", l_item);
frame.set("index", l_index);
var t_10 = "";var t_11;
t_11 = (runtime.memberLookup((l_params),"headingLevel")?runtime.memberLookup((l_params),"headingLevel"):2);
frame.set("headingLevel", t_11, true);
if(frame.topLevel) {
context.setVariable("headingLevel", t_11);
}
if(frame.topLevel) {
context.addExport("headingLevel", t_11);
}
t_10 += "\n  <div class=\"govuk-accordion__section";
if(runtime.memberLookup((l_item),"expanded")) {
t_10 += " govuk-accordion__section--expanded";
;
}
t_10 += "\">\n    <div class=\"govuk-accordion__section-header\">\n      <h";
t_10 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "headingLevel"), env.opts.autoescape);
t_10 += " class=\"govuk-accordion__section-heading\">\n        <span class=\"govuk-accordion__section-button\" id=\"";
t_10 += runtime.suppressValue(runtime.memberLookup((l_params),"id"), env.opts.autoescape);
t_10 += "-heading-";
t_10 += runtime.suppressValue(l_index, env.opts.autoescape);
t_10 += "\">\n          ";
t_10 += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((l_item),"heading")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"heading")),"html"))),8):runtime.memberLookup((runtime.memberLookup((l_item),"heading")),"text")), env.opts.autoescape);
t_10 += "\n        </span>\n      </h";
t_10 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "headingLevel"), env.opts.autoescape);
t_10 += ">\n      ";
if(runtime.memberLookup((runtime.memberLookup((l_item),"summary")),"html") || runtime.memberLookup((runtime.memberLookup((l_item),"summary")),"text")) {
t_10 += "\n      <div class=\"govuk-accordion__section-summary govuk-body\" id=\"";
t_10 += runtime.suppressValue(runtime.memberLookup((l_params),"id"), env.opts.autoescape);
t_10 += "-summary-";
t_10 += runtime.suppressValue(l_index, env.opts.autoescape);
t_10 += "\">\n        ";
t_10 += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((l_item),"summary")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"summary")),"html"))),8):runtime.memberLookup((runtime.memberLookup((l_item),"summary")),"text")), env.opts.autoescape);
t_10 += "\n      </div>\n      ";
;
}
t_10 += "\n    </div>\n    <div id=\"";
t_10 += runtime.suppressValue(runtime.memberLookup((l_params),"id"), env.opts.autoescape);
t_10 += "-content-";
t_10 += runtime.suppressValue(l_index, env.opts.autoescape);
t_10 += "\" class=\"govuk-accordion__section-content\">\n    ";
if(runtime.memberLookup((runtime.memberLookup((l_item),"content")),"html")) {
t_10 += "\n      ";
t_10 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"content")),"html"))),6), env.opts.autoescape);
t_10 += "\n    ";
;
}
else {
if(runtime.memberLookup((runtime.memberLookup((l_item),"content")),"text")) {
t_10 += "\n      <p class=\"govuk-body\">\n        ";
t_10 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"content")),"text")),8), env.opts.autoescape);
t_10 += "\n      </p>\n    ";
;
}
;
}
t_10 += "\n    </div>\n  </div>\n";
;
frame = callerFrame;
return new runtime.SafeString(t_10);
});
context.setVariable("_accordionItem", macro_t_9);
output += "<div class=\"govuk-accordion";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\" data-module=\"govuk-accordion\" id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 31, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "hide-all-sections","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hideAllSectionsText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 36, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "hide-section","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hideSectionText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 41, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "hide-section-aria-label","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hideSectionAriaLabelText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 46, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "show-all-sections","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"showAllSectionsText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 51, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "show-section","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"showSectionText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 56, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "show-section-aria-label","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"showSectionAriaLabelText")}])), env.opts.autoescape);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"rememberExpanded") !== runtime.contextOrFrameLookup(context, frame, "undefined")) {
output += " data-remember-expanded=\"";
output += runtime.suppressValue(env.getFilter("escape").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"rememberExpanded")), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 62, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
frame = frame.push();
var t_14 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_14) {t_14 = runtime.fromIterator(t_14);
var t_13 = t_14.length;
for(var t_12=0; t_12 < t_14.length; t_12++) {
var t_15 = t_14[t_12];
frame.set("item", t_15);
frame.set("loop.index", t_12 + 1);
frame.set("loop.index0", t_12);
frame.set("loop.revindex", t_13 - t_12);
frame.set("loop.revindex0", t_13 - t_12 - 1);
frame.set("loop.first", t_12 === 0);
frame.set("loop.last", t_12 === t_13 - 1);
frame.set("loop.length", t_13);
output += "\n    ";
if(t_15) {
output += runtime.suppressValue((lineno = 64, colno = 34, runtime.callWrap(macro_t_9, "_accordionItem", context, [runtime.contextOrFrameLookup(context, frame, "params"),t_15,runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"index")])), env.opts.autoescape);
;
}
output += "\n  ";
;
}
}
frame = frame.pop();
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/back-link/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/back-link/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukBackLink");
context.setVariable("govukBackLink", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/back-link/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/back-link/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<a href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"href"),"#",true), env.opts.autoescape);
output += "\" class=\"govuk-back-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")):(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text"),"Back",true))), env.opts.autoescape);
output += "</a>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/breadcrumbs/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/breadcrumbs/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukBreadcrumbs");
context.setVariable("govukBreadcrumbs", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/breadcrumbs/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/breadcrumbs/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var t_5;
t_5 = "govuk-breadcrumbs";
frame.set("classNames", t_5, true);
if(frame.topLevel) {
context.setVariable("classNames", t_5);
}
if(frame.topLevel) {
context.addExport("classNames", t_5);
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += "\n  ";
var t_6;
t_6 = runtime.contextOrFrameLookup(context, frame, "classNames") + " " + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes");
frame.set("classNames", t_6, true);
if(frame.topLevel) {
context.setVariable("classNames", t_6);
}
if(frame.topLevel) {
context.addExport("classNames", t_6);
}
output += "\n";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"collapseOnMobile")) {
output += "\n  ";
var t_7;
t_7 = runtime.contextOrFrameLookup(context, frame, "classNames") + " govuk-breadcrumbs--collapse-on-mobile";
frame.set("classNames", t_7, true);
if(frame.topLevel) {
context.setVariable("classNames", t_7);
}
if(frame.topLevel) {
context.addExport("classNames", t_7);
}
output += "\n";
;
}
output += "<nav class=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "classNames"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 13, colno = 49, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += " aria-label=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"labelText"),"Breadcrumb"), env.opts.autoescape);
output += "\">\n  <ol class=\"govuk-breadcrumbs__list\">\n";
frame = frame.push();
var t_10 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_10) {t_10 = runtime.fromIterator(t_10);
var t_9 = t_10.length;
for(var t_8=0; t_8 < t_10.length; t_8++) {
var t_11 = t_10[t_8];
frame.set("item", t_11);
frame.set("loop.index", t_8 + 1);
frame.set("loop.index0", t_8);
frame.set("loop.revindex", t_9 - t_8);
frame.set("loop.revindex0", t_9 - t_8 - 1);
frame.set("loop.first", t_8 === 0);
frame.set("loop.last", t_8 === t_9 - 1);
frame.set("loop.length", t_9);
output += "\n  ";
if(runtime.memberLookup((t_11),"href")) {
output += "\n    <li class=\"govuk-breadcrumbs__list-item\">\n      <a class=\"govuk-breadcrumbs__link\" href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_11),"href"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 18, colno = 83, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_11),"attributes")])), env.opts.autoescape);
output += ">";
output += runtime.suppressValue((runtime.memberLookup((t_11),"html")?env.getFilter("safe").call(context, runtime.memberLookup((t_11),"html")):runtime.memberLookup((t_11),"text")), env.opts.autoescape);
output += "</a>\n    </li>\n  ";
;
}
else {
output += "\n    <li class=\"govuk-breadcrumbs__list-item\" aria-current=\"page\">";
output += runtime.suppressValue((runtime.memberLookup((t_11),"html")?env.getFilter("safe").call(context, runtime.memberLookup((t_11),"html")):runtime.memberLookup((t_11),"text")), env.opts.autoescape);
output += "</li>\n  ";
;
}
output += "\n";
;
}
}
frame = frame.pop();
output += "\n  </ol>\n</nav>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/button/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/button/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukButton");
context.setVariable("govukButton", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/button/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/button/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var t_5;
t_5 = "govuk-button";
frame.set("classNames", t_5, true);
if(frame.topLevel) {
context.setVariable("classNames", t_5);
}
if(frame.topLevel) {
context.addExport("classNames", t_5);
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += "\n  ";
var t_6;
t_6 = runtime.contextOrFrameLookup(context, frame, "classNames") + " " + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes");
frame.set("classNames", t_6, true);
if(frame.topLevel) {
context.setVariable("classNames", t_6);
}
if(frame.topLevel) {
context.addExport("classNames", t_6);
}
output += "\n";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"isStartButton")) {
output += "\n  ";
var t_7;
t_7 = runtime.contextOrFrameLookup(context, frame, "classNames") + " govuk-button--start";
frame.set("classNames", t_7, true);
if(frame.topLevel) {
context.setVariable("classNames", t_7);
}
if(frame.topLevel) {
context.addExport("classNames", t_7);
}
output += "\n";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"element")) {
output += "\n  ";
var t_8;
t_8 = env.getFilter("lower").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"element"));
frame.set("element", t_8, true);
if(frame.topLevel) {
context.setVariable("element", t_8);
}
if(frame.topLevel) {
context.addExport("element", t_8);
}
output += "\n";
;
}
else {
output += "\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"href")) {
output += "\n    ";
var t_9;
t_9 = "a";
frame.set("element", t_9, true);
if(frame.topLevel) {
context.setVariable("element", t_9);
}
if(frame.topLevel) {
context.addExport("element", t_9);
}
output += "\n  ";
;
}
else {
output += "\n    ";
var t_10;
t_10 = "button";
frame.set("element", t_10, true);
if(frame.topLevel) {
context.setVariable("element", t_10);
}
if(frame.topLevel) {
context.addExport("element", t_10);
}
output += "\n  ";
;
}
output += "\n";
;
}
var macro_t_11 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
var t_12 = "";t_12 += "\n  <svg class=\"govuk-button__start-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"17.5\" height=\"19\" viewBox=\"0 0 33 40\" aria-hidden=\"true\" focusable=\"false\">\n    <path fill=\"currentColor\" d=\"M0 0h13l20 20-20 20H0l20-20z\"/>\n  </svg>";
;
frame = callerFrame;
return new runtime.SafeString(t_12);
});
context.setVariable("_startIcon", macro_t_11);
var t_13;
t_13 = (function() {
var output = "";
output += " class=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "classNames"), env.opts.autoescape);
output += "\" data-module=\"govuk-button\"";
output += runtime.suppressValue((lineno = 35, colno = 99, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
;
return output;
})()
;
frame.set("commonAttributes", t_13, true);
if(frame.topLevel) {
context.setVariable("commonAttributes", t_13);
}
if(frame.topLevel) {
context.addExport("commonAttributes", t_13);
}
var t_14;
t_14 = (function() {
var output = "";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name")) {
output += " name=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disabled")) {
output += " disabled aria-disabled=\"true\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"preventDoubleClick") !== runtime.contextOrFrameLookup(context, frame, "undefined")) {
output += " data-prevent-double-click=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"preventDoubleClick"), env.opts.autoescape);
output += "\"";
;
}
;
return output;
})()
;
frame.set("buttonAttributes", t_14, true);
if(frame.topLevel) {
context.setVariable("buttonAttributes", t_14);
}
if(frame.topLevel) {
context.addExport("buttonAttributes", t_14);
}
if(runtime.contextOrFrameLookup(context, frame, "element") == "a") {
output += "\n<a href=\"";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"href")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"href"):"#"), env.opts.autoescape);
output += "\" role=\"button\" draggable=\"false\"";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "commonAttributes")), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),2):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"isStartButton")?env.getFilter("safe").call(context, (lineno = 46, colno = 16, runtime.callWrap(macro_t_11, "_startIcon", context, []))):""), env.opts.autoescape);
output += "\n</a>";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "element") == "button") {
output += "\n<button";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value")) {
output += " value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value"), env.opts.autoescape);
output += "\"";
;
}
output += " type=\"";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"type")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"type"):"submit"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "buttonAttributes")), env.opts.autoescape);
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "commonAttributes")), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),2):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"isStartButton")?env.getFilter("safe").call(context, (lineno = 52, colno = 16, runtime.callWrap(macro_t_11, "_startIcon", context, []))):""), env.opts.autoescape);
output += "\n</button>";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "element") == "input") {
output += "\n<input value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text"), env.opts.autoescape);
output += "\" type=\"";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"type")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"type"):"submit"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "buttonAttributes")), env.opts.autoescape);
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "commonAttributes")), env.opts.autoescape);
output += ">";
;
}
;
}
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/character-count/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/character-count/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukCharacterCount");
context.setVariable("govukCharacterCount", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/character-count/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/character-count/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../../macros/i18n.njk", false, "components/character-count/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukI18nAttributes")) {
var t_8 = t_5.govukI18nAttributes;
} else {
cb(new Error("cannot import 'govukI18nAttributes'")); return;
}
context.setVariable("govukI18nAttributes", t_8);
output += "\n";
env.getTemplate("../textarea/macro.njk", false, "components/character-count/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukTextarea")) {
var t_12 = t_9.govukTextarea;
} else {
cb(new Error("cannot import 'govukTextarea'")); return;
}
context.setVariable("govukTextarea", t_12);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/character-count/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukHint")) {
var t_16 = t_13.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_16);
var t_17;
t_17 = (!runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"maxwords") && !runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"maxlength"));
frame.set("hasNoLimit", t_17, true);
if(frame.topLevel) {
context.setVariable("hasNoLimit", t_17);
}
if(frame.topLevel) {
context.addExport("hasNoLimit", t_17);
}
var t_18;
t_18 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"maxwords") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"maxlength");
frame.set("textareaDescriptionLength", t_18, true);
if(frame.topLevel) {
context.setVariable("textareaDescriptionLength", t_18);
}
if(frame.topLevel) {
context.addExport("textareaDescriptionLength", t_18);
}
var t_19;
t_19 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"textareaDescriptionText") || "You can enter up to %{count} " + ((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"maxwords")?"words":"characters"));
frame.set("textareaDescriptionText", t_19, true);
if(frame.topLevel) {
context.setVariable("textareaDescriptionText", t_19);
}
if(frame.topLevel) {
context.addExport("textareaDescriptionText", t_19);
}
var t_20;
t_20 = (!runtime.contextOrFrameLookup(context, frame, "hasNoLimit")?env.getFilter("replace").call(context, runtime.contextOrFrameLookup(context, frame, "textareaDescriptionText"),"%{count}",runtime.contextOrFrameLookup(context, frame, "textareaDescriptionLength")):"");
frame.set("textareaDescriptionTextNoLimit", t_20, true);
if(frame.topLevel) {
context.setVariable("textareaDescriptionTextNoLimit", t_20);
}
if(frame.topLevel) {
context.addExport("textareaDescriptionTextNoLimit", t_20);
}
var t_21;
t_21 = (function() {
var output = "";
output += "\n";
output += runtime.suppressValue(env.getFilter("trim").call(context, (lineno = 16, colno = 12, runtime.callWrap(t_16, "govukHint", context, [{"text": runtime.contextOrFrameLookup(context, frame, "textareaDescriptionTextNoLimit"),"id": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-info","classes": "govuk-character-count__message" + ((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"countMessage")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"countMessage")),"classes"):""))}]))), env.opts.autoescape);
output += "\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")) {
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html")?env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html"))):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
;
return output;
})()
;
frame.set("countMessageHtml", t_21, true);
if(frame.topLevel) {
context.setVariable("countMessageHtml", t_21);
}
if(frame.topLevel) {
context.addExport("countMessageHtml", t_21);
}
var t_22;
t_22 = (function() {
var output = "";
output += runtime.suppressValue((lineno = 27, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [{"data-module": "govuk-character-count","data-maxlength": {"value": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"maxlength"),"optional": true},"data-threshold": {"value": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"threshold"),"optional": true},"data-maxwords": {"value": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"maxwords"),"optional": true}}])), env.opts.autoescape);
if(runtime.contextOrFrameLookup(context, frame, "hasNoLimit") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"textareaDescriptionText")) {
output += runtime.suppressValue((lineno = 50, colno = 27, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "textarea-description","messages": {"other": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"textareaDescriptionText")}}])), env.opts.autoescape);
;
}
output += runtime.suppressValue((lineno = 56, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "characters-under-limit","messages": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"charactersUnderLimitText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 61, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "characters-at-limit","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"charactersAtLimitText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 66, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "characters-over-limit","messages": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"charactersOverLimitText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 71, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "words-under-limit","messages": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"wordsUnderLimitText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 76, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "words-at-limit","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"wordsAtLimitText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 81, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "words-over-limit","messages": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"wordsOverLimitText")}])), env.opts.autoescape);
;
return output;
})()
;
frame.set("attributesHtml", t_22, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_22);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_22);
}
frame = frame.push();
var t_25 = runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes");
if(t_25) {t_25 = runtime.fromIterator(t_25);
var t_23;
if(runtime.isArray(t_25)) {
var t_24 = t_25.length;
for(t_23=0; t_23 < t_25.length; t_23++) {
var t_26 = t_25[t_23][0];
frame.set("[object Object]", t_25[t_23][0]);
var t_27 = t_25[t_23][1];
frame.set("[object Object]", t_25[t_23][1]);
frame.set("loop.index", t_23 + 1);
frame.set("loop.index0", t_23);
frame.set("loop.revindex", t_24 - t_23);
frame.set("loop.revindex0", t_24 - t_23 - 1);
frame.set("loop.first", t_23 === 0);
frame.set("loop.last", t_23 === t_24 - 1);
frame.set("loop.length", t_24);
output += "\n  ";
var t_28;
t_28 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_26) + "=\"" + env.getFilter("escape").call(context, t_27) + "\"";
frame.set("attributesHtml", t_28, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_28);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_28);
}
output += "\n";
;
}
} else {
t_23 = -1;
var t_24 = runtime.keys(t_25).length;
for(var t_29 in t_25) {
t_23++;
var t_30 = t_25[t_29];
frame.set("name", t_29);
frame.set("value", t_30);
frame.set("loop.index", t_23 + 1);
frame.set("loop.index0", t_23);
frame.set("loop.revindex", t_24 - t_23);
frame.set("loop.revindex0", t_24 - t_23 - 1);
frame.set("loop.first", t_23 === 0);
frame.set("loop.last", t_23 === t_24 - 1);
frame.set("loop.length", t_24);
output += "\n  ";
var t_31;
t_31 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_29) + "=\"" + env.getFilter("escape").call(context, t_30) + "\"";
frame.set("attributesHtml", t_31, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_31);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_31);
}
output += "\n";
;
}
}
}
frame = frame.pop();
output += runtime.suppressValue(env.getFilter("trim").call(context, (lineno = 92, colno = 16, runtime.callWrap(t_12, "govukTextarea", context, [{"id": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"),"name": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"),"describedBy": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-info","rows": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"rows"),"spellcheck": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"spellcheck"),"value": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value"),"formGroup": {"classes": "govuk-character-count" + ((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"):"")),"attributes": runtime.contextOrFrameLookup(context, frame, "attributesHtml"),"beforeInput": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput"),"afterInput": {"html": runtime.contextOrFrameLookup(context, frame, "countMessageHtml")}},"classes": "govuk-js-character-count" + ((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")?" " + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"):"")),"label": {"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"text"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"classes"),"isPageHeading": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"isPageHeading"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"attributes"),"for": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")},"hint": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint"),"errorMessage": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage"),"attributes": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")}]))), env.opts.autoescape);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/checkboxes/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/checkboxes/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukCheckboxes");
context.setVariable("govukCheckboxes", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/checkboxes/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/checkboxes/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../error-message/macro.njk", false, "components/checkboxes/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukErrorMessage")) {
var t_8 = t_5.govukErrorMessage;
} else {
cb(new Error("cannot import 'govukErrorMessage'")); return;
}
context.setVariable("govukErrorMessage", t_8);
output += "\n";
env.getTemplate("../fieldset/macro.njk", false, "components/checkboxes/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukFieldset")) {
var t_12 = t_9.govukFieldset;
} else {
cb(new Error("cannot import 'govukFieldset'")); return;
}
context.setVariable("govukFieldset", t_12);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/checkboxes/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukHint")) {
var t_16 = t_13.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_16);
output += "\n";
env.getTemplate("../label/macro.njk", false, "components/checkboxes/template.njk", false, function(t_18,t_17) {
if(t_18) { cb(t_18); return; }
t_17.getExported(function(t_19,t_17) {
if(t_19) { cb(t_19); return; }
if(Object.prototype.hasOwnProperty.call(t_17, "govukLabel")) {
var t_20 = t_17.govukLabel;
} else {
cb(new Error("cannot import 'govukLabel'")); return;
}
context.setVariable("govukLabel", t_20);
var t_21;
t_21 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix"):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"));
frame.set("idPrefix", t_21, true);
if(frame.topLevel) {
context.setVariable("idPrefix", t_21);
}
if(frame.topLevel) {
context.addExport("idPrefix", t_21);
}
var t_22;
t_22 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy"):"");
frame.set("describedBy", t_22, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_22);
}
if(frame.topLevel) {
context.addExport("describedBy", t_22);
}
output += "\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"describedBy")) {
output += "\n  ";
var t_23;
t_23 = runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"describedBy");
frame.set("describedBy", t_23, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_23);
}
if(frame.topLevel) {
context.addExport("describedBy", t_23);
}
output += "\n";
;
}
var t_24;
t_24 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")?true:false);
frame.set("hasFieldset", t_24, true);
if(frame.topLevel) {
context.setVariable("hasFieldset", t_24);
}
if(frame.topLevel) {
context.addExport("hasFieldset", t_24);
}
var macro_t_25 = runtime.makeMacro(
["params", "item", "index"], 
[], 
function (l_params, l_item, l_index, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
frame.set("item", l_item);
frame.set("index", l_index);
var t_26 = "";var t_27;
t_27 = (runtime.memberLookup((l_item),"id")?runtime.memberLookup((l_item),"id"):runtime.contextOrFrameLookup(context, frame, "idPrefix") + ((l_index > 1?"-" + l_index:"")));
frame.set("itemId", t_27, true);
if(frame.topLevel) {
context.setVariable("itemId", t_27);
}
if(frame.topLevel) {
context.addExport("itemId", t_27);
}
t_26 += "\n  ";
var t_28;
t_28 = (runtime.memberLookup((l_item),"name")?runtime.memberLookup((l_item),"name"):runtime.memberLookup((l_params),"name"));
frame.set("itemName", t_28, true);
if(frame.topLevel) {
context.setVariable("itemName", t_28);
}
if(frame.topLevel) {
context.addExport("itemName", t_28);
}
t_26 += "\n  ";
var t_29;
t_29 = "conditional-" + runtime.contextOrFrameLookup(context, frame, "itemId");
frame.set("conditionalId", t_29, true);
if(frame.topLevel) {
context.setVariable("conditionalId", t_29);
}
if(frame.topLevel) {
context.addExport("conditionalId", t_29);
}
if(runtime.memberLookup((l_item),"divider")) {
t_26 += "\n    <div class=\"govuk-checkboxes__divider\">";
t_26 += runtime.suppressValue(runtime.memberLookup((l_item),"divider"), env.opts.autoescape);
t_26 += "</div>\n  ";
;
}
else {
t_26 += "\n    ";
var t_30;
t_30 = env.getFilter("default").call(context, runtime.memberLookup((l_item),"checked"),(runtime.memberLookup((l_params),"values")?(runtime.inOperator(runtime.memberLookup((l_item),"value"),runtime.memberLookup((l_params),"values")) && runtime.memberLookup((l_item),"checked") != false):false),true);
frame.set("isChecked", t_30, true);
if(frame.topLevel) {
context.setVariable("isChecked", t_30);
}
if(frame.topLevel) {
context.addExport("isChecked", t_30);
}
t_26 += "\n    ";
var t_31;
t_31 = (runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"text") || runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"html")?true:"");
frame.set("hasHint", t_31, true);
if(frame.topLevel) {
context.setVariable("hasHint", t_31);
}
if(frame.topLevel) {
context.addExport("hasHint", t_31);
}
t_26 += "\n    ";
var t_32;
t_32 = (runtime.contextOrFrameLookup(context, frame, "hasHint")?runtime.contextOrFrameLookup(context, frame, "itemId") + "-item-hint":"");
frame.set("itemHintId", t_32, true);
if(frame.topLevel) {
context.setVariable("itemHintId", t_32);
}
if(frame.topLevel) {
context.addExport("itemHintId", t_32);
}
t_26 += "\n    ";
var t_33;
t_33 = (!runtime.contextOrFrameLookup(context, frame, "hasFieldset")?runtime.contextOrFrameLookup(context, frame, "describedBy"):"");
frame.set("itemDescribedBy", t_33, true);
if(frame.topLevel) {
context.setVariable("itemDescribedBy", t_33);
}
if(frame.topLevel) {
context.addExport("itemDescribedBy", t_33);
}
t_26 += "\n    ";
var t_34;
t_34 = env.getFilter("trim").call(context, (runtime.contextOrFrameLookup(context, frame, "itemDescribedBy") + " " + runtime.contextOrFrameLookup(context, frame, "itemHintId")));
frame.set("itemDescribedBy", t_34, true);
if(frame.topLevel) {
context.setVariable("itemDescribedBy", t_34);
}
if(frame.topLevel) {
context.addExport("itemDescribedBy", t_34);
}
t_26 += "\n    <div class=\"govuk-checkboxes__item\">\n      <input class=\"govuk-checkboxes__input\" id=\"";
t_26 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "itemId"), env.opts.autoescape);
t_26 += "\" name=\"";
t_26 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "itemName"), env.opts.autoescape);
t_26 += "\" type=\"checkbox\" value=\"";
t_26 += runtime.suppressValue(runtime.memberLookup((l_item),"value"), env.opts.autoescape);
t_26 += "\"";
t_26 += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "isChecked")?" checked":""), env.opts.autoescape);
t_26 += runtime.suppressValue((runtime.memberLookup((l_item),"disabled")?" disabled":""), env.opts.autoescape);
if(runtime.memberLookup((runtime.memberLookup((l_item),"conditional")),"html")) {
t_26 += " data-aria-controls=\"";
t_26 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "conditionalId"), env.opts.autoescape);
t_26 += "\"";
;
}
if(runtime.memberLookup((l_item),"behaviour")) {
t_26 += " data-behaviour=\"";
t_26 += runtime.suppressValue(runtime.memberLookup((l_item),"behaviour"), env.opts.autoescape);
t_26 += "\"";
;
}
if(runtime.contextOrFrameLookup(context, frame, "itemDescribedBy")) {
t_26 += " aria-describedby=\"";
t_26 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "itemDescribedBy"), env.opts.autoescape);
t_26 += "\"";
;
}
t_26 += runtime.suppressValue((lineno = 41, colno = 27, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_item),"attributes")])), env.opts.autoescape);
t_26 += ">\n      ";
t_26 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 42, colno = 19, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukLabel"), "govukLabel", context, [{"html": runtime.memberLookup((l_item),"html"),"text": runtime.memberLookup((l_item),"text"),"classes": "govuk-checkboxes__label" + ((runtime.memberLookup((runtime.memberLookup((l_item),"label")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((l_item),"label")),"classes"):"")),"attributes": runtime.memberLookup((runtime.memberLookup((l_item),"label")),"attributes"),"for": runtime.contextOrFrameLookup(context, frame, "itemId")}]))),6), env.opts.autoescape);
t_26 += "\n      ";
if(runtime.contextOrFrameLookup(context, frame, "hasHint")) {
t_26 += "\n      ";
t_26 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 50, colno = 18, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukHint"), "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "itemHintId"),"classes": "govuk-checkboxes__hint" + ((runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"classes"):"")),"attributes": runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"text")}]))),6), env.opts.autoescape);
t_26 += "\n      ";
;
}
t_26 += "\n    </div>\n    ";
if(runtime.memberLookup((runtime.memberLookup((l_item),"conditional")),"html")) {
t_26 += "\n    <div class=\"govuk-checkboxes__conditional";
if(!runtime.contextOrFrameLookup(context, frame, "isChecked")) {
t_26 += " govuk-checkboxes__conditional--hidden";
;
}
t_26 += "\" id=\"";
t_26 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "conditionalId"), env.opts.autoescape);
t_26 += "\">\n      ";
t_26 += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"conditional")),"html"))), env.opts.autoescape);
t_26 += "\n    </div>\n    ";
;
}
t_26 += "\n  ";
;
}
t_26 += "\n";
;
frame = callerFrame;
return new runtime.SafeString(t_26);
});
context.setVariable("_checkboxItem", macro_t_25);
var t_35;
t_35 = (function() {
var output = "";
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")) {
output += "\n  ";
var t_36;
t_36 = runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-hint";
frame.set("hintId", t_36, true);
if(frame.topLevel) {
context.setVariable("hintId", t_36);
}
if(frame.topLevel) {
context.addExport("hintId", t_36);
}
output += "\n  ";
var t_37;
t_37 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "hintId"):runtime.contextOrFrameLookup(context, frame, "hintId"));
frame.set("describedBy", t_37, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_37);
}
if(frame.topLevel) {
context.addExport("describedBy", t_37);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 72, colno = 14, runtime.callWrap(t_16, "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "hintId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"text")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_38;
t_38 = runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-error";
frame.set("errorId", t_38, true);
if(frame.topLevel) {
context.setVariable("errorId", t_38);
}
if(frame.topLevel) {
context.addExport("errorId", t_38);
}
output += "\n  ";
var t_39;
t_39 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "errorId"):runtime.contextOrFrameLookup(context, frame, "errorId"));
frame.set("describedBy", t_39, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_39);
}
if(frame.topLevel) {
context.addExport("describedBy", t_39);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 83, colno = 22, runtime.callWrap(t_8, "govukErrorMessage", context, [{"id": runtime.contextOrFrameLookup(context, frame, "errorId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"text"),"visuallyHiddenText": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"visuallyHiddenText")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n  <div class=\"govuk-checkboxes";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 93, colno = 23, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += " data-module=\"govuk-checkboxes\">\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")) {
output += "\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"html"))),4):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n    ";
frame = frame.push();
var t_42 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_42) {t_42 = runtime.fromIterator(t_42);
var t_41 = t_42.length;
for(var t_40=0; t_40 < t_42.length; t_40++) {
var t_43 = t_42[t_40];
frame.set("item", t_43);
frame.set("loop.index", t_40 + 1);
frame.set("loop.index0", t_40);
frame.set("loop.revindex", t_41 - t_40);
frame.set("loop.revindex0", t_41 - t_40 - 1);
frame.set("loop.first", t_40 === 0);
frame.set("loop.last", t_40 === t_41 - 1);
frame.set("loop.length", t_41);
output += "\n      ";
if(t_43) {
output += runtime.suppressValue((lineno = 99, colno = 25, runtime.callWrap(macro_t_25, "_checkboxItem", context, [runtime.contextOrFrameLookup(context, frame, "params"),t_43,runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"index")])), env.opts.autoescape);
;
}
output += "\n    ";
;
}
}
frame = frame.pop();
output += "\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")) {
output += "\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"html"))),4):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n  </div>\n";
;
return output;
})()
;
frame.set("innerHtml", t_35, true);
if(frame.topLevel) {
context.setVariable("innerHtml", t_35);
}
if(frame.topLevel) {
context.addExport("innerHtml", t_35);
}
output += "<div class=\"govuk-form-group";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-form-group--error";
;
}
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 109, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes")])), env.opts.autoescape);
output += ">\n";
if(runtime.contextOrFrameLookup(context, frame, "hasFieldset")) {
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 111, colno = 18, runtime.callWrap(t_12, "govukFieldset", context, [{"describedBy": runtime.contextOrFrameLookup(context, frame, "describedBy"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"attributes"),"legend": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"legend"),"html": env.getFilter("trim").call(context, runtime.contextOrFrameLookup(context, frame, "innerHtml"))}]))),2), env.opts.autoescape);
output += "\n";
;
}
else {
output += "\n  ";
output += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "innerHtml"))), env.opts.autoescape);
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/cookie-banner/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/cookie-banner/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukCookieBanner");
context.setVariable("govukCookieBanner", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/cookie-banner/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/cookie-banner/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../button/macro.njk", false, "components/cookie-banner/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukButton")) {
var t_8 = t_5.govukButton;
} else {
cb(new Error("cannot import 'govukButton'")); return;
}
context.setVariable("govukButton", t_8);
output += "<div class=\"govuk-cookie-banner";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\" data-nosnippet role=\"region\" aria-label=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"ariaLabel"),"Cookie banner",true), env.opts.autoescape);
output += "\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hidden")) {
output += " hidden";
;
}
output += runtime.suppressValue((lineno = 5, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
frame = frame.push();
var t_11 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"messages");
if(t_11) {t_11 = runtime.fromIterator(t_11);
var t_10 = t_11.length;
for(var t_9=0; t_9 < t_11.length; t_9++) {
var t_12 = t_11[t_9];
frame.set("message", t_12);
frame.set("loop.index", t_9 + 1);
frame.set("loop.index0", t_9);
frame.set("loop.revindex", t_10 - t_9);
frame.set("loop.revindex0", t_10 - t_9 - 1);
frame.set("loop.first", t_9 === 0);
frame.set("loop.last", t_9 === t_10 - 1);
frame.set("loop.length", t_10);
output += "\n  <div class=\"govuk-cookie-banner__message";
if(runtime.memberLookup((t_12),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((t_12),"classes"), env.opts.autoescape);
;
}
output += " govuk-width-container\"";
if(runtime.memberLookup((t_12),"role")) {
output += " role=\"";
output += runtime.suppressValue(runtime.memberLookup((t_12),"role"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 8, colno = 23, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_12),"attributes")])), env.opts.autoescape);
if(runtime.memberLookup((t_12),"hidden")) {
output += " hidden";
;
}
output += ">\n\n    <div class=\"govuk-grid-row\">\n      <div class=\"govuk-grid-column-two-thirds\">\n        ";
if(runtime.memberLookup((t_12),"headingHtml") || runtime.memberLookup((t_12),"headingText")) {
output += "\n        <h2 class=\"govuk-cookie-banner__heading govuk-heading-m\">\n          ";
output += runtime.suppressValue((runtime.memberLookup((t_12),"headingHtml")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((t_12),"headingHtml"))),10):runtime.memberLookup((t_12),"headingText")), env.opts.autoescape);
output += "\n        </h2>\n        ";
;
}
output += "\n        <div class=\"govuk-cookie-banner__content\">\n          ";
if(runtime.memberLookup((t_12),"html")) {
output += "\n          ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((t_12),"html"))),10), env.opts.autoescape);
output += "\n          ";
;
}
else {
if(runtime.memberLookup((t_12),"text")) {
output += "\n          <p class=\"govuk-body\">";
output += runtime.suppressValue(runtime.memberLookup((t_12),"text"), env.opts.autoescape);
output += "</p>\n          ";
;
}
;
}
output += "\n        </div>\n      </div>\n    </div>\n\n    ";
if(runtime.memberLookup((t_12),"actions")) {
output += "\n    <div class=\"govuk-button-group\">\n    ";
frame = frame.push();
var t_15 = runtime.memberLookup((t_12),"actions");
if(t_15) {t_15 = runtime.fromIterator(t_15);
var t_14 = t_15.length;
for(var t_13=0; t_13 < t_15.length; t_13++) {
var t_16 = t_15[t_13];
frame.set("action", t_16);
frame.set("loop.index", t_13 + 1);
frame.set("loop.index0", t_13);
frame.set("loop.revindex", t_14 - t_13);
frame.set("loop.revindex0", t_14 - t_13 - 1);
frame.set("loop.first", t_13 === 0);
frame.set("loop.last", t_13 === t_14 - 1);
frame.set("loop.length", t_14);
output += "\n      ";
var t_17;
t_17 = (function() {
var output = "";
output += "\n        ";
if(!runtime.memberLookup((t_16),"href") || runtime.memberLookup((t_16),"type") == "button") {
output += "\n          ";
output += runtime.suppressValue((lineno = 33, colno = 24, runtime.callWrap(t_8, "govukButton", context, [{"text": runtime.memberLookup((t_16),"text"),"type": (runtime.memberLookup((t_16),"type")?runtime.memberLookup((t_16),"type"):"button"),"name": runtime.memberLookup((t_16),"name"),"value": runtime.memberLookup((t_16),"value"),"classes": runtime.memberLookup((t_16),"classes"),"href": runtime.memberLookup((t_16),"href"),"attributes": runtime.memberLookup((t_16),"attributes")}])), env.opts.autoescape);
output += "\n        ";
;
}
else {
output += "\n          <a class=\"govuk-link";
if(runtime.memberLookup((t_16),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((t_16),"classes"), env.opts.autoescape);
;
}
output += "\" href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_16),"href"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 44, colno = 31, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_16),"attributes")])), env.opts.autoescape);
output += ">";
output += runtime.suppressValue(runtime.memberLookup((t_16),"text"), env.opts.autoescape);
output += "</a>\n        ";
;
}
;
return output;
})()
;
frame.set("buttonHtml", t_17, true);
if(frame.topLevel) {
context.setVariable("buttonHtml", t_17);
}
if(frame.topLevel) {
context.addExport("buttonHtml", t_17);
}
output += "\n      ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "buttonHtml"))),6), env.opts.autoescape);
output += "\n    ";
;
}
}
frame = frame.pop();
output += "\n    </div>\n    ";
;
}
output += "\n\n  </div>\n  ";
;
}
}
frame = frame.pop();
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/date-input/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/date-input/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukDateInput");
context.setVariable("govukDateInput", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/date-input/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/date-input/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../error-message/macro.njk", false, "components/date-input/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukErrorMessage")) {
var t_8 = t_5.govukErrorMessage;
} else {
cb(new Error("cannot import 'govukErrorMessage'")); return;
}
context.setVariable("govukErrorMessage", t_8);
output += "\n";
env.getTemplate("../fieldset/macro.njk", false, "components/date-input/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukFieldset")) {
var t_12 = t_9.govukFieldset;
} else {
cb(new Error("cannot import 'govukFieldset'")); return;
}
context.setVariable("govukFieldset", t_12);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/date-input/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukHint")) {
var t_16 = t_13.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_16);
output += "\n";
env.getTemplate("../input/macro.njk", false, "components/date-input/template.njk", false, function(t_18,t_17) {
if(t_18) { cb(t_18); return; }
t_17.getExported(function(t_19,t_17) {
if(t_19) { cb(t_19); return; }
if(Object.prototype.hasOwnProperty.call(t_17, "govukInput")) {
var t_20 = t_17.govukInput;
} else {
cb(new Error("cannot import 'govukInput'")); return;
}
context.setVariable("govukInput", t_20);
var t_21;
t_21 = (runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"describedBy")?runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"describedBy"):"");
frame.set("describedBy", t_21, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_21);
}
if(frame.topLevel) {
context.addExport("describedBy", t_21);
}
var t_22;
t_22 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")?true:false);
frame.set("hasFieldset", t_22, true);
if(frame.topLevel) {
context.setVariable("hasFieldset", t_22);
}
if(frame.topLevel) {
context.addExport("hasFieldset", t_22);
}
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items"))) {
output += "\n  ";
var t_23;
t_23 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
frame.set("dateInputItems", t_23, true);
if(frame.topLevel) {
context.setVariable("dateInputItems", t_23);
}
if(frame.topLevel) {
context.addExport("dateInputItems", t_23);
}
output += "\n";
;
}
else {
output += "\n  ";
var t_24;
t_24 = [{"name": "day","classes": "govuk-input--width-2"},{"name": "month","classes": "govuk-input--width-2"},{"name": "year","classes": "govuk-input--width-4"}];
frame.set("dateInputItems", t_24, true);
if(frame.topLevel) {
context.setVariable("dateInputItems", t_24);
}
if(frame.topLevel) {
context.addExport("dateInputItems", t_24);
}
output += "\n";
;
}
var t_25;
t_25 = (function() {
var output = "";
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")) {
output += "\n  ";
var t_26;
t_26 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-hint";
frame.set("hintId", t_26, true);
if(frame.topLevel) {
context.setVariable("hintId", t_26);
}
if(frame.topLevel) {
context.addExport("hintId", t_26);
}
output += "\n  ";
var t_27;
t_27 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "hintId"):runtime.contextOrFrameLookup(context, frame, "hintId"));
frame.set("describedBy", t_27, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_27);
}
if(frame.topLevel) {
context.addExport("describedBy", t_27);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 37, colno = 14, runtime.callWrap(t_16, "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "hintId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"text")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_28;
t_28 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-error";
frame.set("errorId", t_28, true);
if(frame.topLevel) {
context.setVariable("errorId", t_28);
}
if(frame.topLevel) {
context.addExport("errorId", t_28);
}
output += "\n  ";
var t_29;
t_29 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "errorId"):runtime.contextOrFrameLookup(context, frame, "errorId"));
frame.set("describedBy", t_29, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_29);
}
if(frame.topLevel) {
context.addExport("describedBy", t_29);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 48, colno = 22, runtime.callWrap(t_8, "govukErrorMessage", context, [{"id": runtime.contextOrFrameLookup(context, frame, "errorId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"text"),"visuallyHiddenText": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"visuallyHiddenText")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n  <div class=\"govuk-date-input";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 58, colno = 23, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
output += ">\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")) {
output += "\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"html"))),4):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n    ";
frame = frame.push();
var t_32 = runtime.contextOrFrameLookup(context, frame, "dateInputItems");
if(t_32) {t_32 = runtime.fromIterator(t_32);
var t_31 = t_32.length;
for(var t_30=0; t_30 < t_32.length; t_30++) {
var t_33 = t_32[t_30];
frame.set("item", t_33);
frame.set("loop.index", t_30 + 1);
frame.set("loop.index0", t_30);
frame.set("loop.revindex", t_31 - t_30);
frame.set("loop.revindex0", t_31 - t_30 - 1);
frame.set("loop.first", t_30 === 0);
frame.set("loop.last", t_30 === t_31 - 1);
frame.set("loop.length", t_31);
output += "\n    <div class=\"govuk-date-input__item\">\n      ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 65, colno = 19, runtime.callWrap(t_20, "govukInput", context, [{"label": {"text": (runtime.memberLookup((t_33),"label")?runtime.memberLookup((t_33),"label"):env.getFilter("capitalize").call(context, runtime.memberLookup((t_33),"name"))),"classes": "govuk-date-input__label"},"id": (runtime.memberLookup((t_33),"id")?runtime.memberLookup((t_33),"id"):(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-" + runtime.memberLookup((t_33),"name"))),"classes": "govuk-date-input__input " + ((runtime.memberLookup((t_33),"classes")?runtime.memberLookup((t_33),"classes"):"")),"name": (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"namePrefix")?(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"namePrefix") + "-" + runtime.memberLookup((t_33),"name")):runtime.memberLookup((t_33),"name")),"value": runtime.memberLookup((t_33),"value"),"type": "text","inputmode": (runtime.memberLookup((t_33),"inputmode")?runtime.memberLookup((t_33),"inputmode"):"numeric"),"autocomplete": runtime.memberLookup((t_33),"autocomplete"),"pattern": runtime.memberLookup((t_33),"pattern"),"attributes": runtime.memberLookup((t_33),"attributes")}]))),6), env.opts.autoescape);
output += "\n    </div>\n    ";
;
}
}
frame = frame.pop();
output += "\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")) {
output += "\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"html"))),4):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n  </div>\n";
;
return output;
})()
;
frame.set("innerHtml", t_25, true);
if(frame.topLevel) {
context.setVariable("innerHtml", t_25);
}
if(frame.topLevel) {
context.addExport("innerHtml", t_25);
}
output += "<div class=\"govuk-form-group";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-form-group--error";
;
}
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 88, colno = 191, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes")])), env.opts.autoescape);
output += ">\n";
if(runtime.contextOrFrameLookup(context, frame, "hasFieldset")) {
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 94, colno = 18, runtime.callWrap(t_12, "govukFieldset", context, [{"describedBy": runtime.contextOrFrameLookup(context, frame, "describedBy"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"classes"),"role": "group","attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"attributes"),"legend": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"legend"),"html": env.getFilter("trim").call(context, runtime.contextOrFrameLookup(context, frame, "innerHtml"))}]))),2), env.opts.autoescape);
output += "\n";
;
}
else {
output += "\n  ";
output += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "innerHtml"))), env.opts.autoescape);
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/details/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/details/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukDetails");
context.setVariable("govukDetails", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/details/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/details/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<details";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
output += " class=\"govuk-details";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"open")?" open":""), env.opts.autoescape);
output += ">\n  <summary class=\"govuk-details__summary\">\n    <span class=\"govuk-details__summary-text\">\n      ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"summaryHtml")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"summaryHtml"))),6):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"summaryText")), env.opts.autoescape);
output += "\n    </span>\n  </summary>\n  <div class=\"govuk-details__text\">\n    ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "caller")?(lineno = 11, colno = 13, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, [])):((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")))), env.opts.autoescape);
output += "\n  </div>\n</details>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/error-message/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/error-message/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukErrorMessage");
context.setVariable("govukErrorMessage", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/error-message/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/error-message/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var t_5;
t_5 = env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"visuallyHiddenText"),"Error");
frame.set("visuallyHiddenText", t_5, true);
if(frame.topLevel) {
context.setVariable("visuallyHiddenText", t_5);
}
if(frame.topLevel) {
context.addExport("visuallyHiddenText", t_5);
}
var t_6;
t_6 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),2):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text"));
frame.set("errorMessageText", t_6, true);
if(frame.topLevel) {
context.setVariable("errorMessageText", t_6);
}
if(frame.topLevel) {
context.addExport("errorMessageText", t_6);
}
output += "<p";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
output += " class=\"govuk-error-message";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 6, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
if(runtime.contextOrFrameLookup(context, frame, "visuallyHiddenText")) {
output += "\n  <span class=\"govuk-visually-hidden\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "visuallyHiddenText"), env.opts.autoescape);
output += ":</span> ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "errorMessageText"), env.opts.autoescape);
output += "\n  ";
;
}
else {
output += "\n  ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "errorMessageText"), env.opts.autoescape);
output += "\n  ";
;
}
output += "\n</p>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/error-summary/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/error-summary/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukErrorSummary");
context.setVariable("govukErrorSummary", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/error-summary/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/error-summary/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<div class=\"govuk-error-summary";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disableAutoFocus") !== runtime.contextOrFrameLookup(context, frame, "undefined")) {
output += " data-disable-auto-focus=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disableAutoFocus"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 5, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += " data-module=\"govuk-error-summary\">";
output += "\n  <div role=\"alert\">\n    <h2 class=\"govuk-error-summary__title\">\n      ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHtml")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHtml"))),6):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleText")), env.opts.autoescape);
output += "\n    </h2>\n    <div class=\"govuk-error-summary__body\">\n      ";
if(runtime.contextOrFrameLookup(context, frame, "caller") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"descriptionHtml") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"descriptionText")) {
output += "\n      <p>\n        ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "caller")?(lineno = 15, colno = 17, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, [])):((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"descriptionHtml")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"descriptionHtml"))),8):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"descriptionText")))), env.opts.autoescape);
output += "\n      </p>\n      ";
;
}
output += "\n      ";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorList"))) {
output += "\n        <ul class=\"govuk-list govuk-error-summary__list\">\n        ";
frame = frame.push();
var t_7 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorList");
if(t_7) {t_7 = runtime.fromIterator(t_7);
var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("item", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n          <li>\n          ";
if(runtime.memberLookup((t_8),"href")) {
output += "\n            <a href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"href"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 24, colno = 33, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_8),"attributes")])), env.opts.autoescape);
output += ">";
output += runtime.suppressValue((runtime.memberLookup((t_8),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((t_8),"html"))),12):runtime.memberLookup((t_8),"text")), env.opts.autoescape);
output += "</a>\n          ";
;
}
else {
output += "\n            ";
output += runtime.suppressValue((runtime.memberLookup((t_8),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((t_8),"html"))),10):runtime.memberLookup((t_8),"text")), env.opts.autoescape);
output += "\n          ";
;
}
output += "\n          </li>\n        ";
;
}
}
frame = frame.pop();
output += "\n        </ul>\n      ";
;
}
output += "\n    </div>\n  </div>\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/exit-this-page/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/exit-this-page/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukExitThisPage");
context.setVariable("govukExitThisPage", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/exit-this-page/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/exit-this-page/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../button/macro.njk", false, "components/exit-this-page/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukButton")) {
var t_8 = t_5.govukButton;
} else {
cb(new Error("cannot import 'govukButton'")); return;
}
context.setVariable("govukButton", t_8);
var t_9;
t_9 = (function() {
var output = "";
output += "\n  <span class=\"govuk-visually-hidden\">Emergency</span> Exit this page\n";
;
return output;
})()
;
frame.set("defaultHtml", t_9, true);
if(frame.topLevel) {
context.setVariable("defaultHtml", t_9);
}
if(frame.topLevel) {
context.addExport("defaultHtml", t_9);
}
output += "<div";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
output += " class=\"govuk-exit-this-page";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\" data-module=\"govuk-exit-this-page\"";
output += runtime.suppressValue((lineno = 9, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"activatedText")) {
output += " data-i18n.activated=\"";
output += runtime.suppressValue(env.getFilter("escape").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"activatedText")), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"timedOutText")) {
output += " data-i18n.timed-out=\"";
output += runtime.suppressValue(env.getFilter("escape").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"timedOutText")), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"pressTwoMoreTimesText")) {
output += " data-i18n.press-two-more-times=\"";
output += runtime.suppressValue(env.getFilter("escape").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"pressTwoMoreTimesText")), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"pressOneMoreTimeText")) {
output += " data-i18n.press-one-more-time=\"";
output += runtime.suppressValue(env.getFilter("escape").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"pressOneMoreTimeText")), env.opts.autoescape);
output += "\"";
;
}
output += "\n>\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 15, colno = 16, runtime.callWrap(t_8, "govukButton", context, [{"html": ((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text"))?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"):runtime.contextOrFrameLookup(context, frame, "defaultHtml")),"text": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text"),"classes": "govuk-button--warning govuk-exit-this-page__button govuk-js-exit-this-page-button","href": env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"redirectUrl"),"https://www.bbc.co.uk/weather",true),"attributes": {"rel": "nofollow noreferrer"}}]))),2), env.opts.autoescape);
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/fieldset/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/fieldset/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukFieldset");
context.setVariable("govukFieldset", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/fieldset/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/fieldset/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<fieldset class=\"govuk-fieldset";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"role")) {
output += " role=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"role"), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy")) {
output += " aria-describedby=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 6, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"html") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"text")) {
output += "\n  <legend class=\"govuk-fieldset__legend";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"classes"), env.opts.autoescape);
;
}
output += "\">\n  ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"isPageHeading")) {
output += "\n    <h1 class=\"govuk-fieldset__heading\">\n      ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"html"))),6):runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"text")), env.opts.autoescape);
output += "\n    </h1>\n  ";
;
}
else {
output += "\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"html"))),4):runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"legend")),"text")), env.opts.autoescape);
output += "\n  ";
;
}
output += "\n  </legend>\n  ";
;
}
output += "\n";
if(runtime.contextOrFrameLookup(context, frame, "caller")) {
output += runtime.suppressValue((lineno = 19, colno = 11, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, [])), env.opts.autoescape);
output += "\n";
;
}
else {
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")) {
output += "\n  ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")), env.opts.autoescape);
output += "\n";
;
}
;
}
output += "\n</fieldset>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/file-upload/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/file-upload/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukFileUpload");
context.setVariable("govukFileUpload", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/file-upload/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/file-upload/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../error-message/macro.njk", false, "components/file-upload/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukErrorMessage")) {
var t_8 = t_5.govukErrorMessage;
} else {
cb(new Error("cannot import 'govukErrorMessage'")); return;
}
context.setVariable("govukErrorMessage", t_8);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/file-upload/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukHint")) {
var t_12 = t_9.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_12);
output += "\n";
env.getTemplate("../label/macro.njk", false, "components/file-upload/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukLabel")) {
var t_16 = t_13.govukLabel;
} else {
cb(new Error("cannot import 'govukLabel'")); return;
}
context.setVariable("govukLabel", t_16);
var t_17;
t_17 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy"):"");
frame.set("describedBy", t_17, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_17);
}
if(frame.topLevel) {
context.addExport("describedBy", t_17);
}
output += "\n<div class=\"govuk-form-group";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-form-group--error";
;
}
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 9, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 10, colno = 15, runtime.callWrap(t_16, "govukLabel", context, [{"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"text"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"classes"),"isPageHeading": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"isPageHeading"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"attributes"),"for": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")}]))),2), env.opts.autoescape);
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")) {
output += "\n  ";
var t_18;
t_18 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-hint";
frame.set("hintId", t_18, true);
if(frame.topLevel) {
context.setVariable("hintId", t_18);
}
if(frame.topLevel) {
context.addExport("hintId", t_18);
}
output += "\n  ";
var t_19;
t_19 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "hintId"):runtime.contextOrFrameLookup(context, frame, "hintId"));
frame.set("describedBy", t_19, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_19);
}
if(frame.topLevel) {
context.addExport("describedBy", t_19);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 21, colno = 14, runtime.callWrap(t_12, "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "hintId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"text")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_20;
t_20 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-error";
frame.set("errorId", t_20, true);
if(frame.topLevel) {
context.setVariable("errorId", t_20);
}
if(frame.topLevel) {
context.addExport("errorId", t_20);
}
output += "\n  ";
var t_21;
t_21 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "errorId"):runtime.contextOrFrameLookup(context, frame, "errorId"));
frame.set("describedBy", t_21, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_21);
}
if(frame.topLevel) {
context.addExport("describedBy", t_21);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 32, colno = 22, runtime.callWrap(t_8, "govukErrorMessage", context, [{"id": runtime.contextOrFrameLookup(context, frame, "errorId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"text"),"visuallyHiddenText": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"visuallyHiddenText")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")) {
output += "\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html"))),2):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
output += "\n  <input class=\"govuk-file-upload";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-file-upload--error";
;
}
output += "\" id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\" name=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"), env.opts.autoescape);
output += "\" type=\"file\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value")) {
output += " value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value"), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disabled")) {
output += " disabled";
;
}
if(runtime.contextOrFrameLookup(context, frame, "describedBy")) {
output += " aria-describedby=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "describedBy"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 48, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")) {
output += "\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html"))),2):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/footer/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/footer/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukFooter");
context.setVariable("govukFooter", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/footer/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/footer/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<footer class=\"govuk-footer";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  <div class=\"govuk-width-container";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"containerClasses")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"containerClasses"), env.opts.autoescape);
;
}
output += "\">\n    ";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigation"))) {
output += "\n      <div class=\"govuk-footer__navigation\">\n        ";
frame = frame.push();
var t_7 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigation");
if(t_7) {t_7 = runtime.fromIterator(t_7);
var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("nav", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n          <div class=\"govuk-footer__section govuk-grid-column-";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((t_8),"width"),"full",true), env.opts.autoescape);
output += "\">\n            <h2 class=\"govuk-footer__heading govuk-heading-m\">";
output += runtime.suppressValue(runtime.memberLookup((t_8),"title"), env.opts.autoescape);
output += "</h2>\n            ";
if(env.getFilter("length").call(context, runtime.memberLookup((t_8),"items"))) {
output += "\n              ";
var t_9;
t_9 = (runtime.memberLookup((t_8),"columns")?"govuk-footer__list--columns-" + runtime.memberLookup((t_8),"columns"):"");
frame.set("listClasses", t_9, true);
if(frame.topLevel) {
context.setVariable("listClasses", t_9);
}
if(frame.topLevel) {
context.addExport("listClasses", t_9);
}
output += "\n              <ul class=\"govuk-footer__list";
if(runtime.contextOrFrameLookup(context, frame, "listClasses")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "listClasses"), env.opts.autoescape);
;
}
output += "\">\n                ";
frame = frame.push();
var t_12 = runtime.memberLookup((t_8),"items");
if(t_12) {t_12 = runtime.fromIterator(t_12);
var t_11 = t_12.length;
for(var t_10=0; t_10 < t_12.length; t_10++) {
var t_13 = t_12[t_10];
frame.set("item", t_13);
frame.set("loop.index", t_10 + 1);
frame.set("loop.index0", t_10);
frame.set("loop.revindex", t_11 - t_10);
frame.set("loop.revindex0", t_11 - t_10 - 1);
frame.set("loop.first", t_10 === 0);
frame.set("loop.last", t_10 === t_11 - 1);
frame.set("loop.length", t_11);
output += "\n                  ";
if(runtime.memberLookup((t_13),"href") && runtime.memberLookup((t_13),"text")) {
output += "\n                    <li class=\"govuk-footer__list-item\">\n                      <a class=\"govuk-footer__link\" href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_13),"href"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 17, colno = 43, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_13),"attributes")])), env.opts.autoescape);
output += ">\n                        ";
output += runtime.suppressValue(runtime.memberLookup((t_13),"text"), env.opts.autoescape);
output += "\n                      </a>\n                    </li>\n                  ";
;
}
output += "\n                ";
;
}
}
frame = frame.pop();
output += "\n              </ul>\n            ";
;
}
output += "\n          </div>\n        ";
;
}
}
frame = frame.pop();
output += "\n      </div>\n      <hr class=\"govuk-footer__section-break\">\n    ";
;
}
output += "\n    <div class=\"govuk-footer__meta\">\n      <div class=\"govuk-footer__meta-item govuk-footer__meta-item--grow\">\n        ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")) {
output += "\n        <h2 class=\"govuk-visually-hidden\">";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"visuallyHiddenTitle"),"Support links",true), env.opts.autoescape);
output += "</h2>\n        ";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"items"))) {
output += "\n        <ul class=\"govuk-footer__inline-list\">\n        ";
frame = frame.push();
var t_16 = runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"items");
if(t_16) {t_16 = runtime.fromIterator(t_16);
var t_15 = t_16.length;
for(var t_14=0; t_14 < t_16.length; t_14++) {
var t_17 = t_16[t_14];
frame.set("item", t_17);
frame.set("loop.index", t_14 + 1);
frame.set("loop.index0", t_14);
frame.set("loop.revindex", t_15 - t_14);
frame.set("loop.revindex0", t_15 - t_14 - 1);
frame.set("loop.first", t_14 === 0);
frame.set("loop.last", t_14 === t_15 - 1);
frame.set("loop.length", t_15);
output += "\n          <li class=\"govuk-footer__inline-list-item\">\n            <a class=\"govuk-footer__link\" href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_17),"href"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 39, colno = 33, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_17),"attributes")])), env.opts.autoescape);
output += ">\n              ";
output += runtime.suppressValue(runtime.memberLookup((t_17),"text"), env.opts.autoescape);
output += "\n            </a>\n          </li>\n        ";
;
}
}
frame = frame.pop();
output += "\n        </ul>\n        ";
;
}
output += "\n        ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"text") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"html")) {
output += "\n        <div class=\"govuk-footer__meta-custom\">\n          ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"html"))),10):runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"meta")),"text")), env.opts.autoescape);
output += "\n        </div>\n        ";
;
}
output += "\n        ";
;
}
output += "\n        ";
output += "<svg\n          aria-hidden=\"true\"\n          focusable=\"false\"\n          class=\"govuk-footer__licence-logo\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          viewBox=\"0 0 483.2 195.7\"\n          height=\"17\"\n          width=\"41\"\n        >\n          <path\n            fill=\"currentColor\"\n            d=\"M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145\"\n          />\n        </svg>\n        <span class=\"govuk-footer__licence-description\">\n        ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"contentLicence")),"html") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"contentLicence")),"text")) {
output += "\n          ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"contentLicence")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"contentLicence")),"html"))),10):runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"contentLicence")),"text")), env.opts.autoescape);
output += "\n        ";
;
}
else {
output += "\n          All content is available under the\n          <a\n            class=\"govuk-footer__link\"\n            href=\"https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/\"\n            rel=\"license\"\n          >Open Government Licence v3.0</a>, except where otherwise stated\n        ";
;
}
output += "\n        </span>\n      </div>\n      <div class=\"govuk-footer__meta-item\">\n        <a\n          class=\"govuk-footer__link govuk-footer__copyright-logo\"\n          href=\"https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/\"\n        >\n        ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"copyright")),"html") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"copyright")),"text")) {
output += "\n          ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"copyright")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"copyright")),"html"))),10):runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"copyright")),"text")), env.opts.autoescape);
output += "\n        ";
;
}
else {
output += "\n          © Crown copyright\n        ";
;
}
output += "\n        </a>\n      </div>\n    </div>\n  </div>\n</footer>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/header/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/header/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukHeader");
context.setVariable("govukHeader", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/header/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/header/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var t_5;
t_5 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonText")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonText"):"Menu");
frame.set("menuButtonText", t_5, true);
if(frame.topLevel) {
context.setVariable("menuButtonText", t_5);
}
if(frame.topLevel) {
context.addExport("menuButtonText", t_5);
}
var t_6;
t_6 = (function() {
var output = "";
output += "\n<svg\n  focusable=\"false\"\n  role=\"img\"\n  class=\"govuk-header__logotype\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  viewBox=\"0 0 152 30\"\n  height=\"30\"\n  width=\"152\"\n  aria-label=\"GOV.UK\"\n>\n  <title>GOV.UK</title>\n  <path d=\"M6.7 12.2c1 .4 2.1-.1 2.5-1s-.1-2.1-1-2.5c-1-.4-2.1.1-2.5 1-.4 1 0 2.1 1 2.5m-4.3 2.5c1 .4 2.1-.1 2.5-1s-.1-2.1-1-2.5c-1-.4-2.1.1-2.5 1-.5 1 0 2.1 1 2.5m-1.3 4.8c1 .4 2.1-.1 2.5-1 .4-1-.1-2.1-1-2.5-1-.4-2.1.1-2.5 1-.4 1 0 2.1 1 2.5m10.4-5.8c1 .4 2.1-.1 2.5-1s-.1-2.1-1-2.5c-1-.4-2.1.1-2.5 1s0 2.1 1 2.5m17.4-1.5c-1 .4-2.1-.1-2.5-1s.1-2.1 1-2.5c1-.4 2.1.1 2.5 1 .5 1 0 2.1-1 2.5m4.3 2.5c-1 .4-2.1-.1-2.5-1s.1-2.1 1-2.5c1-.4 2.1.1 2.5 1 .5 1 0 2.1-1 2.5m1.3 4.8c-1 .4-2.1-.1-2.5-1-.4-1 .1-2.1 1-2.5 1-.4 2.1.1 2.5 1 .4 1 0 2.1-1 2.5m-10.4-5.8c-1 .4-2.1-.1-2.5-1s.1-2.1 1-2.5c1-.4 2.1.1 2.5 1s0 2.1-1 2.5m-5.3-4.9 2.4 1.3V6.5l-2.4.8c-.1-.1-.1-.2-.2-.2s1-3 1-3h-3.4l1 3c-.1.1-.2.1-.2.2-.1.1-2.4-.7-2.4-.7v3.5L17 8.8c-.1.1 0 .2.1.3l-1.4 4.2c-.1.2-.1.4-.1.7 0 1.1.8 2.1 1.9 2.2h.6C19.2 16 20 15.1 20 14c0-.2 0-.4-.1-.7l-1.4-4.2c.2-.1.3-.2.3-.3m-1 20.3c4.6 0 8.9.3 12.8.9 1.1-4.6 2.4-7.2 3.8-9.1l-2.6-.9c.3 1.3.3 1.9 0 2.8-.4-.4-.8-1.2-1.1-2.4l-1.2 4.2c.8-.5 1.4-.9 2-.9-1.2 2.6-2.7 3.2-3.6 3-1.2-.2-1.7-1.3-1.5-2.2.3-1.3 1.6-1.6 2.2-.1 1.2-2.4-.8-3.1-2.1-2.4 1.9-1.9 2.2-3.6.6-5.7-2.2 1.7-2.2 3.3-1.2 5.6-1.3-1.5-3.3-.7-2.5 1.7.9-1.4 2.1-.5 2 .8-.2 1.2-1.7 2.1-3.7 2-2.8-.2-3-2.2-3-3.7.7-.1 1.9.5 3 2l.4-4.4c-1.1 1.2-2.2 1.4-3.3 1.4.4-1.2 2.1-3.1 2.1-3.1h-5.5s1.8 2 2.1 3.1c-1.1 0-2.2-.3-3.3-1.4l.4 4.4c1.1-1.5 2.3-2.1 3-2-.1 1.6-.2 3.5-3 3.7-1.9.2-3.5-.8-3.7-2-.2-1.3 1-2.2 1.9-.8.7-2.4-1.3-3.1-2.6-1.7 1-2.3 1-4-1.2-5.6-1.6 2.1-1.3 3.8.6 5.7-1.3-.7-3.2 0-2.1 2.4.6-1.5 1.9-1.1 2.2.1.2.9-.4 1.9-1.5 2.2-1 .2-2.5-.5-3.7-3 .7 0 1.3.4 2 .9L5 20.4c-.3 1.2-.7 1.9-1.2 2.4-.3-.8-.2-1.5 0-2.8l-2.6.9C2.7 22.8 4 25.4 5.1 30c3.8-.5 8.2-.9 12.7-.9m30.5-11.5c0 .9.1 1.7.3 2.5.2.8.6 1.5 1 2.2.5.6 1 1.1 1.7 1.5.7.4 1.5.6 2.5.6.9 0 1.7-.1 2.3-.4s1.1-.7 1.5-1.1c.4-.4.6-.9.8-1.5.1-.5.2-1 .2-1.5v-.2h-5.3v-3.2h9.4V28H59v-2.5c-.3.4-.6.8-1 1.1-.4.3-.8.6-1.3.9-.5.2-1 .4-1.6.6s-1.2.2-1.8.2c-1.5 0-2.9-.3-4-.8-1.2-.6-2.2-1.3-3-2.3-.8-1-1.4-2.1-1.8-3.4-.3-1.4-.5-2.8-.5-4.3s.2-2.9.7-4.2c.5-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.6 2.6-.8 4.1-.8 1 0 1.9.1 2.8.3.9.2 1.7.6 2.4 1s1.4.9 1.9 1.5c.6.6 1 1.3 1.4 2l-3.7 2.1c-.2-.4-.5-.9-.8-1.2-.3-.4-.6-.7-1-1-.4-.3-.8-.5-1.3-.7-.5-.2-1.1-.2-1.7-.2-1 0-1.8.2-2.5.6-.7.4-1.3.9-1.7 1.5-.5.6-.8 1.4-1 2.2-.3.8-.4 1.9-.4 2.7zm36.4-4.3c-.4-1.3-1.1-2.4-2-3.4-.9-1-1.9-1.7-3.1-2.3-1.2-.6-2.6-.8-4.2-.8s-2.9.3-4.2.8c-1.1.6-2.2 1.4-3 2.3-.9 1-1.5 2.1-2 3.4-.4 1.3-.7 2.7-.7 4.2s.2 2.9.7 4.2c.4 1.3 1.1 2.4 2 3.4.9 1 1.9 1.7 3.1 2.3 1.2.6 2.6.8 4.2.8 1.5 0 2.9-.3 4.2-.8 1.2-.6 2.3-1.3 3.1-2.3.9-1 1.5-2.1 2-3.4.4-1.3.7-2.7.7-4.2-.1-1.5-.3-2.9-.8-4.2zM81 17.6c0 1-.1 1.9-.4 2.7-.2.8-.6 1.6-1.1 2.2-.5.6-1.1 1.1-1.7 1.4-.7.3-1.5.5-2.4.5-.9 0-1.7-.2-2.4-.5s-1.3-.8-1.7-1.4c-.5-.6-.8-1.3-1.1-2.2-.2-.8-.4-1.7-.4-2.7v-.1c0-1 .1-1.9.4-2.7.2-.8.6-1.6 1.1-2.2.5-.6 1.1-1.1 1.7-1.4.7-.3 1.5-.5 2.4-.5.9 0 1.7.2 2.4.5s1.3.8 1.7 1.4c.5.6.8 1.3 1.1 2.2.2.8.4 1.7.4 2.7v.1zM92.9 28 87 7h4.7l4 15.7h.1l4-15.7h4.7l-5.9 21h-5.7zm28.8-3.6c.6 0 1.2-.1 1.7-.3.5-.2 1-.4 1.4-.8.4-.4.7-.8.9-1.4.2-.6.3-1.2.3-2v-13h4.1v13.6c0 1.2-.2 2.2-.6 3.1s-1 1.7-1.8 2.4c-.7.7-1.6 1.2-2.7 1.5-1 .4-2.2.5-3.4.5-1.2 0-2.4-.2-3.4-.5-1-.4-1.9-.9-2.7-1.5-.8-.7-1.3-1.5-1.8-2.4-.4-.9-.6-2-.6-3.1V6.9h4.2v13c0 .8.1 1.4.3 2 .2.6.5 1 .9 1.4.4.4.8.6 1.4.8.6.2 1.1.3 1.8.3zm13-17.4h4.2v9.1l7.4-9.1h5.2l-7.2 8.4L152 28h-4.9l-5.5-9.4-2.7 3V28h-4.2V7zm-27.6 16.1c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z\"></path>\n</svg>\n";
;
return output;
})()
;
frame.set("_stEdwardsCrown", t_6, true);
if(frame.topLevel) {
context.setVariable("_stEdwardsCrown", t_6);
}
var t_7;
t_7 = (function() {
var output = "";
output += "\n<svg\n  focusable=\"false\"\n  role=\"img\"\n  class=\"govuk-header__logotype\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  viewBox=\"0 0 148 30\"\n  height=\"30\"\n  width=\"148\"\n  aria-label=\"GOV.UK\"\n>\n  <title>GOV.UK</title>\n  <path d=\"M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8m28.3-11.6c0 .9.1 1.7.3 2.5.2.8.6 1.5 1 2.2.5.6 1 1.1 1.7 1.5.7.4 1.5.6 2.5.6.9 0 1.7-.1 2.3-.4s1.1-.7 1.5-1.1c.4-.4.6-.9.8-1.5.1-.5.2-1 .2-1.5v-.2h-5.3v-3.2h9.4V28H55v-2.5c-.3.4-.6.8-1 1.1-.4.3-.8.6-1.3.9-.5.2-1 .4-1.6.6s-1.2.2-1.8.2c-1.5 0-2.9-.3-4-.8-1.2-.6-2.2-1.3-3-2.3-.8-1-1.4-2.1-1.8-3.4-.3-1.4-.5-2.8-.5-4.3s.2-2.9.7-4.2c.5-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.6 2.6-.8 4.1-.8 1 0 1.9.1 2.8.3.9.2 1.7.6 2.4 1s1.4.9 1.9 1.5c.6.6 1 1.3 1.4 2l-3.7 2.1c-.2-.4-.5-.9-.8-1.2-.3-.4-.6-.7-1-1-.4-.3-.8-.5-1.3-.7-.5-.2-1.1-.2-1.7-.2-1 0-1.8.2-2.5.6-.7.4-1.3.9-1.7 1.5-.5.6-.8 1.4-1 2.2-.3.8-.4 1.9-.4 2.7zM71.5 6.8c1.5 0 2.9.3 4.2.8 1.2.6 2.3 1.3 3.1 2.3.9 1 1.5 2.1 2 3.4s.7 2.7.7 4.2-.2 2.9-.7 4.2c-.4 1.3-1.1 2.4-2 3.4-.9 1-1.9 1.7-3.1 2.3-1.2.6-2.6.8-4.2.8s-2.9-.3-4.2-.8c-1.2-.6-2.3-1.3-3.1-2.3-.9-1-1.5-2.1-2-3.4-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2c.4-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.5 2.6-.8 4.2-.8zm0 17.6c.9 0 1.7-.2 2.4-.5s1.3-.8 1.7-1.4c.5-.6.8-1.3 1.1-2.2.2-.8.4-1.7.4-2.7v-.1c0-1-.1-1.9-.4-2.7-.2-.8-.6-1.6-1.1-2.2-.5-.6-1.1-1.1-1.7-1.4-.7-.3-1.5-.5-2.4-.5s-1.7.2-2.4.5-1.3.8-1.7 1.4c-.5.6-.8 1.3-1.1 2.2-.2.8-.4 1.7-.4 2.7v.1c0 1 .1 1.9.4 2.7.2.8.6 1.6 1.1 2.2.5.6 1.1 1.1 1.7 1.4.6.3 1.4.5 2.4.5zM88.9 28 83 7h4.7l4 15.7h.1l4-15.7h4.7l-5.9 21h-5.7zm28.8-3.6c.6 0 1.2-.1 1.7-.3.5-.2 1-.4 1.4-.8.4-.4.7-.8.9-1.4.2-.6.3-1.2.3-2v-13h4.1v13.6c0 1.2-.2 2.2-.6 3.1s-1 1.7-1.8 2.4c-.7.7-1.6 1.2-2.7 1.5-1 .4-2.2.5-3.4.5-1.2 0-2.4-.2-3.4-.5-1-.4-1.9-.9-2.7-1.5-.8-.7-1.3-1.5-1.8-2.4-.4-.9-.6-2-.6-3.1V6.9h4.2v13c0 .8.1 1.4.3 2 .2.6.5 1 .9 1.4.4.4.8.6 1.4.8.6.2 1.1.3 1.8.3zm13-17.4h4.2v9.1l7.4-9.1h5.2l-7.2 8.4L148 28h-4.9l-5.5-9.4-2.7 3V28h-4.2V7zm-27.6 16.1c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z\"></path>\n</svg>\n";
;
return output;
})()
;
frame.set("_tudorCrown", t_7, true);
if(frame.topLevel) {
context.setVariable("_tudorCrown", t_7);
}
output += "<header class=\"govuk-header";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\" data-module=\"govuk-header\"";
output += runtime.suppressValue((lineno = 37, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  <div class=\"govuk-header__container ";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"containerClasses"),"govuk-width-container",true), env.opts.autoescape);
output += "\">\n    <div class=\"govuk-header__logo\">\n      <a href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"homepageUrl"),"/",true), env.opts.autoescape);
output += "\" class=\"govuk-header__link govuk-header__link--homepage\">";
output += "\n        ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, (((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"useTudorCrown") !== runtime.contextOrFrameLookup(context, frame, "undefined") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"useTudorCrown") === false)?runtime.contextOrFrameLookup(context, frame, "_stEdwardsCrown"):runtime.contextOrFrameLookup(context, frame, "_tudorCrown"))))),8), env.opts.autoescape);
output += "\n        ";
if((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"productName"))) {
output += "\n        <span class=\"govuk-header__product-name\">\n          ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"productName"), env.opts.autoescape);
output += "\n        </span>\n        ";
;
}
output += "\n      </a>\n    </div>\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName") || env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigation"))) {
output += "\n    <div class=\"govuk-header__content\">\n    ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName")) {
output += "\n      ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceUrl")) {
output += "\n      <a href=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceUrl"), env.opts.autoescape);
output += "\" class=\"govuk-header__link govuk-header__service-name\">\n        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName"), env.opts.autoescape);
output += "\n      </a>\n      ";
;
}
else {
output += "\n      <span class=\"govuk-header__service-name\">\n        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName"), env.opts.autoescape);
output += "\n      </span>\n      ";
;
}
output += "\n    ";
;
}
output += "\n    ";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigation"))) {
output += "\n      <nav aria-label=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigationLabel"),runtime.contextOrFrameLookup(context, frame, "menuButtonText"),true), env.opts.autoescape);
output += "\" class=\"govuk-header__navigation";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigationClasses")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigationClasses"), env.opts.autoescape);
;
}
output += "\">\n        <button type=\"button\" class=\"govuk-header__menu-button govuk-js-header-toggle\" aria-controls=\"navigation\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonLabel") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonLabel") != runtime.contextOrFrameLookup(context, frame, "menuButtonText")) {
output += " aria-label=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonLabel"), env.opts.autoescape);
output += "\"";
;
}
output += " hidden>\n          ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "menuButtonText"), env.opts.autoescape);
output += "\n        </button>\n\n        <ul id=\"navigation\" class=\"govuk-header__navigation-list\">\n        ";
frame = frame.push();
var t_10 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigation");
if(t_10) {t_10 = runtime.fromIterator(t_10);
var t_9 = t_10.length;
for(var t_8=0; t_8 < t_10.length; t_8++) {
var t_11 = t_10[t_8];
frame.set("item", t_11);
frame.set("loop.index", t_8 + 1);
frame.set("loop.index0", t_8);
frame.set("loop.revindex", t_9 - t_8);
frame.set("loop.revindex0", t_9 - t_8 - 1);
frame.set("loop.first", t_8 === 0);
frame.set("loop.last", t_8 === t_9 - 1);
frame.set("loop.length", t_9);
output += "\n          ";
if(runtime.memberLookup((t_11),"text") || runtime.memberLookup((t_11),"html")) {
output += "\n          <li class=\"govuk-header__navigation-item";
if(runtime.memberLookup((t_11),"active")) {
output += " govuk-header__navigation-item--active";
;
}
output += "\">\n            ";
if(runtime.memberLookup((t_11),"href")) {
output += "\n            <a class=\"govuk-header__link\" href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_11),"href"), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 80, colno = 33, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_11),"attributes")])), env.opts.autoescape);
output += ">\n            ";
;
}
output += "\n              ";
output += runtime.suppressValue((runtime.memberLookup((t_11),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((t_11),"html"))),14):runtime.memberLookup((t_11),"text")), env.opts.autoescape);
output += "\n            ";
if(runtime.memberLookup((t_11),"href")) {
output += "\n            </a>\n            ";
;
}
output += "\n          </li>\n          ";
;
}
output += "\n        ";
;
}
}
frame = frame.pop();
output += "\n        </ul>\n      </nav>\n    ";
;
}
output += "\n    </div>\n  ";
;
}
output += "\n  </div>\n</header>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/hint/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/hint/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukHint");
context.setVariable("govukHint", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/hint/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/hint/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<div";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
output += " class=\"govuk-hint";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),2):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/input/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/input/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukInput");
context.setVariable("govukInput", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/input/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/input/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../error-message/macro.njk", false, "components/input/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukErrorMessage")) {
var t_8 = t_5.govukErrorMessage;
} else {
cb(new Error("cannot import 'govukErrorMessage'")); return;
}
context.setVariable("govukErrorMessage", t_8);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/input/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukHint")) {
var t_12 = t_9.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_12);
output += "\n";
env.getTemplate("../label/macro.njk", false, "components/input/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukLabel")) {
var t_16 = t_13.govukLabel;
} else {
cb(new Error("cannot import 'govukLabel'")); return;
}
context.setVariable("govukLabel", t_16);
var t_17;
t_17 = "govuk-input";
frame.set("classNames", t_17, true);
if(frame.topLevel) {
context.setVariable("classNames", t_17);
}
if(frame.topLevel) {
context.addExport("classNames", t_17);
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += "\n  ";
var t_18;
t_18 = runtime.contextOrFrameLookup(context, frame, "classNames") + " " + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes");
frame.set("classNames", t_18, true);
if(frame.topLevel) {
context.setVariable("classNames", t_18);
}
if(frame.topLevel) {
context.addExport("classNames", t_18);
}
output += "\n";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_19;
t_19 = runtime.contextOrFrameLookup(context, frame, "classNames") + " govuk-input--error";
frame.set("classNames", t_19, true);
if(frame.topLevel) {
context.setVariable("classNames", t_19);
}
if(frame.topLevel) {
context.addExport("classNames", t_19);
}
output += "\n";
;
}
var t_20;
t_20 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy"):runtime.contextOrFrameLookup(context, frame, "undefined"));
frame.set("describedBy", t_20, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_20);
}
if(frame.topLevel) {
context.addExport("describedBy", t_20);
}
var t_21;
t_21 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"prefix") && (runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"prefix")),"text") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"prefix")),"html"))?true:false);
frame.set("hasPrefix", t_21, true);
if(frame.topLevel) {
context.setVariable("hasPrefix", t_21);
}
if(frame.topLevel) {
context.addExport("hasPrefix", t_21);
}
var t_22;
t_22 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"suffix") && (runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"suffix")),"text") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"suffix")),"html"))?true:false);
frame.set("hasSuffix", t_22, true);
if(frame.topLevel) {
context.setVariable("hasSuffix", t_22);
}
if(frame.topLevel) {
context.addExport("hasSuffix", t_22);
}
var t_23;
t_23 = (runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput") && (runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"text") || runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html"))?true:false);
frame.set("hasBeforeInput", t_23, true);
if(frame.topLevel) {
context.setVariable("hasBeforeInput", t_23);
}
if(frame.topLevel) {
context.addExport("hasBeforeInput", t_23);
}
var t_24;
t_24 = (runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput") && (runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"text") || runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html"))?true:false);
frame.set("hasAfterInput", t_24, true);
if(frame.topLevel) {
context.setVariable("hasAfterInput", t_24);
}
if(frame.topLevel) {
context.addExport("hasAfterInput", t_24);
}
var macro_t_25 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_26 = "";t_26 += "<input";
t_26 += runtime.suppressValue((lineno = 27, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [{"class": runtime.contextOrFrameLookup(context, frame, "classNames"),"id": runtime.memberLookup((l_params),"id"),"name": runtime.memberLookup((l_params),"name"),"type": env.getFilter("default").call(context, runtime.memberLookup((l_params),"type"),"text",true),"spellcheck": {"value": ((lineno = 34, colno = 35, runtime.callWrap(runtime.memberLookup(([true,false]),"includes"), "--expression--[\"includes\"]", context, [runtime.memberLookup((l_params),"spellcheck")]))?env.getFilter("string").call(context, runtime.memberLookup((l_params),"spellcheck")):false),"optional": true},"value": {"value": runtime.memberLookup((l_params),"value"),"optional": true},"disabled": {"value": runtime.memberLookup((l_params),"disabled"),"optional": true},"aria-describedby": {"value": runtime.contextOrFrameLookup(context, frame, "describedBy"),"optional": true},"autocomplete": {"value": runtime.memberLookup((l_params),"autocomplete"),"optional": true},"autocapitalize": {"value": runtime.memberLookup((l_params),"autocapitalize"),"optional": true},"pattern": {"value": runtime.memberLookup((l_params),"pattern"),"optional": true},"inputmode": {"value": runtime.memberLookup((l_params),"inputmode"),"optional": true}}])), env.opts.autoescape);
t_26 += runtime.suppressValue((lineno = 68, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_params),"attributes")])), env.opts.autoescape);
t_26 += ">";
;
frame = callerFrame;
return new runtime.SafeString(t_26);
});
context.setVariable("_inputElement", macro_t_25);
var macro_t_27 = runtime.makeMacro(
["affix", "type"], 
[], 
function (l_affix, l_type, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("affix", l_affix);
frame.set("type", l_type);
var t_28 = "";t_28 += "\n  <div class=\"govuk-input__";
t_28 += runtime.suppressValue(l_type, env.opts.autoescape);
if(runtime.memberLookup((l_affix),"classes")) {
t_28 += " ";
t_28 += runtime.suppressValue(runtime.memberLookup((l_affix),"classes"), env.opts.autoescape);
;
}
t_28 += "\" aria-hidden=\"true\"";
t_28 += runtime.suppressValue((lineno = 72, colno = 132, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_affix),"attributes")])), env.opts.autoescape);
t_28 += ">";
t_28 += runtime.suppressValue((runtime.memberLookup((l_affix),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((l_affix),"html"))),4):runtime.memberLookup((l_affix),"text")), env.opts.autoescape);
t_28 += "</div>";
;
frame = callerFrame;
return new runtime.SafeString(t_28);
});
context.setVariable("_affixItem", macro_t_27);
output += "<div class=\"govuk-form-group";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-form-group--error";
;
}
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 78, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 79, colno = 15, runtime.callWrap(t_16, "govukLabel", context, [{"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"text"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"classes"),"isPageHeading": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"isPageHeading"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"attributes"),"for": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")}]))),2), env.opts.autoescape);
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")) {
output += "\n  ";
var t_29;
t_29 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-hint";
frame.set("hintId", t_29, true);
if(frame.topLevel) {
context.setVariable("hintId", t_29);
}
if(frame.topLevel) {
context.addExport("hintId", t_29);
}
output += "\n  ";
var t_30;
t_30 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "hintId"):runtime.contextOrFrameLookup(context, frame, "hintId"));
frame.set("describedBy", t_30, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_30);
}
if(frame.topLevel) {
context.addExport("describedBy", t_30);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 90, colno = 14, runtime.callWrap(t_12, "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "hintId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"text")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_31;
t_31 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-error";
frame.set("errorId", t_31, true);
if(frame.topLevel) {
context.setVariable("errorId", t_31);
}
if(frame.topLevel) {
context.addExport("errorId", t_31);
}
output += "\n  ";
var t_32;
t_32 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "errorId"):runtime.contextOrFrameLookup(context, frame, "errorId"));
frame.set("describedBy", t_32, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_32);
}
if(frame.topLevel) {
context.addExport("describedBy", t_32);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 101, colno = 22, runtime.callWrap(t_8, "govukErrorMessage", context, [{"id": runtime.contextOrFrameLookup(context, frame, "errorId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"text"),"visuallyHiddenText": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"visuallyHiddenText")}]))),2), env.opts.autoescape);
output += "\n";
;
}
if(runtime.contextOrFrameLookup(context, frame, "hasPrefix") || runtime.contextOrFrameLookup(context, frame, "hasSuffix") || runtime.contextOrFrameLookup(context, frame, "hasBeforeInput") || runtime.contextOrFrameLookup(context, frame, "hasAfterInput")) {
output += "\n  <div class=\"govuk-input__wrapper";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"inputWrapper")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"inputWrapper")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 113, colno = 23, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"inputWrapper")),"attributes")])), env.opts.autoescape);
output += ">\n    ";
if(runtime.contextOrFrameLookup(context, frame, "hasBeforeInput")) {
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html"))),4,true):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n    ";
if(runtime.contextOrFrameLookup(context, frame, "hasPrefix")) {
output += runtime.suppressValue(env.getFilter("indent").call(context, (lineno = 118, colno = 20, runtime.callWrap(macro_t_27, "_affixItem", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"prefix"),"prefix"])),2,true), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n    ";
output += runtime.suppressValue((lineno = 120, colno = 20, runtime.callWrap(macro_t_25, "_inputElement", context, [runtime.contextOrFrameLookup(context, frame, "params")])), env.opts.autoescape);
output += "\n    ";
if(runtime.contextOrFrameLookup(context, frame, "hasSuffix")) {
output += runtime.suppressValue(env.getFilter("indent").call(context, (lineno = 122, colno = 20, runtime.callWrap(macro_t_27, "_affixItem", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"suffix"),"suffix"])),2,true), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n    ";
if(runtime.contextOrFrameLookup(context, frame, "hasAfterInput")) {
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html"))),4,true):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n  </div>\n";
;
}
else {
output += "\n  ";
output += runtime.suppressValue((lineno = 129, colno = 18, runtime.callWrap(macro_t_25, "_inputElement", context, [runtime.contextOrFrameLookup(context, frame, "params")])), env.opts.autoescape);
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/inset-text/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/inset-text/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukInsetText");
context.setVariable("govukInsetText", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/inset-text/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/inset-text/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<div";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
output += " class=\"govuk-inset-text";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "caller")?(lineno = 4, colno = 11, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, [])):((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),2):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")))), env.opts.autoescape);
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/label/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/label/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukLabel");
context.setVariable("govukLabel", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/label/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/label/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")) {
output += "\n";
var t_5;
t_5 = (function() {
var output = "";
output += "\n<label class=\"govuk-label";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 5, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"for")) {
output += " for=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"for"), env.opts.autoescape);
output += "\"";
;
}
output += ">\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),2):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += "\n</label>\n";
;
return output;
})()
;
frame.set("labelHtml", t_5, true);
if(frame.topLevel) {
context.setVariable("labelHtml", t_5);
}
if(frame.topLevel) {
context.addExport("labelHtml", t_5);
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"isPageHeading")) {
output += "\n<h1 class=\"govuk-label-wrapper\">\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "labelHtml"))),2), env.opts.autoescape);
output += "\n</h1>\n";
;
}
else {
output += "\n";
output += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "labelHtml"))), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/notification-banner/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/notification-banner/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukNotificationBanner");
context.setVariable("govukNotificationBanner", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/notification-banner/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/notification-banner/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"type") == "success") {
output += "\n  ";
var t_5;
t_5 = true;
frame.set("successBanner", t_5, true);
if(frame.topLevel) {
context.setVariable("successBanner", t_5);
}
if(frame.topLevel) {
context.addExport("successBanner", t_5);
}
output += "\n";
;
}
if(runtime.contextOrFrameLookup(context, frame, "successBanner")) {
output += "\n  ";
var t_6;
t_6 = "govuk-notification-banner--" + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"type");
frame.set("typeClass", t_6, true);
if(frame.topLevel) {
context.setVariable("typeClass", t_6);
}
if(frame.topLevel) {
context.addExport("typeClass", t_6);
}
output += "\n";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"role")) {
output += "\n  ";
var t_7;
t_7 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"role");
frame.set("role", t_7, true);
if(frame.topLevel) {
context.setVariable("role", t_7);
}
if(frame.topLevel) {
context.addExport("role", t_7);
}
output += "\n";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "successBanner")) {
var t_8;
t_8 = "alert";
frame.set("role", t_8, true);
if(frame.topLevel) {
context.setVariable("role", t_8);
}
if(frame.topLevel) {
context.addExport("role", t_8);
}
output += "\n";
;
}
else {
var t_9;
t_9 = "region";
frame.set("role", t_9, true);
if(frame.topLevel) {
context.setVariable("role", t_9);
}
if(frame.topLevel) {
context.addExport("role", t_9);
}
output += "\n";
;
}
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHtml")) {
output += "\n  ";
var t_10;
t_10 = env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHtml"));
frame.set("title", t_10, true);
if(frame.topLevel) {
context.setVariable("title", t_10);
}
if(frame.topLevel) {
context.addExport("title", t_10);
}
;
}
else {
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleText")) {
output += "\n  ";
var t_11;
t_11 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleText");
frame.set("title", t_11, true);
if(frame.topLevel) {
context.setVariable("title", t_11);
}
if(frame.topLevel) {
context.addExport("title", t_11);
}
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "successBanner")) {
output += "\n  ";
var t_12;
t_12 = "Success";
frame.set("title", t_12, true);
if(frame.topLevel) {
context.setVariable("title", t_12);
}
if(frame.topLevel) {
context.addExport("title", t_12);
}
;
}
else {
output += "\n  ";
var t_13;
t_13 = "Important";
frame.set("title", t_13, true);
if(frame.topLevel) {
context.setVariable("title", t_13);
}
if(frame.topLevel) {
context.addExport("title", t_13);
}
;
}
;
}
;
}
output += "<div class=\"govuk-notification-banner";
if(runtime.contextOrFrameLookup(context, frame, "typeClass")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "typeClass"), env.opts.autoescape);
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\" role=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "role"), env.opts.autoescape);
output += "\" aria-labelledby=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleId"),"govuk-notification-banner-title",true), env.opts.autoescape);
output += "\" data-module=\"govuk-notification-banner\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disableAutoFocus") !== runtime.contextOrFrameLookup(context, frame, "undefined")) {
output += " data-disable-auto-focus=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disableAutoFocus"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 32, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  <div class=\"govuk-notification-banner__header\">\n    <h";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHeadingLevel"),2,true), env.opts.autoescape);
output += " class=\"govuk-notification-banner__title\" id=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleId"),"govuk-notification-banner-title",true), env.opts.autoescape);
output += "\">\n      ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "title"), env.opts.autoescape);
output += "\n    </h";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHeadingLevel"),2,true), env.opts.autoescape);
output += ">\n  </div>\n  <div class=\"govuk-notification-banner__content\">\n  ";
if(runtime.contextOrFrameLookup(context, frame, "caller") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")) {
output += "\n    ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "caller")?(lineno = 40, colno = 13, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, [])):env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),4)), env.opts.autoescape);
output += "\n  ";
;
}
else {
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")) {
output += "\n    ";
output += "<p class=\"govuk-notification-banner__heading\">\n      ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")),6), env.opts.autoescape);
output += "\n    </p>\n  ";
;
}
;
}
output += "\n  </div>\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/pagination/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/pagination/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukPagination");
context.setVariable("govukPagination", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/pagination/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/pagination/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var t_5;
t_5 = !runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items") && (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"next") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"previous"));
frame.set("blockLevel", t_5, true);
if(frame.topLevel) {
context.setVariable("blockLevel", t_5);
}
if(frame.topLevel) {
context.addExport("blockLevel", t_5);
}
var t_6;
t_6 = (function() {
var output = "";
output += "\n  <svg class=\"govuk-pagination__icon govuk-pagination__icon--prev\" xmlns=\"http://www.w3.org/2000/svg\" height=\"13\" width=\"15\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 15 13\">\n    <path d=\"m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z\"></path>\n  </svg>";
;
return output;
})()
;
frame.set("arrowPrevious", t_6, true);
if(frame.topLevel) {
context.setVariable("arrowPrevious", t_6);
}
if(frame.topLevel) {
context.addExport("arrowPrevious", t_6);
}
var t_7;
t_7 = (function() {
var output = "";
output += "\n  <svg class=\"govuk-pagination__icon govuk-pagination__icon--next\" xmlns=\"http://www.w3.org/2000/svg\" height=\"13\" width=\"15\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 15 13\">\n    <path d=\"m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z\"></path>\n  </svg>";
;
return output;
})()
;
frame.set("arrowNext", t_7, true);
if(frame.topLevel) {
context.setVariable("arrowNext", t_7);
}
if(frame.topLevel) {
context.addExport("arrowNext", t_7);
}
var macro_t_8 = runtime.makeMacro(
["link"], 
["type"], 
function (l_link, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("link", l_link);
frame.set("type", Object.prototype.hasOwnProperty.call(kwargs, "type") ? kwargs["type"] : "next");var t_9 = "";t_9 += "\n  ";
var t_10;
t_10 = (runtime.contextOrFrameLookup(context, frame, "type") == "prev"?runtime.contextOrFrameLookup(context, frame, "arrowPrevious"):runtime.contextOrFrameLookup(context, frame, "arrowNext"));
frame.set("arrowType", t_10, true);
if(frame.topLevel) {
context.setVariable("arrowType", t_10);
}
if(frame.topLevel) {
context.addExport("arrowType", t_10);
}
t_9 += "\n  <div class=\"govuk-pagination__";
t_9 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "type"), env.opts.autoescape);
t_9 += "\">\n    <a class=\"govuk-link govuk-pagination__link\" href=\"";
t_9 += runtime.suppressValue(runtime.memberLookup((l_link),"href"), env.opts.autoescape);
t_9 += "\" rel=\"";
t_9 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "type"), env.opts.autoescape);
t_9 += "\"";
t_9 += runtime.suppressValue((lineno = 20, colno = 25, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_link),"attributes")])), env.opts.autoescape);
t_9 += ">\n      ";
if(runtime.contextOrFrameLookup(context, frame, "blockLevel") || runtime.contextOrFrameLookup(context, frame, "type") == "prev") {
t_9 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "arrowType")),4,true), env.opts.autoescape);
t_9 += "\n      ";
;
}
t_9 += "\n      <span class=\"govuk-pagination__link-title";
if(runtime.contextOrFrameLookup(context, frame, "blockLevel") && !runtime.memberLookup((l_link),"labelText")) {
t_9 += " govuk-pagination__link-title--decorated";
;
}
t_9 += "\">\n        ";
t_9 += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, (lineno = 25, colno = 17, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, [])))), env.opts.autoescape);
t_9 += "\n      </span>\n      ";
if(runtime.memberLookup((l_link),"labelText") && runtime.contextOrFrameLookup(context, frame, "blockLevel")) {
t_9 += "\n      <span class=\"govuk-visually-hidden\">:</span>\n      <span class=\"govuk-pagination__link-label\">";
t_9 += runtime.suppressValue(runtime.memberLookup((l_link),"labelText"), env.opts.autoescape);
t_9 += "</span>\n      ";
;
}
t_9 += "\n      ";
if(!runtime.contextOrFrameLookup(context, frame, "blockLevel") && runtime.contextOrFrameLookup(context, frame, "type") == "next") {
t_9 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "arrowType")),4,true), env.opts.autoescape);
t_9 += "\n      ";
;
}
t_9 += "\n    </a>\n  </div>\n";
;
frame = callerFrame;
return new runtime.SafeString(t_9);
});
context.setVariable("_arrowLink", macro_t_8);
var macro_t_11 = runtime.makeMacro(
["item"], 
[], 
function (l_item, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("item", l_item);
var t_12 = "";t_12 += "<li class=\"govuk-pagination__item";
if(runtime.memberLookup((l_item),"current")) {
t_12 += " govuk-pagination__item--current";
;
}
if(runtime.memberLookup((l_item),"ellipsis")) {
t_12 += " govuk-pagination__item--ellipses";
;
}
t_12 += "\">\n  ";
if(runtime.memberLookup((l_item),"ellipsis")) {
t_12 += "\n    &ctdot;\n  ";
;
}
else {
t_12 += "\n    <a class=\"govuk-link govuk-pagination__link\" href=\"";
t_12 += runtime.suppressValue(runtime.memberLookup((l_item),"href"), env.opts.autoescape);
t_12 += "\" aria-label=\"";
t_12 += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((l_item),"visuallyHiddenText"),"Page " + runtime.memberLookup((l_item),"number")), env.opts.autoescape);
t_12 += "\"";
if(runtime.memberLookup((l_item),"current")) {
t_12 += " aria-current=\"page\"";
;
}
t_12 += runtime.suppressValue((lineno = 45, colno = 25, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_item),"attributes")])), env.opts.autoescape);
t_12 += ">\n      ";
t_12 += runtime.suppressValue(runtime.memberLookup((l_item),"number"), env.opts.autoescape);
t_12 += "\n    </a>\n  ";
;
}
t_12 += "\n  </li>";
;
frame = callerFrame;
return new runtime.SafeString(t_12);
});
context.setVariable("_pageItem", macro_t_11);
output += "<nav class=\"govuk-pagination";
if(runtime.contextOrFrameLookup(context, frame, "blockLevel")) {
output += " govuk-pagination--block";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\" aria-label=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"landmarkLabel"),"Pagination",true), env.opts.autoescape);
output += "\"";
output += runtime.suppressValue((lineno = 53, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
var t_13;
t_13 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"previous");
frame.set("previous", t_13, true);
if(frame.topLevel) {
context.setVariable("previous", t_13);
}
if(frame.topLevel) {
context.addExport("previous", t_13);
}
output += "\n  ";
var t_14;
t_14 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"next");
frame.set("next", t_14, true);
if(frame.topLevel) {
context.setVariable("next", t_14);
}
if(frame.topLevel) {
context.addExport("next", t_14);
}
if(runtime.contextOrFrameLookup(context, frame, "previous") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "previous")),"href")) {
output += "\n    ";
output += runtime.suppressValue((lineno = 58, colno = 22, runtime.callWrap(macro_t_8, "_arrowLink", context, [runtime.contextOrFrameLookup(context, frame, "previous"),"prev",runtime.makeKeywordArgs({"caller": (function (){var macro_t_15 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
var callerFrame = frame;
frame = frame.push(true);
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
var t_16 = "";t_16 += "\n      ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "previous")),"html") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "previous")),"text")) {
t_16 += "\n        ";
t_16 += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "previous")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "previous")),"html"))),8):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "previous")),"text")), env.opts.autoescape);
t_16 += "\n      ";
;
}
else {
t_16 += "\n        Previous<span class=\"govuk-visually-hidden\"> page</span>\n      ";
;
}
t_16 += "\n    ";
;
frame = frame.pop();
return new runtime.SafeString(t_16);
});
return macro_t_15;})()})])), env.opts.autoescape);
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items")) {
output += "\n  <ul class=\"govuk-pagination__list\">\n  ";
frame = frame.push();
var t_19 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_19) {t_19 = runtime.fromIterator(t_19);
var t_18 = t_19.length;
for(var t_17=0; t_17 < t_19.length; t_17++) {
var t_20 = t_19[t_17];
frame.set("item", t_20);
frame.set("loop.index", t_17 + 1);
frame.set("loop.index0", t_17);
frame.set("loop.revindex", t_18 - t_17);
frame.set("loop.revindex0", t_18 - t_17 - 1);
frame.set("loop.first", t_17 === 0);
frame.set("loop.last", t_17 === t_18 - 1);
frame.set("loop.length", t_18);
output += "\n    ";
output += runtime.suppressValue(env.getFilter("indent").call(context, (lineno = 70, colno = 16, runtime.callWrap(macro_t_11, "_pageItem", context, [t_20])),2), env.opts.autoescape);
output += "\n  ";
;
}
}
frame = frame.pop();
output += "\n  </ul>\n  ";
;
}
if(runtime.contextOrFrameLookup(context, frame, "next") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "next")),"href")) {
output += "\n    ";
output += runtime.suppressValue((lineno = 76, colno = 22, runtime.callWrap(macro_t_8, "_arrowLink", context, [runtime.contextOrFrameLookup(context, frame, "next"),"next",runtime.makeKeywordArgs({"caller": (function (){var macro_t_21 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
var callerFrame = frame;
frame = frame.push(true);
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
var t_22 = "";t_22 += "\n      ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "next")),"html") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "next")),"text")) {
t_22 += "\n        ";
t_22 += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "next")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "next")),"html"))),8):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "next")),"text")), env.opts.autoescape);
t_22 += "\n      ";
;
}
else {
t_22 += "\n        Next<span class=\"govuk-visually-hidden\"> page</span>\n      ";
;
}
t_22 += "\n    ";
;
frame = frame.pop();
return new runtime.SafeString(t_22);
});
return macro_t_21;})()})])), env.opts.autoescape);
output += "\n  ";
;
}
output += "\n</nav>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/panel/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/panel/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukPanel");
context.setVariable("govukPanel", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/panel/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/panel/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var t_5;
t_5 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"headingLevel")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"headingLevel"):1);
frame.set("headingLevel", t_5, true);
if(frame.topLevel) {
context.setVariable("headingLevel", t_5);
}
if(frame.topLevel) {
context.addExport("headingLevel", t_5);
}
output += "<div class=\"govuk-panel govuk-panel--confirmation";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 6, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  <h";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "headingLevel"), env.opts.autoescape);
output += " class=\"govuk-panel__title\">\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHtml")?env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleHtml")):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"titleText")), env.opts.autoescape);
output += "\n  </h";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "headingLevel"), env.opts.autoescape);
output += ">\n  ";
if(runtime.contextOrFrameLookup(context, frame, "caller") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")) {
output += "\n  <div class=\"govuk-panel__body\">\n    ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "caller")?(lineno = 12, colno = 13, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, [])):((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),4):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")))), env.opts.autoescape);
output += "\n  </div>\n  ";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/password-input/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/password-input/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukPasswordInput");
context.setVariable("govukPasswordInput", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/password-input/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/password-input/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
env.getTemplate("../../macros/i18n.njk", false, "components/password-input/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukI18nAttributes")) {
var t_8 = t_5.govukI18nAttributes;
} else {
cb(new Error("cannot import 'govukI18nAttributes'")); return;
}
context.setVariable("govukI18nAttributes", t_8);
env.getTemplate("../button/macro.njk", false, "components/password-input/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukButton")) {
var t_12 = t_9.govukButton;
} else {
cb(new Error("cannot import 'govukButton'")); return;
}
context.setVariable("govukButton", t_12);
env.getTemplate("../input/macro.njk", false, "components/password-input/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukInput")) {
var t_16 = t_13.govukInput;
} else {
cb(new Error("cannot import 'govukInput'")); return;
}
context.setVariable("govukInput", t_16);
var t_17;
t_17 = (function() {
var output = "";
output += runtime.suppressValue(env.getFilter("safe").call(context, " data-module=\"govuk-password-input\""), env.opts.autoescape);
output += runtime.suppressValue((lineno = 9, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "show-password","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"showPasswordText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 14, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "hide-password","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hidePasswordText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 19, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "show-password-aria-label","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"showPasswordAriaLabelText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 24, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "hide-password-aria-label","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hidePasswordAriaLabelText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 29, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "password-shown-announcement","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"passwordShownAnnouncementText")}])), env.opts.autoescape);
output += runtime.suppressValue((lineno = 34, colno = 25, runtime.callWrap(t_8, "govukI18nAttributes", context, [{"key": "password-hidden-announcement","message": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"passwordHiddenAnnouncementText")}])), env.opts.autoescape);
;
return output;
})()
;
frame.set("attributesHtml", t_17, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_17);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_17);
}
frame = frame.push();
var t_20 = runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes");
if(t_20) {t_20 = runtime.fromIterator(t_20);
var t_18;
if(runtime.isArray(t_20)) {
var t_19 = t_20.length;
for(t_18=0; t_18 < t_20.length; t_18++) {
var t_21 = t_20[t_18][0];
frame.set("[object Object]", t_20[t_18][0]);
var t_22 = t_20[t_18][1];
frame.set("[object Object]", t_20[t_18][1]);
frame.set("loop.index", t_18 + 1);
frame.set("loop.index0", t_18);
frame.set("loop.revindex", t_19 - t_18);
frame.set("loop.revindex0", t_19 - t_18 - 1);
frame.set("loop.first", t_18 === 0);
frame.set("loop.last", t_18 === t_19 - 1);
frame.set("loop.length", t_19);
output += "\n  ";
var t_23;
t_23 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_21) + "=\"" + env.getFilter("escape").call(context, t_22) + "\"";
frame.set("attributesHtml", t_23, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_23);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_23);
}
output += "\n";
;
}
} else {
t_18 = -1;
var t_19 = runtime.keys(t_20).length;
for(var t_24 in t_20) {
t_18++;
var t_25 = t_20[t_24];
frame.set("name", t_24);
frame.set("value", t_25);
frame.set("loop.index", t_18 + 1);
frame.set("loop.index0", t_18);
frame.set("loop.revindex", t_19 - t_18);
frame.set("loop.revindex0", t_19 - t_18 - 1);
frame.set("loop.first", t_18 === 0);
frame.set("loop.last", t_18 === t_19 - 1);
frame.set("loop.length", t_19);
output += "\n  ";
var t_26;
t_26 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_24) + "=\"" + env.getFilter("escape").call(context, t_25) + "\"";
frame.set("attributesHtml", t_26, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_26);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_26);
}
output += "\n";
;
}
}
}
frame = frame.pop();
var t_27;
t_27 = (function() {
var output = "";
output += "\n";
output += runtime.suppressValue(env.getFilter("trim").call(context, (lineno = 46, colno = 14, runtime.callWrap(t_12, "govukButton", context, [{"type": "button","classes": "govuk-button--secondary govuk-password-input__toggle govuk-js-password-input-toggle" + ((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"button")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"button")),"classes"):"")),"text": env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"showPasswordText"),"Show"),"attributes": {"aria-controls": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"),"aria-label": env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"showPasswordAriaLabelText"),"Show password"),"hidden": {"value": true,"optional": true}}}]))), env.opts.autoescape);
output += "\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")) {
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html")?env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html"))):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
;
return output;
})()
;
frame.set("buttonHtml", t_27, true);
if(frame.topLevel) {
context.setVariable("buttonHtml", t_27);
}
if(frame.topLevel) {
context.addExport("buttonHtml", t_27);
}
output += runtime.suppressValue(env.getFilter("trim").call(context, (lineno = 64, colno = 13, runtime.callWrap(t_16, "govukInput", context, [{"formGroup": {"classes": "govuk-password-input" + ((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"):"")),"attributes": runtime.contextOrFrameLookup(context, frame, "attributesHtml"),"beforeInput": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput"),"afterInput": {"html": runtime.contextOrFrameLookup(context, frame, "buttonHtml")}},"inputWrapper": {"classes": "govuk-password-input__wrapper"},"label": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label"),"hint": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint"),"classes": "govuk-password-input__input govuk-js-password-input-input" + ((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")?" " + runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"):"")),"errorMessage": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage"),"id": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"),"name": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"),"type": "password","spellcheck": false,"autocapitalize": "none","autocomplete": (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"autocomplete")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"autocomplete"):"current-password"),"value": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value"),"disabled": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disabled"),"describedBy": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy"),"attributes": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")}]))), env.opts.autoescape);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/phase-banner/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/phase-banner/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukPhaseBanner");
context.setVariable("govukPhaseBanner", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/phase-banner/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/phase-banner/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../tag/macro.njk", false, "components/phase-banner/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukTag")) {
var t_8 = t_5.govukTag;
} else {
cb(new Error("cannot import 'govukTag'")); return;
}
context.setVariable("govukTag", t_8);
output += "<div class=\"govuk-phase-banner";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 5, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  <p class=\"govuk-phase-banner__content\">\n    ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 7, colno = 15, runtime.callWrap(t_8, "govukTag", context, [{"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"tag")),"text"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"tag")),"html"),"classes": "govuk-phase-banner__content__tag" + ((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"tag")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"tag")),"classes"):""))}]))),4), env.opts.autoescape);
output += "\n    <span class=\"govuk-phase-banner__text\">\n      ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),6):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += "\n    </span>\n  </p>\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/radios/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/radios/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukRadios");
context.setVariable("govukRadios", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/radios/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/radios/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../error-message/macro.njk", false, "components/radios/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukErrorMessage")) {
var t_8 = t_5.govukErrorMessage;
} else {
cb(new Error("cannot import 'govukErrorMessage'")); return;
}
context.setVariable("govukErrorMessage", t_8);
output += "\n";
env.getTemplate("../fieldset/macro.njk", false, "components/radios/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukFieldset")) {
var t_12 = t_9.govukFieldset;
} else {
cb(new Error("cannot import 'govukFieldset'")); return;
}
context.setVariable("govukFieldset", t_12);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/radios/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukHint")) {
var t_16 = t_13.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_16);
output += "\n";
env.getTemplate("../label/macro.njk", false, "components/radios/template.njk", false, function(t_18,t_17) {
if(t_18) { cb(t_18); return; }
t_17.getExported(function(t_19,t_17) {
if(t_19) { cb(t_19); return; }
if(Object.prototype.hasOwnProperty.call(t_17, "govukLabel")) {
var t_20 = t_17.govukLabel;
} else {
cb(new Error("cannot import 'govukLabel'")); return;
}
context.setVariable("govukLabel", t_20);
var t_21;
t_21 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix"):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"));
frame.set("idPrefix", t_21, true);
if(frame.topLevel) {
context.setVariable("idPrefix", t_21);
}
if(frame.topLevel) {
context.addExport("idPrefix", t_21);
}
var t_22;
t_22 = (runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"describedBy")?runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"describedBy"):"");
frame.set("describedBy", t_22, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_22);
}
if(frame.topLevel) {
context.addExport("describedBy", t_22);
}
var t_23;
t_23 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")?true:false);
frame.set("hasFieldset", t_23, true);
if(frame.topLevel) {
context.setVariable("hasFieldset", t_23);
}
if(frame.topLevel) {
context.addExport("hasFieldset", t_23);
}
var macro_t_24 = runtime.makeMacro(
["params", "item", "index"], 
[], 
function (l_params, l_item, l_index, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
frame.set("item", l_item);
frame.set("index", l_index);
var t_25 = "";var t_26;
t_26 = (runtime.memberLookup((l_item),"id")?runtime.memberLookup((l_item),"id"):runtime.contextOrFrameLookup(context, frame, "idPrefix") + ((l_index > 1?"-" + l_index:"")));
frame.set("itemId", t_26, true);
if(frame.topLevel) {
context.setVariable("itemId", t_26);
}
if(frame.topLevel) {
context.addExport("itemId", t_26);
}
t_25 += "\n  ";
var t_27;
t_27 = "conditional-" + runtime.contextOrFrameLookup(context, frame, "itemId");
frame.set("conditionalId", t_27, true);
if(frame.topLevel) {
context.setVariable("conditionalId", t_27);
}
if(frame.topLevel) {
context.addExport("conditionalId", t_27);
}
if(runtime.memberLookup((l_item),"divider")) {
t_25 += "\n    <div class=\"govuk-radios__divider\">";
t_25 += runtime.suppressValue(runtime.memberLookup((l_item),"divider"), env.opts.autoescape);
t_25 += "</div>\n  ";
;
}
else {
t_25 += "\n    ";
var t_28;
t_28 = env.getFilter("default").call(context, runtime.memberLookup((l_item),"checked"),(runtime.memberLookup((l_params),"value")?(runtime.memberLookup((l_item),"value") == runtime.memberLookup((l_params),"value") && runtime.memberLookup((l_item),"checked") != false):false),true);
frame.set("isChecked", t_28, true);
if(frame.topLevel) {
context.setVariable("isChecked", t_28);
}
if(frame.topLevel) {
context.addExport("isChecked", t_28);
}
t_25 += "\n    ";
var t_29;
t_29 = (runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"text") || runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"html")?true:"");
frame.set("hasHint", t_29, true);
if(frame.topLevel) {
context.setVariable("hasHint", t_29);
}
if(frame.topLevel) {
context.addExport("hasHint", t_29);
}
t_25 += "\n    ";
var t_30;
t_30 = runtime.contextOrFrameLookup(context, frame, "itemId") + "-item-hint";
frame.set("itemHintId", t_30, true);
if(frame.topLevel) {
context.setVariable("itemHintId", t_30);
}
if(frame.topLevel) {
context.addExport("itemHintId", t_30);
}
t_25 += "\n    <div class=\"govuk-radios__item\">\n      <input class=\"govuk-radios__input\" id=\"";
t_25 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "itemId"), env.opts.autoescape);
t_25 += "\" name=\"";
t_25 += runtime.suppressValue(runtime.memberLookup((l_params),"name"), env.opts.autoescape);
t_25 += "\" type=\"radio\" value=\"";
t_25 += runtime.suppressValue(runtime.memberLookup((l_item),"value"), env.opts.autoescape);
t_25 += "\"";
t_25 += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "isChecked")?" checked":""), env.opts.autoescape);
t_25 += runtime.suppressValue((runtime.memberLookup((l_item),"disabled")?" disabled":""), env.opts.autoescape);
if(runtime.memberLookup((runtime.memberLookup((l_item),"conditional")),"html")) {
t_25 += " data-aria-controls=\"";
t_25 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "conditionalId"), env.opts.autoescape);
t_25 += "\"";
;
}
if(runtime.contextOrFrameLookup(context, frame, "hasHint")) {
t_25 += " aria-describedby=\"";
t_25 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "itemHintId"), env.opts.autoescape);
t_25 += "\"";
;
}
t_25 += runtime.suppressValue((lineno = 34, colno = 27, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_item),"attributes")])), env.opts.autoescape);
t_25 += ">\n      ";
t_25 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 35, colno = 19, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukLabel"), "govukLabel", context, [{"html": runtime.memberLookup((l_item),"html"),"text": runtime.memberLookup((l_item),"text"),"classes": "govuk-radios__label" + ((runtime.memberLookup((runtime.memberLookup((l_item),"label")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((l_item),"label")),"classes"):"")),"attributes": runtime.memberLookup((runtime.memberLookup((l_item),"label")),"attributes"),"for": runtime.contextOrFrameLookup(context, frame, "itemId")}]))),6), env.opts.autoescape);
t_25 += "\n      ";
if(runtime.contextOrFrameLookup(context, frame, "hasHint")) {
t_25 += "\n      ";
t_25 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 43, colno = 18, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukHint"), "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "itemHintId"),"classes": "govuk-radios__hint" + ((runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"classes")?" " + runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"classes"):"")),"attributes": runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"text")}]))),6), env.opts.autoescape);
t_25 += "\n      ";
;
}
t_25 += "\n    </div>\n    ";
if(runtime.memberLookup((runtime.memberLookup((l_item),"conditional")),"html")) {
t_25 += "\n    <div class=\"govuk-radios__conditional";
if(!runtime.contextOrFrameLookup(context, frame, "isChecked")) {
t_25 += " govuk-radios__conditional--hidden";
;
}
t_25 += "\" id=\"";
t_25 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "conditionalId"), env.opts.autoescape);
t_25 += "\">\n      ";
t_25 += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"conditional")),"html"))), env.opts.autoescape);
t_25 += "\n    </div>\n    ";
;
}
t_25 += "\n  ";
;
}
;
frame = callerFrame;
return new runtime.SafeString(t_25);
});
context.setVariable("_radioItem", macro_t_24);
var t_31;
t_31 = (function() {
var output = "";
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")) {
output += "\n  ";
var t_32;
t_32 = runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-hint";
frame.set("hintId", t_32, true);
if(frame.topLevel) {
context.setVariable("hintId", t_32);
}
if(frame.topLevel) {
context.addExport("hintId", t_32);
}
output += "\n  ";
var t_33;
t_33 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "hintId"):runtime.contextOrFrameLookup(context, frame, "hintId"));
frame.set("describedBy", t_33, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_33);
}
if(frame.topLevel) {
context.addExport("describedBy", t_33);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 65, colno = 14, runtime.callWrap(t_16, "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "hintId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"text")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_34;
t_34 = runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-error";
frame.set("errorId", t_34, true);
if(frame.topLevel) {
context.setVariable("errorId", t_34);
}
if(frame.topLevel) {
context.addExport("errorId", t_34);
}
output += "\n  ";
var t_35;
t_35 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "errorId"):runtime.contextOrFrameLookup(context, frame, "errorId"));
frame.set("describedBy", t_35, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_35);
}
if(frame.topLevel) {
context.addExport("describedBy", t_35);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 76, colno = 22, runtime.callWrap(t_8, "govukErrorMessage", context, [{"id": runtime.contextOrFrameLookup(context, frame, "errorId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"text"),"visuallyHiddenText": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"visuallyHiddenText")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n  <div class=\"govuk-radios";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 86, colno = 23, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += " data-module=\"govuk-radios\">\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")) {
output += "\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"html"))),4):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInputs")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n    ";
frame = frame.push();
var t_38 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_38) {t_38 = runtime.fromIterator(t_38);
var t_37 = t_38.length;
for(var t_36=0; t_36 < t_38.length; t_36++) {
var t_39 = t_38[t_36];
frame.set("item", t_39);
frame.set("loop.index", t_36 + 1);
frame.set("loop.index0", t_36);
frame.set("loop.revindex", t_37 - t_36);
frame.set("loop.revindex0", t_37 - t_36 - 1);
frame.set("loop.first", t_36 === 0);
frame.set("loop.last", t_36 === t_37 - 1);
frame.set("loop.length", t_37);
output += "\n      ";
if(t_39) {
output += runtime.suppressValue((lineno = 92, colno = 22, runtime.callWrap(macro_t_24, "_radioItem", context, [runtime.contextOrFrameLookup(context, frame, "params"),t_39,runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"index")])), env.opts.autoescape);
;
}
output += "\n    ";
;
}
}
frame = frame.pop();
output += "\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")) {
output += "\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"html"))),4):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInputs")),"text")), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n  </div>\n";
;
return output;
})()
;
frame.set("innerHtml", t_31, true);
if(frame.topLevel) {
context.setVariable("innerHtml", t_31);
}
if(frame.topLevel) {
context.addExport("innerHtml", t_31);
}
output += "<div class=\"govuk-form-group";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-form-group--error";
;
}
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 102, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes")])), env.opts.autoescape);
output += ">\n";
if(runtime.contextOrFrameLookup(context, frame, "hasFieldset")) {
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 104, colno = 18, runtime.callWrap(t_12, "govukFieldset", context, [{"describedBy": runtime.contextOrFrameLookup(context, frame, "describedBy"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"attributes"),"legend": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"fieldset")),"legend"),"html": env.getFilter("trim").call(context, runtime.contextOrFrameLookup(context, frame, "innerHtml"))}]))),2), env.opts.autoescape);
output += "\n";
;
}
else {
output += "\n  ";
output += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "innerHtml"))), env.opts.autoescape);
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/select/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/select/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukSelect");
context.setVariable("govukSelect", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/select/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/select/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../error-message/macro.njk", false, "components/select/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukErrorMessage")) {
var t_8 = t_5.govukErrorMessage;
} else {
cb(new Error("cannot import 'govukErrorMessage'")); return;
}
context.setVariable("govukErrorMessage", t_8);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/select/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukHint")) {
var t_12 = t_9.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_12);
output += "\n";
env.getTemplate("../label/macro.njk", false, "components/select/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukLabel")) {
var t_16 = t_13.govukLabel;
} else {
cb(new Error("cannot import 'govukLabel'")); return;
}
context.setVariable("govukLabel", t_16);
var t_17;
t_17 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy"):"");
frame.set("describedBy", t_17, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_17);
}
if(frame.topLevel) {
context.addExport("describedBy", t_17);
}
output += "\n<div class=\"govuk-form-group";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-form-group--error";
;
}
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 9, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 10, colno = 15, runtime.callWrap(t_16, "govukLabel", context, [{"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"text"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"classes"),"isPageHeading": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"isPageHeading"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"attributes"),"for": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")}]))),2), env.opts.autoescape);
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")) {
output += "\n  ";
var t_18;
t_18 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-hint";
frame.set("hintId", t_18, true);
if(frame.topLevel) {
context.setVariable("hintId", t_18);
}
if(frame.topLevel) {
context.addExport("hintId", t_18);
}
output += "\n  ";
var t_19;
t_19 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "hintId"):runtime.contextOrFrameLookup(context, frame, "hintId"));
frame.set("describedBy", t_19, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_19);
}
if(frame.topLevel) {
context.addExport("describedBy", t_19);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 21, colno = 14, runtime.callWrap(t_12, "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "hintId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"text")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_20;
t_20 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-error";
frame.set("errorId", t_20, true);
if(frame.topLevel) {
context.setVariable("errorId", t_20);
}
if(frame.topLevel) {
context.addExport("errorId", t_20);
}
output += "\n  ";
var t_21;
t_21 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "errorId"):runtime.contextOrFrameLookup(context, frame, "errorId"));
frame.set("describedBy", t_21, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_21);
}
if(frame.topLevel) {
context.addExport("describedBy", t_21);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 32, colno = 22, runtime.callWrap(t_8, "govukErrorMessage", context, [{"id": runtime.contextOrFrameLookup(context, frame, "errorId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"text"),"visuallyHiddenText": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"visuallyHiddenText")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")) {
output += "\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html"))),2):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
output += "\n  <select class=\"govuk-select";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-select--error";
;
}
output += "\" id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\" name=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"), env.opts.autoescape);
output += "\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disabled")) {
output += " disabled";
;
}
if(runtime.contextOrFrameLookup(context, frame, "describedBy")) {
output += " aria-describedby=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "describedBy"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 48, colno = 23, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
frame = frame.push();
var t_24 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_24) {t_24 = runtime.fromIterator(t_24);
var t_23 = t_24.length;
for(var t_22=0; t_22 < t_24.length; t_22++) {
var t_25 = t_24[t_22];
frame.set("item", t_25);
frame.set("loop.index", t_22 + 1);
frame.set("loop.index0", t_22);
frame.set("loop.revindex", t_23 - t_22);
frame.set("loop.revindex0", t_23 - t_22 - 1);
frame.set("loop.first", t_22 === 0);
frame.set("loop.last", t_22 === t_23 - 1);
frame.set("loop.length", t_23);
output += "\n    ";
if(t_25) {
var t_26;
t_26 = env.getFilter("default").call(context, runtime.memberLookup((t_25),"value"),runtime.memberLookup((t_25),"text"));
frame.set("effectiveValue", t_26, true);
if(frame.topLevel) {
context.setVariable("effectiveValue", t_26);
}
if(frame.topLevel) {
context.addExport("effectiveValue", t_26);
}
output += "\n    <option";
if(runtime.memberLookup((t_25),"value") !== runtime.contextOrFrameLookup(context, frame, "undefined")) {
output += " value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_25),"value"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((env.getFilter("default").call(context, runtime.memberLookup((t_25),"selected"),(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value")?(runtime.contextOrFrameLookup(context, frame, "effectiveValue") == runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value") && runtime.memberLookup((t_25),"selected") != false):false),true)?" selected":""), env.opts.autoescape);
output += runtime.suppressValue((runtime.memberLookup((t_25),"disabled")?" disabled":""), env.opts.autoescape);
output += runtime.suppressValue((lineno = 56, colno = 25, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_25),"attributes")])), env.opts.autoescape);
output += ">";
output += runtime.suppressValue(runtime.memberLookup((t_25),"text"), env.opts.autoescape);
output += "</option>\n    ";
;
}
output += "\n  ";
;
}
}
frame = frame.pop();
output += "\n  </select>\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")) {
output += "\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html"))),2):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/service-navigation/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/service-navigation/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukServiceNavigation");
context.setVariable("govukServiceNavigation", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/service-navigation/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/service-navigation/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var t_5;
t_5 = env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonText"),"Menu",true);
frame.set("menuButtonText", t_5, true);
if(frame.topLevel) {
context.setVariable("menuButtonText", t_5);
}
if(frame.topLevel) {
context.addExport("menuButtonText", t_5);
}
var t_6;
t_6 = env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigationId"),"navigation",true);
frame.set("navigationId", t_6, true);
if(frame.topLevel) {
context.setVariable("navigationId", t_6);
}
if(frame.topLevel) {
context.addExport("navigationId", t_6);
}
var t_7;
t_7 = (function() {
var output = "";
output += "\nclass=\"govuk-service-navigation";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"\ndata-module=\"govuk-service-navigation\"";
output += runtime.suppressValue((lineno = 8, colno = 19, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += "\n";
;
return output;
})()
;
frame.set("commonAttributes", t_7, true);
if(frame.topLevel) {
context.setVariable("commonAttributes", t_7);
}
if(frame.topLevel) {
context.addExport("commonAttributes", t_7);
}
var t_8;
t_8 = (function() {
var output = "";
output += "\n  <div class=\"govuk-width-container\">\n\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"start")) {
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"start")), env.opts.autoescape);
;
}
output += "<div class=\"govuk-service-navigation__container\">\n      ";
output += "\n      ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName")) {
output += "\n        <span class=\"govuk-service-navigation__service-name\">\n          ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceUrl")) {
output += "\n            <a href=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceUrl"), env.opts.autoescape);
output += "\" class=\"govuk-service-navigation__link\">\n              ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName"), env.opts.autoescape);
output += "\n            </a>\n          ";
;
}
else {
output += "\n            <span class=\"govuk-service-navigation__text\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName"), env.opts.autoescape);
output += "</span>\n          ";
;
}
output += "\n        </span>\n      ";
;
}
output += "\n\n      ";
output += "\n      ";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigation")) || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"navigationStart") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"navigationEnd")) {
output += "\n        <nav aria-label=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigationLabel"),runtime.contextOrFrameLookup(context, frame, "menuButtonText"),true), env.opts.autoescape);
output += "\" class=\"govuk-service-navigation__wrapper";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigationClasses")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigationClasses"), env.opts.autoescape);
;
}
output += "\">\n          <button type=\"button\" class=\"govuk-service-navigation__toggle govuk-js-service-navigation-toggle\" aria-controls=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "navigationId"), env.opts.autoescape);
output += "\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonLabel") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonLabel") != runtime.contextOrFrameLookup(context, frame, "menuButtonText")) {
output += " aria-label=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"menuButtonLabel"), env.opts.autoescape);
output += "\"";
;
}
output += " hidden>\n            ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "menuButtonText"), env.opts.autoescape);
output += "\n          </button>\n\n          <ul class=\"govuk-service-navigation__list\" id=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "navigationId"), env.opts.autoescape);
output += "\" >\n\n            ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"navigationStart")) {
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"navigationStart")), env.opts.autoescape);
;
}
frame = frame.push();
var t_11 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"navigation");
if(t_11) {t_11 = runtime.fromIterator(t_11);
var t_10 = t_11.length;
for(var t_9=0; t_9 < t_11.length; t_9++) {
var t_12 = t_11[t_9];
frame.set("item", t_12);
frame.set("loop.index", t_9 + 1);
frame.set("loop.index0", t_9);
frame.set("loop.revindex", t_10 - t_9);
frame.set("loop.revindex0", t_10 - t_9 - 1);
frame.set("loop.first", t_9 === 0);
frame.set("loop.last", t_9 === t_10 - 1);
frame.set("loop.length", t_10);
output += "\n              ";
var t_13;
t_13 = (function() {
var output = "";
output += "\n                ";
output += "\n                ";
if(runtime.memberLookup((t_12),"active") || runtime.memberLookup((t_12),"current")) {
output += "\n                  <strong class=\"govuk-service-navigation__active-fallback\">";
output += runtime.suppressValue((runtime.memberLookup((t_12),"html")?env.getFilter("safe").call(context, runtime.memberLookup((t_12),"html")):runtime.memberLookup((t_12),"text")), env.opts.autoescape);
output += "</strong>\n                ";
;
}
else {
output += runtime.suppressValue((runtime.memberLookup((t_12),"html")?env.getFilter("safe").call(context, runtime.memberLookup((t_12),"html")):runtime.memberLookup((t_12),"text")), env.opts.autoescape);
;
}
output += "\n              ";
;
return output;
})()
;
frame.set("linkInnerContent", t_13, true);
if(frame.topLevel) {
context.setVariable("linkInnerContent", t_13);
}
if(frame.topLevel) {
context.addExport("linkInnerContent", t_13);
}
output += "\n\n              ";
output += "\n              <li class=\"govuk-service-navigation__item";
if(runtime.memberLookup((t_12),"active") || runtime.memberLookup((t_12),"current")) {
output += " govuk-service-navigation__item--active";
;
}
output += "\">\n                ";
if(runtime.memberLookup((t_12),"href")) {
output += "\n                  <a class=\"govuk-service-navigation__link\" href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_12),"href"), env.opts.autoescape);
output += "\"";
if(runtime.memberLookup((t_12),"active") || runtime.memberLookup((t_12),"current")) {
output += " aria-current=\"";
output += runtime.suppressValue((runtime.memberLookup((t_12),"current")?"page":"true"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 65, colno = 39, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_12),"attributes")])), env.opts.autoescape);
output += ">\n                    ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "linkInnerContent")), env.opts.autoescape);
output += "\n                  </a>\n                ";
;
}
else {
if(runtime.memberLookup((t_12),"html") || runtime.memberLookup((t_12),"text")) {
output += "\n                  <span class=\"govuk-service-navigation__text\"";
if(runtime.memberLookup((t_12),"active") || runtime.memberLookup((t_12),"current")) {
output += " aria-current=\"";
output += runtime.suppressValue((runtime.memberLookup((t_12),"current")?"page":"true"), env.opts.autoescape);
output += "\"";
;
}
output += ">\n                    ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "linkInnerContent")), env.opts.autoescape);
output += "\n                  </span>\n                ";
;
}
;
}
output += "\n              </li>\n            ";
;
}
}
frame = frame.pop();
output += "\n\n            ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"navigationEnd")) {
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"navigationEnd")), env.opts.autoescape);
;
}
output += "</ul>\n        </nav>\n      ";
;
}
output += "\n    </div>\n\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"end")) {
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"end")), env.opts.autoescape);
;
}
output += "</div>\n";
;
return output;
})()
;
frame.set("innerContent", t_8, true);
if(frame.topLevel) {
context.setVariable("innerContent", t_8);
}
if(frame.topLevel) {
context.addExport("innerContent", t_8);
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"serviceName") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"start") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"slots")),"end")) {
output += "\n  <section aria-label=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"ariaLabel"),"Service information"), env.opts.autoescape);
output += "\" ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "commonAttributes")), env.opts.autoescape);
output += ">\n    ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "innerContent")), env.opts.autoescape);
output += "\n  </section>\n";
;
}
else {
output += "\n  <div ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "commonAttributes")), env.opts.autoescape);
output += ">\n    ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "innerContent")), env.opts.autoescape);
output += "\n  </div>\n";
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/skip-link/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/skip-link/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukSkipLink");
context.setVariable("govukSkipLink", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/skip-link/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/skip-link/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<a href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"href"),"#content",true), env.opts.autoescape);
output += "\" class=\"govuk-skip-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += " data-module=\"govuk-skip-link\">";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += "</a>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/summary-list/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/summary-list/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukSummaryList");
context.setVariable("govukSummaryList", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/summary-list/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/summary-list/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var macro_t_5 = runtime.makeMacro(
["action", "cardTitle"], 
[], 
function (l_action, l_cardTitle, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("action", l_action);
frame.set("cardTitle", l_cardTitle);
var t_6 = "";t_6 += "\n  <a class=\"govuk-link";
if(runtime.memberLookup((l_action),"classes")) {
t_6 += " ";
t_6 += runtime.suppressValue(runtime.memberLookup((l_action),"classes"), env.opts.autoescape);
;
}
t_6 += "\" href=\"";
t_6 += runtime.suppressValue(runtime.memberLookup((l_action),"href"), env.opts.autoescape);
t_6 += "\"";
t_6 += runtime.suppressValue((lineno = 4, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_action),"attributes")])), env.opts.autoescape);
t_6 += ">";
t_6 += runtime.suppressValue((runtime.memberLookup((l_action),"html")?env.getFilter("indent").call(context, env.getFilter("safe").call(context, runtime.memberLookup((l_action),"html")),4):runtime.memberLookup((l_action),"text")), env.opts.autoescape);
if(runtime.memberLookup((l_action),"visuallyHiddenText") || l_cardTitle) {
t_6 += "<span class=\"govuk-visually-hidden\">";
if(runtime.memberLookup((l_action),"visuallyHiddenText")) {
t_6 += " ";
t_6 += runtime.suppressValue(runtime.memberLookup((l_action),"visuallyHiddenText"), env.opts.autoescape);
;
}
if(l_cardTitle) {
t_6 += " (";
t_6 += runtime.suppressValue((runtime.memberLookup((l_cardTitle),"html")?env.getFilter("safe").call(context, env.getFilter("indent").call(context, runtime.memberLookup((l_cardTitle),"html"),6)):runtime.memberLookup((l_cardTitle),"text")), env.opts.autoescape);
t_6 += ")";
;
}
t_6 += "</span>";
;
}
t_6 += "</a>\n";
;
frame = callerFrame;
return new runtime.SafeString(t_6);
});
context.setVariable("_actionLink", macro_t_5);
var macro_t_7 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_8 = "";var t_9;
t_9 = (runtime.memberLookup((runtime.memberLookup((l_params),"title")),"headingLevel")?runtime.memberLookup((runtime.memberLookup((l_params),"title")),"headingLevel"):2);
frame.set("headingLevel", t_9, true);
if(frame.topLevel) {
context.setVariable("headingLevel", t_9);
}
if(frame.topLevel) {
context.addExport("headingLevel", t_9);
}
t_8 += "<div class=\"govuk-summary-card";
if(runtime.memberLookup((l_params),"classes")) {
t_8 += " ";
t_8 += runtime.suppressValue(runtime.memberLookup((l_params),"classes"), env.opts.autoescape);
;
}
t_8 += "\"";
t_8 += runtime.suppressValue((lineno = 19, colno = 21, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_params),"attributes")])), env.opts.autoescape);
t_8 += ">\n  <div class=\"govuk-summary-card__title-wrapper\">\n  ";
if(runtime.memberLookup((l_params),"title")) {
t_8 += "\n    <h";
t_8 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "headingLevel"), env.opts.autoescape);
t_8 += " class=\"govuk-summary-card__title";
if(runtime.memberLookup((runtime.memberLookup((l_params),"title")),"classes")) {
t_8 += " ";
t_8 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((l_params),"title")),"classes"), env.opts.autoescape);
;
}
t_8 += "\">\n      ";
t_8 += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((l_params),"title")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_params),"title")),"html"))),6):runtime.memberLookup((runtime.memberLookup((l_params),"title")),"text")), env.opts.autoescape);
t_8 += "\n    </h";
t_8 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "headingLevel"), env.opts.autoescape);
t_8 += ">\n  ";
;
}
t_8 += "\n  ";
if(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"items")),"length")) {
t_8 += "\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"items")),"length") == 1) {
t_8 += "\n    <div class=\"govuk-summary-card__actions";
if(runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"classes")) {
t_8 += " ";
t_8 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"classes"), env.opts.autoescape);
;
}
t_8 += "\">\n      ";
t_8 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 29, colno = 20, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_actionLink"), "_actionLink", context, [runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"items")),0),runtime.memberLookup((l_params),"title")]))),4), env.opts.autoescape);
t_8 += "\n    </div>\n    ";
;
}
else {
t_8 += "\n    <ul class=\"govuk-summary-card__actions";
if(runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"classes")) {
t_8 += " ";
t_8 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"classes"), env.opts.autoescape);
;
}
t_8 += "\">\n      ";
frame = frame.push();
var t_12 = runtime.memberLookup((runtime.memberLookup((l_params),"actions")),"items");
if(t_12) {t_12 = runtime.fromIterator(t_12);
var t_11 = t_12.length;
for(var t_10=0; t_10 < t_12.length; t_10++) {
var t_13 = t_12[t_10];
frame.set("action", t_13);
frame.set("loop.index", t_10 + 1);
frame.set("loop.index0", t_10);
frame.set("loop.revindex", t_11 - t_10);
frame.set("loop.revindex0", t_11 - t_10 - 1);
frame.set("loop.first", t_10 === 0);
frame.set("loop.last", t_10 === t_11 - 1);
frame.set("loop.length", t_11);
t_8 += "\n      <li class=\"govuk-summary-card__action\">\n        ";
t_8 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 35, colno = 22, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_actionLink"), "_actionLink", context, [t_13,runtime.memberLookup((l_params),"title")]))),8), env.opts.autoescape);
t_8 += "\n      </li>\n      ";
;
}
}
frame = frame.pop();
t_8 += "\n    </ul>\n    ";
;
}
t_8 += "\n  ";
;
}
t_8 += "\n  </div>\n\n  <div class=\"govuk-summary-card__content\">\n    ";
t_8 += runtime.suppressValue(env.getFilter("trim").call(context, (lineno = 44, colno = 13, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "caller"), "caller", context, []))), env.opts.autoescape);
t_8 += "\n  </div>\n</div>\n";
;
frame = callerFrame;
return new runtime.SafeString(t_8);
});
context.setVariable("_summaryCard", macro_t_7);
var t_14;
t_14 = false;
frame.set("anyRowHasActions", t_14, true);
if(frame.topLevel) {
context.setVariable("anyRowHasActions", t_14);
}
if(frame.topLevel) {
context.addExport("anyRowHasActions", t_14);
}
output += "\n";
frame = frame.push();
var t_17 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"rows");
if(t_17) {t_17 = runtime.fromIterator(t_17);
var t_16 = t_17.length;
for(var t_15=0; t_15 < t_17.length; t_15++) {
var t_18 = t_17[t_15];
frame.set("row", t_18);
frame.set("loop.index", t_15 + 1);
frame.set("loop.index0", t_15);
frame.set("loop.revindex", t_16 - t_15);
frame.set("loop.revindex0", t_16 - t_15 - 1);
frame.set("loop.first", t_15 === 0);
frame.set("loop.last", t_15 === t_16 - 1);
frame.set("loop.length", t_16);
output += "\n  ";
var t_19;
t_19 = (env.getFilter("length").call(context, runtime.memberLookup((runtime.memberLookup((t_18),"actions")),"items"))?true:runtime.contextOrFrameLookup(context, frame, "anyRowHasActions"));
frame.set("anyRowHasActions", t_19, true);
if(frame.topLevel) {
context.setVariable("anyRowHasActions", t_19);
}
if(frame.topLevel) {
context.addExport("anyRowHasActions", t_19);
}
output += "\n";
;
}
}
frame = frame.pop();
var t_20;
t_20 = (function() {
var output = "";
output += "\n<dl class=\"govuk-summary-list";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 56, colno = 107, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n";
frame = frame.push();
var t_23 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"rows");
if(t_23) {t_23 = runtime.fromIterator(t_23);
var t_22 = t_23.length;
for(var t_21=0; t_21 < t_23.length; t_21++) {
var t_24 = t_23[t_21];
frame.set("row", t_24);
frame.set("loop.index", t_21 + 1);
frame.set("loop.index0", t_21);
frame.set("loop.revindex", t_22 - t_21);
frame.set("loop.revindex0", t_22 - t_21 - 1);
frame.set("loop.first", t_21 === 0);
frame.set("loop.last", t_21 === t_22 - 1);
frame.set("loop.length", t_22);
output += "\n  ";
if(t_24) {
output += "\n  <div class=\"govuk-summary-list__row";
if(runtime.contextOrFrameLookup(context, frame, "anyRowHasActions") && !runtime.memberLookup((runtime.memberLookup((t_24),"actions")),"items")) {
output += " govuk-summary-list__row--no-actions";
;
}
if(runtime.memberLookup((t_24),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((t_24),"classes"), env.opts.autoescape);
;
}
output += "\">\n    <dt class=\"govuk-summary-list__key";
if(runtime.memberLookup((runtime.memberLookup((t_24),"key")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_24),"key")),"classes"), env.opts.autoescape);
;
}
output += "\">\n      ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((t_24),"key")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((t_24),"key")),"html"))),6):runtime.memberLookup((runtime.memberLookup((t_24),"key")),"text")), env.opts.autoescape);
output += "\n    </dt>\n    <dd class=\"govuk-summary-list__value";
if(runtime.memberLookup((runtime.memberLookup((t_24),"value")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_24),"value")),"classes"), env.opts.autoescape);
;
}
output += "\">\n      ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((t_24),"value")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((t_24),"value")),"html"))),6):runtime.memberLookup((runtime.memberLookup((t_24),"value")),"text")), env.opts.autoescape);
output += "\n    </dd>\n    ";
if(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_24),"actions")),"items")),"length")) {
output += "\n    <dd class=\"govuk-summary-list__actions";
if(runtime.memberLookup((runtime.memberLookup((t_24),"actions")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_24),"actions")),"classes"), env.opts.autoescape);
;
}
output += "\">\n      ";
if(runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_24),"actions")),"items")),"length") == 1) {
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 69, colno = 23, runtime.callWrap(macro_t_5, "_actionLink", context, [runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((t_24),"actions")),"items")),0),runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"card")),"title")]))),6,true), env.opts.autoescape);
output += "\n      ";
;
}
else {
output += "\n      <ul class=\"govuk-summary-list__actions-list\">\n        ";
frame = frame.push();
var t_27 = runtime.memberLookup((runtime.memberLookup((t_24),"actions")),"items");
if(t_27) {t_27 = runtime.fromIterator(t_27);
var t_26 = t_27.length;
for(var t_25=0; t_25 < t_27.length; t_25++) {
var t_28 = t_27[t_25];
frame.set("action", t_28);
frame.set("loop.index", t_25 + 1);
frame.set("loop.index0", t_25);
frame.set("loop.revindex", t_26 - t_25);
frame.set("loop.revindex0", t_26 - t_25 - 1);
frame.set("loop.first", t_25 === 0);
frame.set("loop.last", t_25 === t_26 - 1);
frame.set("loop.length", t_26);
output += "\n        <li class=\"govuk-summary-list__actions-list-item\">\n          ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 74, colno = 24, runtime.callWrap(macro_t_5, "_actionLink", context, [t_28,runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"card")),"title")]))),8), env.opts.autoescape);
output += "\n        </li>\n        ";
;
}
}
frame = frame.pop();
output += "\n      </ul>\n      ";
;
}
output += "\n    </dd>\n    ";
;
}
output += "\n  </div>\n  ";
;
}
output += "\n";
;
}
}
frame = frame.pop();
output += "\n</dl>";
;
return output;
})()
;
frame.set("summaryList", t_20, true);
if(frame.topLevel) {
context.setVariable("summaryList", t_20);
}
if(frame.topLevel) {
context.addExport("summaryList", t_20);
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"card")) {
output += runtime.suppressValue((lineno = 88, colno = 22, runtime.callWrap(macro_t_7, "_summaryCard", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"card"),runtime.makeKeywordArgs({"caller": (function (){var macro_t_29 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
var callerFrame = frame;
frame = frame.push(true);
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
var t_30 = "";t_30 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "summaryList"))),4), env.opts.autoescape);
;
frame = frame.pop();
return new runtime.SafeString(t_30);
});
return macro_t_29;})()})])), env.opts.autoescape);
;
}
else {
output += runtime.suppressValue(env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "summaryList"))), env.opts.autoescape);
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/table/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/table/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukTable");
context.setVariable("govukTable", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/table/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/table/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<table class=\"govuk-table";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 4, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"caption")) {
output += "\n  <caption class=\"govuk-table__caption";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"captionClasses")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"captionClasses"), env.opts.autoescape);
;
}
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"caption"), env.opts.autoescape);
output += "</caption>\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"head")) {
output += "\n  <thead class=\"govuk-table__head\">\n    <tr class=\"govuk-table__row\">\n    ";
frame = frame.push();
var t_7 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"head");
if(t_7) {t_7 = runtime.fromIterator(t_7);
var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("item", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n      <th scope=\"col\" class=\"govuk-table__header";
if(runtime.memberLookup((t_8),"format")) {
output += " govuk-table__header--";
output += runtime.suppressValue(runtime.memberLookup((t_8),"format"), env.opts.autoescape);
;
}
if(runtime.memberLookup((t_8),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((t_8),"classes"), env.opts.autoescape);
;
}
output += "\"";
if(runtime.memberLookup((t_8),"colspan")) {
output += " colspan=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"colspan"), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((t_8),"rowspan")) {
output += " rowspan=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"rowspan"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 20, colno = 27, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_8),"attributes")])), env.opts.autoescape);
output += ">";
output += runtime.suppressValue((runtime.memberLookup((t_8),"html")?env.getFilter("safe").call(context, runtime.memberLookup((t_8),"html")):runtime.memberLookup((t_8),"text")), env.opts.autoescape);
output += "</th>\n    ";
;
}
}
frame = frame.pop();
output += "\n    </tr>\n  </thead>\n";
;
}
output += "\n  <tbody class=\"govuk-table__body\">\n";
frame = frame.push();
var t_11 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"rows");
if(t_11) {t_11 = runtime.fromIterator(t_11);
var t_10 = t_11.length;
for(var t_9=0; t_9 < t_11.length; t_9++) {
var t_12 = t_11[t_9];
frame.set("row", t_12);
frame.set("loop.index", t_9 + 1);
frame.set("loop.index0", t_9);
frame.set("loop.revindex", t_10 - t_9);
frame.set("loop.revindex0", t_10 - t_9 - 1);
frame.set("loop.first", t_9 === 0);
frame.set("loop.last", t_9 === t_10 - 1);
frame.set("loop.length", t_10);
output += "\n  ";
if(t_12) {
output += "\n    <tr class=\"govuk-table__row\">\n    ";
frame = frame.push();
var t_15 = t_12;
if(t_15) {t_15 = runtime.fromIterator(t_15);
var t_14 = t_15.length;
for(var t_13=0; t_13 < t_15.length; t_13++) {
var t_16 = t_15[t_13];
frame.set("cell", t_16);
frame.set("loop.index", t_13 + 1);
frame.set("loop.index0", t_13);
frame.set("loop.revindex", t_14 - t_13);
frame.set("loop.revindex0", t_14 - t_13 - 1);
frame.set("loop.first", t_13 === 0);
frame.set("loop.last", t_13 === t_14 - 1);
frame.set("loop.length", t_14);
output += "\n      ";
var t_17;
t_17 = (function() {
var output = "";
if(runtime.memberLookup((t_16),"colspan")) {
output += " colspan=\"";
output += runtime.suppressValue(runtime.memberLookup((t_16),"colspan"), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((t_16),"rowspan")) {
output += " rowspan=\"";
output += runtime.suppressValue(runtime.memberLookup((t_16),"rowspan"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 35, colno = 27, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((t_16),"attributes")])), env.opts.autoescape);
;
return output;
})()
;
frame.set("commonAttributes", t_17, true);
if(frame.topLevel) {
context.setVariable("commonAttributes", t_17);
}
if(frame.topLevel) {
context.addExport("commonAttributes", t_17);
}
output += "\n      ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"first") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"firstCellIsHeader")) {
output += "\n      <th scope=\"row\" class=\"govuk-table__header";
if(runtime.memberLookup((t_16),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((t_16),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "commonAttributes")), env.opts.autoescape);
output += ">";
output += runtime.suppressValue((runtime.memberLookup((t_16),"html")?env.getFilter("safe").call(context, runtime.memberLookup((t_16),"html")):runtime.memberLookup((t_16),"text")), env.opts.autoescape);
output += "</th>\n      ";
;
}
else {
output += "\n      <td class=\"govuk-table__cell";
if(runtime.memberLookup((t_16),"format")) {
output += " govuk-table__cell--";
output += runtime.suppressValue(runtime.memberLookup((t_16),"format"), env.opts.autoescape);
;
}
if(runtime.memberLookup((t_16),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((t_16),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "commonAttributes")), env.opts.autoescape);
output += ">";
output += runtime.suppressValue((runtime.memberLookup((t_16),"html")?env.getFilter("safe").call(context, runtime.memberLookup((t_16),"html")):runtime.memberLookup((t_16),"text")), env.opts.autoescape);
output += "</td>\n      ";
;
}
output += "\n    ";
;
}
}
frame = frame.pop();
output += "\n    </tr>\n  ";
;
}
output += "\n";
;
}
}
frame = frame.pop();
output += "\n  </tbody>\n</table>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/tabs/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/tabs/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukTabs");
context.setVariable("govukTabs", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/tabs/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/tabs/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
var macro_t_5 = runtime.makeMacro(
["params", "item", "index"], 
[], 
function (l_params, l_item, l_index, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
frame.set("item", l_item);
frame.set("index", l_index);
var t_6 = "";t_6 += "\n";
var t_7;
t_7 = (runtime.memberLookup((l_item),"id")?runtime.memberLookup((l_item),"id"):runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-" + l_index);
frame.set("tabPanelId", t_7, true);
if(frame.topLevel) {
context.setVariable("tabPanelId", t_7);
}
if(frame.topLevel) {
context.addExport("tabPanelId", t_7);
}
t_6 += "<li class=\"govuk-tabs__list-item";
if(l_index == 1) {
t_6 += " govuk-tabs__list-item--selected";
;
}
t_6 += "\">\n  <a class=\"govuk-tabs__tab\" href=\"#";
t_6 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "tabPanelId"), env.opts.autoescape);
t_6 += "\"";
t_6 += runtime.suppressValue((lineno = 6, colno = 23, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((l_item),"attributes")])), env.opts.autoescape);
t_6 += ">\n    ";
t_6 += runtime.suppressValue(runtime.memberLookup((l_item),"label"), env.opts.autoescape);
t_6 += "\n  </a>\n</li>\n";
;
frame = callerFrame;
return new runtime.SafeString(t_6);
});
context.setVariable("_tabListItem", macro_t_5);
var macro_t_8 = runtime.makeMacro(
["params", "item", "index"], 
[], 
function (l_params, l_item, l_index, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
frame.set("item", l_item);
frame.set("index", l_index);
var t_9 = "";t_9 += "\n";
var t_10;
t_10 = (runtime.memberLookup((l_item),"id")?runtime.memberLookup((l_item),"id"):runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-" + l_index);
frame.set("tabPanelId", t_10, true);
if(frame.topLevel) {
context.setVariable("tabPanelId", t_10);
}
if(frame.topLevel) {
context.addExport("tabPanelId", t_10);
}
t_9 += "<div class=\"govuk-tabs__panel";
if(l_index > 1) {
t_9 += " govuk-tabs__panel--hidden";
;
}
t_9 += "\" id=\"";
t_9 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "tabPanelId"), env.opts.autoescape);
t_9 += "\"";
t_9 += runtime.suppressValue((lineno = 15, colno = 21, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukAttributes"), "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((l_item),"panel")),"attributes")])), env.opts.autoescape);
t_9 += ">\n";
if(runtime.memberLookup((runtime.memberLookup((l_item),"panel")),"html")) {
t_9 += "\n  ";
t_9 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"panel")),"html"))),2), env.opts.autoescape);
t_9 += "\n";
;
}
else {
if(runtime.memberLookup((runtime.memberLookup((l_item),"panel")),"text")) {
t_9 += "\n  <p class=\"govuk-body\">";
t_9 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((l_item),"panel")),"text"), env.opts.autoescape);
t_9 += "</p>\n";
;
}
;
}
t_9 += "\n</div>\n";
;
frame = callerFrame;
return new runtime.SafeString(t_9);
});
context.setVariable("_tabPanel", macro_t_8);
var t_11;
t_11 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix"):"");
frame.set("idPrefix", t_11, true);
if(frame.topLevel) {
context.setVariable("idPrefix", t_11);
}
if(frame.topLevel) {
context.addExport("idPrefix", t_11);
}
output += "<div";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")) {
output += " id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\"";
;
}
output += " class=\"govuk-tabs";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 29, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += " data-module=\"govuk-tabs\">\n  <h2 class=\"govuk-tabs__title\">\n    ";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"title"),"Contents"), env.opts.autoescape);
output += "\n  </h2>\n";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items"))) {
output += "\n  <ul class=\"govuk-tabs__list\">\n    ";
frame = frame.push();
var t_14 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_14) {t_14 = runtime.fromIterator(t_14);
var t_13 = t_14.length;
for(var t_12=0; t_12 < t_14.length; t_12++) {
var t_15 = t_14[t_12];
frame.set("item", t_15);
frame.set("loop.index", t_12 + 1);
frame.set("loop.index0", t_12);
frame.set("loop.revindex", t_13 - t_12);
frame.set("loop.revindex0", t_13 - t_12 - 1);
frame.set("loop.first", t_12 === 0);
frame.set("loop.last", t_12 === t_13 - 1);
frame.set("loop.length", t_13);
output += "\n      ";
if(t_15) {
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 37, colno = 24, runtime.callWrap(macro_t_5, "_tabListItem", context, [runtime.contextOrFrameLookup(context, frame, "params"),t_15,runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"index")]))),4,true), env.opts.autoescape);
output += "\n      ";
;
}
output += "\n    ";
;
}
}
frame = frame.pop();
output += "\n  </ul>\n  ";
frame = frame.push();
var t_18 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_18) {t_18 = runtime.fromIterator(t_18);
var t_17 = t_18.length;
for(var t_16=0; t_16 < t_18.length; t_16++) {
var t_19 = t_18[t_16];
frame.set("item", t_19);
frame.set("loop.index", t_16 + 1);
frame.set("loop.index0", t_16);
frame.set("loop.revindex", t_17 - t_16);
frame.set("loop.revindex0", t_17 - t_16 - 1);
frame.set("loop.first", t_16 === 0);
frame.set("loop.last", t_16 === t_17 - 1);
frame.set("loop.length", t_17);
output += "\n    ";
if(t_19) {
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 43, colno = 19, runtime.callWrap(macro_t_8, "_tabPanel", context, [runtime.contextOrFrameLookup(context, frame, "params"),t_19,runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"index")]))),2,true), env.opts.autoescape);
output += "\n    ";
;
}
output += "\n  ";
;
}
}
frame = frame.pop();
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/tag/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/tag/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukTag");
context.setVariable("govukTag", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/tag/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/tag/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<strong class=\"govuk-tag";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html"))),2):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += "\n</strong>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/task-list/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/task-list/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukTaskList");
context.setVariable("govukTaskList", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/task-list/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/task-list/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../tag/macro.njk", false, "components/task-list/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukTag")) {
var t_8 = t_5.govukTag;
} else {
cb(new Error("cannot import 'govukTag'")); return;
}
context.setVariable("govukTag", t_8);
var t_9;
t_9 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"idPrefix"):"task-list");
frame.set("idPrefix", t_9, true);
if(frame.topLevel) {
context.setVariable("idPrefix", t_9);
}
if(frame.topLevel) {
context.addExport("idPrefix", t_9);
}
var macro_t_10 = runtime.makeMacro(
["params", "item", "index"], 
[], 
function (l_params, l_item, l_index, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
frame.set("item", l_item);
frame.set("index", l_index);
var t_11 = "";var t_12;
t_12 = runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-" + l_index + "-hint";
frame.set("hintId", t_12, true);
if(frame.topLevel) {
context.setVariable("hintId", t_12);
}
if(frame.topLevel) {
context.addExport("hintId", t_12);
}
var t_13;
t_13 = runtime.contextOrFrameLookup(context, frame, "idPrefix") + "-" + l_index + "-status";
frame.set("statusId", t_13, true);
if(frame.topLevel) {
context.setVariable("statusId", t_13);
}
if(frame.topLevel) {
context.addExport("statusId", t_13);
}
t_11 += "\n  <li class=\"govuk-task-list__item";
if(runtime.memberLookup((l_item),"href")) {
t_11 += " govuk-task-list__item--with-link";
;
}
if(runtime.memberLookup((l_item),"classes")) {
t_11 += " ";
t_11 += runtime.suppressValue(runtime.memberLookup((l_item),"classes"), env.opts.autoescape);
;
}
t_11 += "\">\n    <div class=\"govuk-task-list__name-and-hint\">\n    ";
if(runtime.memberLookup((l_item),"href")) {
t_11 += "\n      <a class=\"govuk-link govuk-task-list__link";
if(runtime.memberLookup((runtime.memberLookup((l_item),"title")),"classes")) {
t_11 += " ";
t_11 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((l_item),"title")),"classes"), env.opts.autoescape);
;
}
t_11 += "\" href=\"";
t_11 += runtime.suppressValue(runtime.memberLookup((l_item),"href"), env.opts.autoescape);
t_11 += "\" aria-describedby=\"";
t_11 += runtime.suppressValue((runtime.memberLookup((l_item),"hint")?runtime.contextOrFrameLookup(context, frame, "hintId") + " ":""), env.opts.autoescape);
t_11 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "statusId"), env.opts.autoescape);
t_11 += "\">\n        ";
t_11 += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((l_item),"title")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"title")),"html"))),8):runtime.memberLookup((runtime.memberLookup((l_item),"title")),"text")), env.opts.autoescape);
t_11 += "\n      </a>\n    ";
;
}
else {
t_11 += "\n      <div";
if(runtime.memberLookup((runtime.memberLookup((l_item),"title")),"classes")) {
t_11 += " class=\"";
t_11 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((l_item),"title")),"classes"), env.opts.autoescape);
t_11 += "\"";
;
}
t_11 += ">\n        ";
t_11 += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((l_item),"title")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"title")),"html"))),8):runtime.memberLookup((runtime.memberLookup((l_item),"title")),"text")), env.opts.autoescape);
t_11 += "\n      </div>\n    ";
;
}
t_11 += "\n    ";
if(runtime.memberLookup((l_item),"hint")) {
t_11 += "\n      <div id=\"";
t_11 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "hintId"), env.opts.autoescape);
t_11 += "\" class=\"govuk-task-list__hint\">\n        ";
t_11 += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"html"))),8):runtime.memberLookup((runtime.memberLookup((l_item),"hint")),"text")), env.opts.autoescape);
t_11 += "\n      </div>\n    ";
;
}
t_11 += "\n    </div>\n    <div class=\"govuk-task-list__status";
if(runtime.memberLookup((runtime.memberLookup((l_item),"status")),"classes")) {
t_11 += " ";
t_11 += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((l_item),"status")),"classes"), env.opts.autoescape);
;
}
t_11 += "\" id=\"";
t_11 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "statusId"), env.opts.autoescape);
t_11 += "\">\n    ";
if(runtime.memberLookup((runtime.memberLookup((l_item),"status")),"tag")) {
t_11 += "\n      ";
t_11 += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 27, colno = 17, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukTag"), "govukTag", context, [runtime.memberLookup((runtime.memberLookup((l_item),"status")),"tag")]))),6), env.opts.autoescape);
t_11 += "\n    ";
;
}
else {
t_11 += "\n      ";
t_11 += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((l_item),"status")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((l_item),"status")),"html"))),6):runtime.memberLookup((runtime.memberLookup((l_item),"status")),"text")), env.opts.autoescape);
t_11 += "\n    ";
;
}
t_11 += "\n    </div>\n  </li>";
;
frame = callerFrame;
return new runtime.SafeString(t_11);
});
context.setVariable("_taskListItem", macro_t_10);
output += "\n\n<ul class=\"govuk-task-list";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 36, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
frame = frame.push();
var t_16 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"items");
if(t_16) {t_16 = runtime.fromIterator(t_16);
var t_15 = t_16.length;
for(var t_14=0; t_14 < t_16.length; t_14++) {
var t_17 = t_16[t_14];
frame.set("item", t_17);
frame.set("loop.index", t_14 + 1);
frame.set("loop.index0", t_14);
frame.set("loop.revindex", t_15 - t_14);
frame.set("loop.revindex0", t_15 - t_14 - 1);
frame.set("loop.first", t_14 === 0);
frame.set("loop.last", t_14 === t_15 - 1);
frame.set("loop.length", t_15);
output += runtime.suppressValue((t_17?(lineno = 38, colno = 21, runtime.callWrap(macro_t_10, "_taskListItem", context, [runtime.contextOrFrameLookup(context, frame, "params"),t_17,runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "loop")),"index")])):""), env.opts.autoescape);
output += "\n  ";
;
}
}
frame = frame.pop();
output += "\n</ul>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/textarea/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/textarea/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukTextarea");
context.setVariable("govukTextarea", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/textarea/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/textarea/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "\n";
env.getTemplate("../error-message/macro.njk", false, "components/textarea/template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukErrorMessage")) {
var t_8 = t_5.govukErrorMessage;
} else {
cb(new Error("cannot import 'govukErrorMessage'")); return;
}
context.setVariable("govukErrorMessage", t_8);
output += "\n";
env.getTemplate("../hint/macro.njk", false, "components/textarea/template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukHint")) {
var t_12 = t_9.govukHint;
} else {
cb(new Error("cannot import 'govukHint'")); return;
}
context.setVariable("govukHint", t_12);
output += "\n";
env.getTemplate("../label/macro.njk", false, "components/textarea/template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukLabel")) {
var t_16 = t_13.govukLabel;
} else {
cb(new Error("cannot import 'govukLabel'")); return;
}
context.setVariable("govukLabel", t_16);
var t_17;
t_17 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"describedBy"):"");
frame.set("describedBy", t_17, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_17);
}
if(frame.topLevel) {
context.addExport("describedBy", t_17);
}
output += "\n<div class=\"govuk-form-group";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-form-group--error";
;
}
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 9, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"attributes")])), env.opts.autoescape);
output += ">\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 10, colno = 15, runtime.callWrap(t_16, "govukLabel", context, [{"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"text"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"classes"),"isPageHeading": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"isPageHeading"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"label")),"attributes"),"for": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id")}]))),2), env.opts.autoescape);
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")) {
output += "\n  ";
var t_18;
t_18 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-hint";
frame.set("hintId", t_18, true);
if(frame.topLevel) {
context.setVariable("hintId", t_18);
}
if(frame.topLevel) {
context.addExport("hintId", t_18);
}
output += "\n  ";
var t_19;
t_19 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "hintId"):runtime.contextOrFrameLookup(context, frame, "hintId"));
frame.set("describedBy", t_19, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_19);
}
if(frame.topLevel) {
context.addExport("describedBy", t_19);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 21, colno = 14, runtime.callWrap(t_12, "govukHint", context, [{"id": runtime.contextOrFrameLookup(context, frame, "hintId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"hint")),"text")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += "\n  ";
var t_20;
t_20 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id") + "-error";
frame.set("errorId", t_20, true);
if(frame.topLevel) {
context.setVariable("errorId", t_20);
}
if(frame.topLevel) {
context.addExport("errorId", t_20);
}
output += "\n  ";
var t_21;
t_21 = (runtime.contextOrFrameLookup(context, frame, "describedBy")?runtime.contextOrFrameLookup(context, frame, "describedBy") + " " + runtime.contextOrFrameLookup(context, frame, "errorId"):runtime.contextOrFrameLookup(context, frame, "errorId"));
frame.set("describedBy", t_21, true);
if(frame.topLevel) {
context.setVariable("describedBy", t_21);
}
if(frame.topLevel) {
context.addExport("describedBy", t_21);
}
output += "\n  ";
output += runtime.suppressValue(env.getFilter("indent").call(context, env.getFilter("trim").call(context, (lineno = 32, colno = 22, runtime.callWrap(t_8, "govukErrorMessage", context, [{"id": runtime.contextOrFrameLookup(context, frame, "errorId"),"classes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"classes"),"attributes": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"attributes"),"html": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"html"),"text": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"text"),"visuallyHiddenText": runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")),"visuallyHiddenText")}]))),2), env.opts.autoescape);
output += "\n";
;
}
output += "\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")) {
output += "\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"html"))),2):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"beforeInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
output += "\n  <textarea class=\"govuk-textarea";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"errorMessage")) {
output += " govuk-textarea--error";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\" id=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"id"), env.opts.autoescape);
output += "\" name=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"name"), env.opts.autoescape);
output += "\" rows=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"rows"),5,true), env.opts.autoescape);
output += "\"";
if((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"spellcheck") === false) || (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"spellcheck") === true)) {
output += " spellcheck=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"spellcheck"), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"disabled")) {
output += " disabled";
;
}
if(runtime.contextOrFrameLookup(context, frame, "describedBy")) {
output += " aria-describedby=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "describedBy"), env.opts.autoescape);
output += "\"";
;
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"autocomplete")) {
output += " autocomplete=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"autocomplete"), env.opts.autoescape);
output += "\"";
;
}
output += runtime.suppressValue((lineno = 49, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"value"), env.opts.autoescape);
output += "</textarea>\n";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")) {
output += "\n  ";
output += runtime.suppressValue((runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html")?env.getFilter("indent").call(context, env.getFilter("trim").call(context, env.getFilter("safe").call(context, runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"html"))),2):runtime.memberLookup((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"formGroup")),"afterInput")),"text")), env.opts.autoescape);
output += "\n";
;
}
output += "\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/warning-text/macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "components/warning-text/macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukWarningText");
context.setVariable("govukWarningText", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["components/warning-text/template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("../../macros/attributes.njk", false, "components/warning-text/template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
output += "<div class=\"govuk-warning-text";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 3, colno = 21, runtime.callWrap(t_4, "govukAttributes", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")])), env.opts.autoescape);
output += ">\n  <span class=\"govuk-warning-text__icon\" aria-hidden=\"true\">!</span>\n  <strong class=\"govuk-warning-text__text\">\n    <span class=\"govuk-visually-hidden\">";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"iconFallbackText"),"Warning",true), env.opts.autoescape);
output += "</span>\n    ";
output += runtime.suppressValue((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text")), env.opts.autoescape);
output += "\n  </strong>\n</div>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["macros/attributes.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "\n";
var macro_t_1 = runtime.makeMacro(
["attributes"], 
[], 
function (l_attributes, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("attributes", l_attributes);
var t_2 = "";var t_3;
t_3 = (env.getTest("string").call(context, l_attributes) === true?l_attributes:"");
frame.set("attributesHtml", t_3, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_3);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_3);
}
if(env.getTest("mapping").call(context, l_attributes) === true) {
t_2 += "\n    ";
frame = frame.push();
var t_6 = l_attributes;
if(t_6) {t_6 = runtime.fromIterator(t_6);
var t_4;
if(runtime.isArray(t_6)) {
var t_5 = t_6.length;
for(t_4=0; t_4 < t_6.length; t_4++) {
var t_7 = t_6[t_4][0];
frame.set("[object Object]", t_6[t_4][0]);
var t_8 = t_6[t_4][1];
frame.set("[object Object]", t_6[t_4][1]);
frame.set("loop.index", t_4 + 1);
frame.set("loop.index0", t_4);
frame.set("loop.revindex", t_5 - t_4);
frame.set("loop.revindex0", t_5 - t_4 - 1);
frame.set("loop.first", t_4 === 0);
frame.set("loop.last", t_4 === t_5 - 1);
frame.set("loop.length", t_5);
if(env.getTest("mapping").call(context, t_8) === true && !(lineno = 72, colno = 63, runtime.callWrap(runtime.memberLookup(([runtime.contextOrFrameLookup(context, frame, "undefined"),null]),"includes"), "--expression--[\"includes\"]", context, [runtime.memberLookup((t_8),"val")])) && runtime.memberLookup((t_8),"length")) {
t_2 += "\n        ";
t_8 = runtime.memberLookup((t_8),"val");
frame.set("value", t_8, true);
if(frame.topLevel) {
context.setVariable("value", t_8);
}
if(frame.topLevel) {
context.addExport("value", t_8);
}
t_2 += "\n      ";
;
}
var t_9;
t_9 = (env.getTest("mapping").call(context, t_8) === true?t_8:{"value": t_8,"optional": false});
frame.set("options", t_9, true);
if(frame.topLevel) {
context.setVariable("options", t_9);
}
if(frame.topLevel) {
context.addExport("options", t_9);
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"optional") === true && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"value") === true) {
t_2 += "\n        ";
var t_10;
t_10 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_7);
frame.set("attributesHtml", t_10, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_10);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_10);
}
;
}
else {
if((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"optional") === true && !(lineno = 86, colno = 82, runtime.callWrap(runtime.memberLookup(([runtime.contextOrFrameLookup(context, frame, "undefined"),null,false]),"includes"), "--expression--[\"includes\"]", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"value")]))) || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"optional") !== true) {
t_2 += "\n        ";
var t_11;
t_11 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_7) + "=\"" + env.getFilter("escape").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"value")) + "\"";
frame.set("attributesHtml", t_11, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_11);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_11);
}
t_2 += "\n      ";
;
}
;
}
t_2 += "\n    ";
;
}
} else {
t_4 = -1;
var t_5 = runtime.keys(t_6).length;
for(var t_12 in t_6) {
t_4++;
var t_13 = t_6[t_12];
frame.set("name", t_12);
frame.set("value", t_13);
frame.set("loop.index", t_4 + 1);
frame.set("loop.index0", t_4);
frame.set("loop.revindex", t_5 - t_4);
frame.set("loop.revindex0", t_5 - t_4 - 1);
frame.set("loop.first", t_4 === 0);
frame.set("loop.last", t_4 === t_5 - 1);
frame.set("loop.length", t_5);
if(env.getTest("mapping").call(context, t_13) === true && !(lineno = 72, colno = 63, runtime.callWrap(runtime.memberLookup(([runtime.contextOrFrameLookup(context, frame, "undefined"),null]),"includes"), "--expression--[\"includes\"]", context, [runtime.memberLookup((t_13),"val")])) && runtime.memberLookup((t_13),"length")) {
t_2 += "\n        ";
t_13 = runtime.memberLookup((t_13),"val");
frame.set("value", t_13, true);
if(frame.topLevel) {
context.setVariable("value", t_13);
}
if(frame.topLevel) {
context.addExport("value", t_13);
}
t_2 += "\n      ";
;
}
var t_14;
t_14 = (env.getTest("mapping").call(context, t_13) === true?t_13:{"value": t_13,"optional": false});
frame.set("options", t_14, true);
if(frame.topLevel) {
context.setVariable("options", t_14);
}
if(frame.topLevel) {
context.addExport("options", t_14);
}
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"optional") === true && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"value") === true) {
t_2 += "\n        ";
var t_15;
t_15 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_12);
frame.set("attributesHtml", t_15, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_15);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_15);
}
;
}
else {
if((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"optional") === true && !(lineno = 86, colno = 82, runtime.callWrap(runtime.memberLookup(([runtime.contextOrFrameLookup(context, frame, "undefined"),null,false]),"includes"), "--expression--[\"includes\"]", context, [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"value")]))) || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"optional") !== true) {
t_2 += "\n        ";
var t_16;
t_16 = runtime.contextOrFrameLookup(context, frame, "attributesHtml") + " " + env.getFilter("escape").call(context, t_12) + "=\"" + env.getFilter("escape").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"value")) + "\"";
frame.set("attributesHtml", t_16, true);
if(frame.topLevel) {
context.setVariable("attributesHtml", t_16);
}
if(frame.topLevel) {
context.addExport("attributesHtml", t_16);
}
t_2 += "\n      ";
;
}
;
}
t_2 += "\n    ";
;
}
}
}
frame = frame.pop();
t_2 += "\n  ";
;
}
t_2 += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "attributesHtml")), env.opts.autoescape);
;
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukAttributes");
context.setVariable("govukAttributes", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["macros/i18n.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "\n";
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";if(runtime.memberLookup((l_params),"messages")) {
frame = frame.push();
var t_5 = runtime.memberLookup((l_params),"messages");
if(t_5) {t_5 = runtime.fromIterator(t_5);
var t_3;
if(runtime.isArray(t_5)) {
var t_4 = t_5.length;
for(t_3=0; t_3 < t_5.length; t_3++) {
var t_6 = t_5[t_3][0];
frame.set("[object Object]", t_5[t_3][0]);
var t_7 = t_5[t_3][1];
frame.set("[object Object]", t_5[t_3][1]);
frame.set("loop.index", t_3 + 1);
frame.set("loop.index0", t_3);
frame.set("loop.revindex", t_4 - t_3);
frame.set("loop.revindex0", t_4 - t_3 - 1);
frame.set("loop.first", t_3 === 0);
frame.set("loop.last", t_3 === t_4 - 1);
frame.set("loop.length", t_4);
t_2 += " data-i18n.";
t_2 += runtime.suppressValue(runtime.memberLookup((l_params),"key"), env.opts.autoescape);
t_2 += ".";
t_2 += runtime.suppressValue(t_6, env.opts.autoescape);
t_2 += "=\"";
t_2 += runtime.suppressValue(env.getFilter("escape").call(context, t_7), env.opts.autoescape);
t_2 += "\"";
;
}
} else {
t_3 = -1;
var t_4 = runtime.keys(t_5).length;
for(var t_8 in t_5) {
t_3++;
var t_9 = t_5[t_8];
frame.set("pluralRule", t_8);
frame.set("message", t_9);
frame.set("loop.index", t_3 + 1);
frame.set("loop.index0", t_3);
frame.set("loop.revindex", t_4 - t_3);
frame.set("loop.revindex0", t_4 - t_3 - 1);
frame.set("loop.first", t_3 === 0);
frame.set("loop.last", t_3 === t_4 - 1);
frame.set("loop.length", t_4);
t_2 += " data-i18n.";
t_2 += runtime.suppressValue(runtime.memberLookup((l_params),"key"), env.opts.autoescape);
t_2 += ".";
t_2 += runtime.suppressValue(t_8, env.opts.autoescape);
t_2 += "=\"";
t_2 += runtime.suppressValue(env.getFilter("escape").call(context, t_9), env.opts.autoescape);
t_2 += "\"";
;
}
}
}
frame = frame.pop();
t_2 += "\n  ";
;
}
else {
if(runtime.memberLookup((l_params),"message")) {
t_2 += " data-i18n.";
t_2 += runtime.suppressValue(runtime.memberLookup((l_params),"key"), env.opts.autoescape);
t_2 += "=\"";
t_2 += runtime.suppressValue(env.getFilter("escape").call(context, runtime.memberLookup((l_params),"message")), env.opts.autoescape);
t_2 += "\"";
;
}
;
}
;
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("govukI18nAttributes");
context.setVariable("govukI18nAttributes", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("./macros/attributes.njk", false, "template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "govukAttributes")) {
var t_4 = t_1.govukAttributes;
} else {
cb(new Error("cannot import 'govukAttributes'")); return;
}
context.setVariable("govukAttributes", t_4);
env.getTemplate("./components/skip-link/macro.njk", false, "template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukSkipLink")) {
var t_8 = t_5.govukSkipLink;
} else {
cb(new Error("cannot import 'govukSkipLink'")); return;
}
context.setVariable("govukSkipLink", t_8);
env.getTemplate("./components/header/macro.njk", false, "template.njk", false, function(t_10,t_9) {
if(t_10) { cb(t_10); return; }
t_9.getExported(function(t_11,t_9) {
if(t_11) { cb(t_11); return; }
if(Object.prototype.hasOwnProperty.call(t_9, "govukHeader")) {
var t_12 = t_9.govukHeader;
} else {
cb(new Error("cannot import 'govukHeader'")); return;
}
context.setVariable("govukHeader", t_12);
env.getTemplate("./components/footer/macro.njk", false, "template.njk", false, function(t_14,t_13) {
if(t_14) { cb(t_14); return; }
t_13.getExported(function(t_15,t_13) {
if(t_15) { cb(t_15); return; }
if(Object.prototype.hasOwnProperty.call(t_13, "govukFooter")) {
var t_16 = t_13.govukFooter;
} else {
cb(new Error("cannot import 'govukFooter'")); return;
}
context.setVariable("govukFooter", t_16);
output += "<!DOCTYPE html>\n<html lang=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "htmlLang"),"en",true), env.opts.autoescape);
output += "\" class=\"govuk-template";
if(runtime.contextOrFrameLookup(context, frame, "htmlClasses")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "htmlClasses"), env.opts.autoescape);
;
}
output += "\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title";
if(runtime.contextOrFrameLookup(context, frame, "pageTitleLang")) {
output += " lang=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "pageTitleLang"), env.opts.autoescape);
output += "\"";
;
}
output += ">";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("pageTitle"))(env, context, frame, runtime, function(t_18,t_17) {
if(t_18) { cb(t_18); return; }
output += t_17;
output += "</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n    <meta name=\"theme-color\" content=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "themeColor"),"#0b0c0c",true), env.opts.autoescape);
output += "\">";
output += "\n\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("headIcons"))(env, context, frame, runtime, function(t_20,t_19) {
if(t_20) { cb(t_20); return; }
output += t_19;
output += "\n\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("head"))(env, context, frame, runtime, function(t_22,t_21) {
if(t_22) { cb(t_22); return; }
output += t_21;
output += "\n    ";
if(runtime.contextOrFrameLookup(context, frame, "opengraphImageUrl") || runtime.contextOrFrameLookup(context, frame, "assetUrl")) {
output += "\n    <meta property=\"og:image\" content=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "opengraphImageUrl"),runtime.contextOrFrameLookup(context, frame, "assetUrl") + "/images/govuk-opengraph-image.png",true), env.opts.autoescape);
output += "\">\n    ";
;
}
output += "\n  </head>\n  <body class=\"govuk-template__body";
if(runtime.contextOrFrameLookup(context, frame, "bodyClasses")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "bodyClasses"), env.opts.autoescape);
;
}
output += "\"";
output += runtime.suppressValue((lineno = 27, colno = 107, runtime.callWrap(t_4, "govukAttributes", context, [runtime.contextOrFrameLookup(context, frame, "bodyAttributes")])), env.opts.autoescape);
output += ">\n    <script";
if(runtime.contextOrFrameLookup(context, frame, "cspNonce")) {
output += " nonce=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "cspNonce"), env.opts.autoescape);
output += "\"";
;
}
output += ">document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');</script>\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("bodyStart"))(env, context, frame, runtime, function(t_24,t_23) {
if(t_24) { cb(t_24); return; }
output += t_23;
output += "\n\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("skipLink"))(env, context, frame, runtime, function(t_26,t_25) {
if(t_26) { cb(t_26); return; }
output += t_25;
output += "\n\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("header"))(env, context, frame, runtime, function(t_28,t_27) {
if(t_28) { cb(t_28); return; }
output += t_27;
output += "\n\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("main"))(env, context, frame, runtime, function(t_30,t_29) {
if(t_30) { cb(t_30); return; }
output += t_29;
output += "\n\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("footer"))(env, context, frame, runtime, function(t_32,t_31) {
if(t_32) { cb(t_32); return; }
output += t_31;
output += "\n\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("bodyEnd"))(env, context, frame, runtime, function(t_34,t_33) {
if(t_34) { cb(t_34); return; }
output += t_33;
output += "\n  </body>\n</html>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})})})})})})})})})})})})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_pageTitle(env, context, frame, runtime, cb) {
var lineno = 8;
var colno = 76;
var output = "";
try {
var frame = frame.push(true);
output += "GOV.UK - The best place to find government services and information";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_headIcons(env, context, frame, runtime, cb) {
var lineno = 12;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
output += "\n      <link rel=\"icon\" sizes=\"48x48\" href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "assetPath"),"/assets",true), env.opts.autoescape);
output += "/images/favicon.ico\">\n      <link rel=\"icon\" sizes=\"any\" href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "assetPath"),"/assets",true), env.opts.autoescape);
output += "/images/favicon.svg\" type=\"image/svg+xml\">\n      <link rel=\"mask-icon\" href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "assetPath"),"/assets",true), env.opts.autoescape);
output += "/images/govuk-icon-mask.svg\" color=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "themeColor"),"#0b0c0c"), env.opts.autoescape);
output += "\">";
output += "\n      <link rel=\"apple-touch-icon\" href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "assetPath"),"/assets",true), env.opts.autoescape);
output += "/images/govuk-icon-180.png\">\n      <link rel=\"manifest\" href=\"";
output += runtime.suppressValue(env.getFilter("default").call(context, runtime.contextOrFrameLookup(context, frame, "assetPath"),"/assets",true), env.opts.autoescape);
output += "/manifest.json\">\n    ";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_head(env, context, frame, runtime, cb) {
var lineno = 20;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_bodyStart(env, context, frame, runtime, cb) {
var lineno = 29;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_skipLink(env, context, frame, runtime, cb) {
var lineno = 31;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
output += "\n      ";
output += runtime.suppressValue((lineno = 32, colno = 22, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukSkipLink"), "govukSkipLink", context, [{"href": "#main-content","text": "Skip to main content"}])), env.opts.autoescape);
output += "\n    ";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_header(env, context, frame, runtime, cb) {
var lineno = 38;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
output += "\n      ";
output += runtime.suppressValue((lineno = 39, colno = 20, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukHeader"), "govukHeader", context, [{}])), env.opts.autoescape);
output += "\n    ";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_main(env, context, frame, runtime, cb) {
var lineno = 42;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
output += "\n      <div class=\"govuk-width-container";
if(runtime.contextOrFrameLookup(context, frame, "containerClasses")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "containerClasses"), env.opts.autoescape);
;
}
output += "\">\n        ";
context.getBlock("beforeContent")(env, context, frame, runtime, function(t_36,t_35) {
if(t_36) { cb(t_36); return; }
output += t_35;
output += "\n        <main class=\"govuk-main-wrapper";
if(runtime.contextOrFrameLookup(context, frame, "mainClasses")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "mainClasses"), env.opts.autoescape);
;
}
output += "\" id=\"main-content\"";
if(runtime.contextOrFrameLookup(context, frame, "mainLang")) {
output += " lang=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "mainLang"), env.opts.autoescape);
output += "\"";
;
}
output += ">\n          ";
context.getBlock("content")(env, context, frame, runtime, function(t_38,t_37) {
if(t_38) { cb(t_38); return; }
output += t_37;
output += "\n        </main>\n      </div>\n    ";
cb(null, output);
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_beforeContent(env, context, frame, runtime, cb) {
var lineno = 44;
var colno = 11;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 46;
var colno = 13;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_footer(env, context, frame, runtime, cb) {
var lineno = 51;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
output += "\n      ";
output += runtime.suppressValue((lineno = 52, colno = 20, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "govukFooter"), "govukFooter", context, [{}])), env.opts.autoescape);
output += "\n    ";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_bodyEnd(env, context, frame, runtime, cb) {
var lineno = 55;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_pageTitle: b_pageTitle,
b_headIcons: b_headIcons,
b_head: b_head,
b_bodyStart: b_bodyStart,
b_skipLink: b_skipLink,
b_header: b_header,
b_main: b_main,
b_beforeContent: b_beforeContent,
b_content: b_content,
b_footer: b_footer,
b_bodyEnd: b_bodyEnd,
root: root
};

})();
})();
