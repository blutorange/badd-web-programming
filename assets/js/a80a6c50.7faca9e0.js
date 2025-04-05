(self.webpackChunkpackages_lecture=self.webpackChunkpackages_lecture||[]).push([[3743],{409:(e,s,t)=>{"use strict";t.r(s),t.d(s,{assets:()=>a,contentTitle:()=>c,default:()=>m,frontMatter:()=>i,metadata:()=>n,toc:()=>h});const n=JSON.parse('{"id":"web-programming/css/css-top-layer","title":"Abschnitt 5 - Top-Layer","description":"Inhalt \xfcber allem anderen im Top-Layer darstellen, wie Fullscreen.","source":"@site/docs/web-programming/css/top-layer.mdx","sourceDirName":"web-programming/css","slug":"/css/top-layer","permalink":"/badd-web-programming/docs/css/top-layer","draft":false,"unlisted":false,"editUrl":"https://github.com/blutorange/badd-web-programming/tree/main/packages/lecture/docs/web-programming/css/top-layer.mdx","tags":[],"version":"current","sidebarPosition":5,"frontMatter":{"id":"css-top-layer","slug":"/css/top-layer","sidebar_position":5,"description":"Inhalt \xfcber allem anderen im Top-Layer darstellen, wie Fullscreen."},"sidebar":"tutorialSidebar","previous":{"title":"Abschnitt 4 - At-Rules","permalink":"/badd-web-programming/docs/css/at-rules"},"next":{"title":"Kapitel 3 - JavaScript","permalink":"/badd-web-programming/docs/javascript"}}');var o=t(1085),r=t(1184),l=t(1161);const i={id:"css-top-layer",slug:"/css/top-layer",sidebar_position:5,description:"Inhalt \xfcber allem anderen im Top-Layer darstellen, wie Fullscreen."},c="Abschnitt 5 - Top-Layer",a={},h=[];function d(e){const s={a:"a",code:"code",h1:"h1",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(s.header,{children:(0,o.jsx)(s.h1,{id:"abschnitt-5---top-layer",children:"Abschnitt 5 - Top-Layer"})}),"\n",(0,o.jsxs)(s.p,{children:["Das Layout von HTML und CSS funktioniert so, dass geschachtelte Elemente immer\nan das Layout ihrer Eltern gebunden sind. Selbst mit ",(0,o.jsx)(s.code,{children:"position: fixed"})," und ",(0,o.jsx)(s.code,{children:"z-index"}),"\nk\xf6nnen wir dem nichts ganz entkommen."]}),"\n",(0,o.jsxs)(s.p,{children:["In dem folgenden Beispiel haben wir eine rote Box auf ",(0,o.jsx)(s.code,{children:"position: flex"})," mit\n",(0,o.jsx)(s.code,{children:"z-index"})," ",(0,o.jsx)(s.a,{href:"https://en.wikipedia.org/wiki/It%27s_Over_9000!",children:"\xfcber 9000"}),", die\nvon der gelben Box mit nur ",(0,o.jsx)(s.code,{children:"z-index: 10"})," verdeckt wird:"]}),"\n",(0,o.jsx)(l.A,{path:"css-stacking-context-issue",type:"css",toggleable:!0}),"\n",(0,o.jsxs)(s.p,{children:["Das liegt daran, dass der Container der roten Box auch auf ",(0,o.jsx)(s.code,{children:"position: fixed"}),"\ngesetzt ist und der Container hinter der gelben Box liegt."]}),"\n",(0,o.jsxs)(s.p,{children:["Durch ",(0,o.jsx)(s.code,{children:"position: fixed"})," wird ein sogenannter\n",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context",children:"Stacking-Context"}),"\nerzeugt. Den Stacking-Context k\xf6nnen wir uns als Einheit vorstellen, die inklusive\naller Kinderelemente vor oder anderen Elementen platziert wird. Die rote Box kann\ninnerhalb des Stacking-Context des Containers per z-index vor und andere Elemente\nin dem Container geschoben werden. Aber wenn der Container hinter einem anderen\nElement liegt, wird auch die rote Box immer hinter diesem Element liegen."]}),"\n",(0,o.jsx)(s.p,{children:"Auf echten Webseiten mit viel Inhalt k\xf6nnen dieses und andere Positionierungsprobleme\nnoch noch eher auftreten."}),"\n",(0,o.jsxs)(s.p,{children:["Als L\xf6sung daf\xfcr wurde der sogenannte ",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Glossary/Top_layer",children:"Top-Layer"}),"\nentwickelt. Der Top-Layer ist unabh\xe4ngig vom Rest des Layouts der Webseite und\nimmer \xfcberhalb anderer Elemente. Befindet sich ein Element im Top-Layer, wird\ndieses \xfcber allen anderen Elementen angezeigt. Das interessante dabei ist,\ndass ein Element dabei seine urspr\xfcngliche Position im DOM nicht verliert --\nes ist nur dem Top-Layer zugeordnet. Dadurch werden alle CSS-Regeln entsprechend\nder DOM-Struktur noch angewandt."]}),"\n",(0,o.jsx)(s.p,{children:"Aktuell gibt es 3 wesentliche Anwendungsf\xe4lle f\xfcr den Top-Layer:"}),"\n",(0,o.jsxs)(s.ul,{children:["\n",(0,o.jsxs)(s.li,{children:["Der ",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen",children:"Fullscreen-Modus"}),".\nPer JavaScript kann ein Element in den Vollbildmodus geschaltet werden. Das\nwird etwa von Videoplatformen verwenden, um das Video im Vollbild anzuzeigen."]}),"\n",(0,o.jsxs)(s.li,{children:["Das ",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog",children:"HTML-Dialog-Element"}),".\nWird es als modaler Dialog angezeigt, befindet es sich im Top-Layer und\n\xfcberdeckt alle anderen Elemente."]}),"\n",(0,o.jsxs)(s.li,{children:["Das ",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover",children:"HTML-Popover-Attribut"}),"\nund die dazugeh\xf6rige ",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Popover_API",children:"Popover-API"}),".\nEin Popover ist etwa ein Tooltip oder ein anderes kleines Element, welches\nauf einer Webseite aufploppt und beispielsweise zus\xe4tzliche Informationen,\nAktionen oder Links bietet."]}),"\n"]}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.strong,{children:"Fullscreen"})}),"\n",(0,o.jsxs)(s.p,{children:["Der Vollbildmodus f\xfcr ein HTML-Element kann mittels der JavaScript-Methode\n",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen",children:"requestFullscreen"}),"\ngestartet werden. Hier ein Beispiel daf\xfcr:"]}),"\n",(0,o.jsx)(l.A,{path:"fullscreen",type:"css",toggleable:!0}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.strong,{children:"Dialog"})}),"\n",(0,o.jsxs)(s.p,{children:["Ein ",(0,o.jsx)(s.code,{children:"<dialog>"}),"-Element k\xf6nnen wir mittels der JavaScript-Funktion\n",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal",children:"showModal"}),"\nim Top-Layer anzeigen. Hier nochmal unser Dialog-Beispiel aus dem vorigen\nAbschnitt mit einem nativen Dialog-Element:"]}),"\n",(0,o.jsx)(l.A,{path:"native-dialog",type:"css",toggleable:!0}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.strong,{children:"Popover"})}),"\n",(0,o.jsxs)(s.p,{children:["Wenn an einem Element ",(0,o.jsx)(s.code,{children:"<div popover>"})," gesetzt ist, k\xf6nnen wir das Element mittels\nder JavaScript-Methode ",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/showPopover",children:"showPopover"}),"\nin den Top-Layer versetzen. Alternativ k\xf6nnen wir auch das HTML-Attribut\n",(0,o.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#popovertarget",children:"popovertarget"}),"\nnutzen, um ein Popover ohne JavaScript zu \xf6ffnen:"]}),"\n",(0,o.jsx)(l.A,{path:"popover",type:"html",toggleable:!0})]})}function m(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,o.jsx)(s,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},1161:(e,s,t)=>{"use strict";t.d(s,{A:()=>a});const n={htmlSnippetContainer:"htmlSnippetContainer_ma1m",htmlSnippet:"htmlSnippet_M4nq",summary:"summary_FjyZ",headerButton:"headerButton_T1af",trySandbox:"trySandbox_oIiv",execute:"execute_QX0B",codeBlock:"codeBlock_FbZp"};var o=t(8927),r=t(6279),l=t(4041),i=t(5750),c=t(1085);function a(e){return e.toggleable?(0,c.jsx)(d,{...e}):(0,c.jsx)(h,{...e})}function h(e){return(0,c.jsx)("div",{className:`${n.htmlSnippet} ${n.htmlSnippetContainer}`,children:(0,c.jsx)(m,{...e})})}function d(e){return(0,c.jsxs)("details",{className:n.htmlSnippetContainer,children:[(0,c.jsx)("summary",{className:n.summary,children:e.path}),(0,c.jsx)("div",{className:n.htmlSnippet,children:(0,c.jsx)(m,{...e,title:""})})]})}function m(e){const[s,t]=(0,l.useState)({loading:!0});return(0,l.useEffect)((()=>{s.loading&&async function(e,s,t){const n=await(0,i.C_)(s,t);e({loading:!1,value:n})}(t,e.type??"html",e.path)}),[s.loading,e.type,e.path]),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r.A,{to:`/sandbox?snippet=${encodeURIComponent(e.path)}`,className:`${n.trySandbox} ${n.headerButton}`,target:"_blank",rel:"noopener noreferrer",children:"In Sandbox \xf6ffnen"}),(0,c.jsx)(o.A,{className:n.codeBlock,title:e.title??e.path,showLineNumbers:!0,language:e.type??"html",children:s.loading?"loading...":s.value})]})}},5750:(e,s,t)=>{"use strict";t.d(s,{pt:()=>j,PR:()=>f,bi:()=>w,F_:()=>x,z$:()=>b,C_:()=>v,aF:()=>u,po:()=>y,vs:()=>g});var n=t(7300),o=t(4041),r=t(8294);const l={supply:()=>new Set,incorporate:(e,s)=>(e.add(s),e),finish:e=>e};function*i(e){if(null===e||"object"!=typeof e)return;let s=Object.getPrototypeOf(e);for(;s;)yield s,s=Object.getPrototypeOf(s)}function*c(e,s){for(const t of e)yield s(t)}function a(e){return"object"==typeof e&&null!==e?e.constructor?.name??"":""}function h(e){return function(e,s){const t=s.supply();for(const n of e)s.incorporate(t,n);return s.finish(t)}(c(i(e),a),l)}const d="\nhtml {\n  color: black;\n}\n",m="\nhtml {\n  color: white;\n}\na {\n  color: #9898ff;\n}\n";function p(e){return{loading:!1,value:e}}function u(e,s,t,n){const o=(new DOMParser).parseFromString(e,"text/html");{const e=document.createElement("style");e.textContent="dark"===n?m:d,o.head.appendChild(e)}if(s.length>0){const e=document.createElement("style");e.textContent=s,o.head.appendChild(e)}if(t.length>0){const e=document.createElement("script");e.textContent=`document.addEventListener("readystatechange", function(){if(document.readyState!=="complete")return;\n${t}\n;})`,o.body.appendChild(e)}return o.documentElement.outerHTML}const j={deserialize:e=>"true"===e,serialize:e=>e?"true":"false"},f={deserialize:e=>{const s=Number.parseInt(e);return Number.isNaN(s)?0:s},serialize:e=>e.toString(10)};function g(e,s,t){const n=t.serialize(s),[o,l]=(0,r.A)(e,n);return[t.deserialize(o),e=>l(t.serialize(e))]}function y(e,s,t){const n=function(e,s){const t=e.searchParams.get("snippet");if(null==t||0===t.length)return;return t.endsWith(`.${s}`)?t:`${t}.${s}`}(new URL(window.location.href),s),l=n?`${e}_${n}`:e,[i,c]=(0,o.useState)({loading:!0}),[a,h]=(0,r.A)(l,t);return(0,o.useEffect)((()=>{i.loading?n?v(s,n).then((e=>c(p(e)))):c(p(a)):n||c(p(a))}),[a,s,n,i.loading]),[i,e=>{n||h(e),c(p(e))},()=>{n||h(t),c({loading:!0})}]}function b(e,s,t){let o;try{o=(0,n.Uz)(e,{sourceMaps:"inline",filename:"file.ts"}).code}catch(r){return console.error("Unable to transpile JavaScript",r),[]}return x(o,s,t)}function x(e,s,t){const n=console.debug,o=console.log,r=console.info,l=console.error,h=console.warn;let d=[];try{document.querySelector(`iframe[data-eval-id=${CSS.escape(s)}]`)?.remove();const u=document.createElement("iframe");u.dataset.evalId=s,u.style.display="none",document.body.append(u);const j=u.contentWindow,f=u.contentDocument;let g=!0;if(null===j||null===f)return[];const y=e=>{g?d.push(e):(d=[...d,e],t?.(d))};j.console.debug=console.info=function(){for(var e=arguments.length,s=new Array(e),t=0;t<e;t++)s[t]=arguments[t];y(z("console-debug",s)),n.apply(console,s)},j.console.log=console.info=function(){for(var e=arguments.length,s=new Array(e),t=0;t<e;t++)s[t]=arguments[t];y(z("console-log",s)),o.apply(console,s)},j.console.info=console.info=function(){for(var e=arguments.length,s=new Array(e),t=0;t<e;t++)s[t]=arguments[t];y(z("console-log",s)),r.apply(console,s)},j.console.warn=function(){for(var e=arguments.length,s=new Array(e),t=0;t<e;t++)s[t]=arguments[t];y(z("console-warn",s)),h.apply(console,s)},j.console.error=function(){for(var e=arguments.length,s=new Array(e),t=0;t<e;t++)s[t]=arguments[t];y(z("console-error",s)),l.apply(console,s)},j.addEventListener("error",(e=>{y(A(e.error)),l.call(console,e.error)})),j.addEventListener("unhandledrejection",(e=>{y(A(e.reason)),l.call(console,e.reason)}));const b=j.eval.apply(null,[e]);(m=b)instanceof Promise||function(e,s){for(const t of e)if(s(t))return!0;return!1}(c(i(m),a),(p="Promise",e=>e===p))?b.then((e=>void 0!==e?y(E(e)):void 0),(e=>y(A(e)))):void 0!==b&&y(E(b)),g=!1}catch(u){l.apply(console,[u]),d.push(A(u))}var m,p;return d}async function v(e,s){const n=s.endsWith(`.${e}`)?s:`${s}.${e}`;try{return(await t(9999)(`./${e}/${n}`)).default}catch(o){return""}}function w(e,s){const t=e.console.log,n=e.console.debug,o=e.console.info,r=e.console.warn,l=e.console.error;e.console.log=function(){for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];t.apply(e.console,o),s(z("console-log",o))},e.console.info=function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];o.apply(e.console,n),s(z("console-log",n))},e.console.debug=function(){for(var t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];n.apply(e.console,o),s(z("console-debug",o))},e.console.warn=function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];r.apply(e.console,n),s(z("console-warn",n))},e.console.error=function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];l.apply(e.console,n),s(z("console-error",n))}}function k(e){return e instanceof Error?e.stack??e.message:String(e)}function S(e){switch(typeof e){case"undefined":case"boolean":case"number":case"bigint":case"string":return String(e);case"symbol":return"symbol";case"function":return e.toString();case"object":{if(null===e)return"null";const s=new Set,t=(e,t)=>{if(void 0===t)return"undefined";if("function"==typeof t)return t.toString();if(t instanceof Error)return k(t);if("object"==typeof t&&null!==t){if(s.has(t))return"circular";const e=h(t);return e.has("Window")||e.has("Document")||e.has("Promise")?String(t):e.has("Node")?function(e){const s=[];if(e instanceof Element&&e.attributes.length>0){s.push("");const t=e.attributes;for(let e=0;e<t.length;e+=1){const n=t.item(e);s.push(`${n?.nodeName}=${n?.nodeValue}`)}}return`<${e.nodeName}${s.join(" ")} />`}(t):Object.keys(t).length>30?String(t):(s.add(t),t)}return t};return JSON.stringify(e,t,2)}}}function z(e,s){return{type:e,value:s.map((e=>S(e))).join("\t")}}function E(e){return{type:"result",value:S(e)}}function A(e){return{type:"error",value:k(e)}}},9999:(e,s,t)=>{var n={"./css/aside.css":[822,822],"./css/box-model.css":[5205,5205],"./css/box-sizing.css":[7758,7758],"./css/css-before-after.css":[6190,6190],"./css/css-blocks.css":[6940,6940],"./css/css-conflict.css":[8232,8232],"./css/css-container-query.css":[5714,5714],"./css/css-custom-properties.css":[8445,8445],"./css/css-display-flex.css":[9676,9676],"./css/css-display-grid-page.css":[5421,5421],"./css/css-display-grid.css":[1473,1473],"./css/css-display-none-select.css":[3786,3786],"./css/css-display-various.css":[6778,6778],"./css/css-font-face-icons.css":[582,582],"./css/css-import.css":[6393,6393],"./css/css-inheritance-override.css":[4019,4019],"./css/css-inheritance.css":[5156,5156],"./css/css-inline.css":[2889,2889],"./css/css-layer.css":[5719,5719],"./css/css-nth-child.css":[9099,1480],"./css/css-overflow.css":[6864,6864],"./css/css-position-absolute-popover.css":[3705,3705],"./css/css-position-fixed-dialog.css":[5753,5753],"./css/css-position-sticky.css":[7699,7699],"./css/css-properties-basic.css":[8716,8716],"./css/css-pseudo-class-hover.css":[1274,1274],"./css/css-pseudo-elements.css":[6872,6872],"./css/css-scope.css":[5240,5240],"./css/css-sizes.css":[566,566],"./css/css-stacking-context-issue.css":[3486,3486],"./css/css-transform.css":[180,180],"./css/css-transition.css":[5959,5959],"./css/css-transparency.css":[4668,4668],"./css/css-z-index.css":[1269,1269],"./css/div-span.css":[2130,2130],"./css/figure.css":[7276,7276],"./css/form-textarea.css":[5619,5619],"./css/fullscreen.css":[559,559],"./css/header-main-footer.css":[1737,1737],"./css/native-dialog.css":[5308,5308],"./css/nav.css":[93,93],"./css/node-hierarchy.css":[5722,5722],"./css/picture.css":[8476,8476],"./css/popover.css":[565,565],"./css/section-hx.css":[5258,5258],"./css/stop-propagation.css":[5049,5049],"./css/table.css":[38,38],"./css/text-content-vs-inner-html.css":[7962,7962],"./css/text-markers.css":[1191,1191],"./css/url-encoding.css":[1291,1291],"./css/video-audio.css":[6577,8958],"./css/worker.css":[7334,7334],"./html/a.html":[4549,4549],"./html/aside.html":[3446,3446],"./html/basic.html":[4792,4792],"./html/box-model.html":[1471,1471],"./html/box-sizing.html":[6622,6622],"./html/cors.html":[5229,5229],"./html/css-before-after.html":[9262,9262],"./html/css-blocks.html":[8236,8236],"./html/css-conflict.html":[3992,3992],"./html/css-container-query.html":[9794,9794],"./html/css-custom-properties.html":[4679,4679],"./html/css-display-flex.html":[2108,2108],"./html/css-display-grid-page.html":[2583,2583],"./html/css-display-grid.html":[1163,1163],"./html/css-display-none-select.html":[5898,5898],"./html/css-display-various.html":[5706,5706],"./html/css-font-face-icons.html":[518,518],"./html/css-import.html":[6323,6323],"./html/css-inheritance-override.html":[7874,5493],"./html/css-inheritance.html":[8052,8052],"./html/css-inline.html":[2323,2323],"./html/css-layer.html":[3673,3673],"./html/css-nth-child.html":[1757,1757],"./html/css-overflow.html":[9952,9952],"./html/css-position-absolute-popover.html":[6883,6883],"./html/css-position-fixed-dialog.html":[4147,4147],"./html/css-position-sticky.html":[7237,7237],"./html/css-properties-basic.html":[252,252],"./html/css-pseudo-class-hover.html":[7690,7690],"./html/css-pseudo-elements.html":[2920,2920],"./html/css-scope.html":[4600,4600],"./html/css-sizes.html":[7974,7974],"./html/css-stacking-context-issue.html":[5278,5278],"./html/css-transform.html":[9636,9636],"./html/css-transition.html":[3033,3033],"./html/css-transparency.html":[4428,4428],"./html/css-z-index.html":[6991,6991],"./html/details-summary.html":[9657,9657],"./html/div-span.html":[2498,2498],"./html/element-properties.html":[386,386],"./html/elements-by-count.html":[8545,8545],"./html/event-listener.html":[8303,8303],"./html/fetch-response.html":[5952,5952],"./html/figure.html":[2492,2492],"./html/form-buttons.html":[3142,3142],"./html/form-fieldset.html":[751,751],"./html/form-input-checkbox.html":[6153,6153],"./html/form-input-file.html":[9314,9314],"./html/form-input-hidden.html":[8572,8572],"./html/form-input-password.html":[9025,9025],"./html/form-input.html":[7111,7111],"./html/form-label.html":[7805,7805],"./html/form-prevent-submit.html":[8326,5945],"./html/form-select-checkbox-radio.html":[9387,9387],"./html/form-select.html":[5243,5243],"./html/form-simple.html":[3653,3653],"./html/form-textarea.html":[8341,8341],"./html/fullscreen.html":[753,753],"./html/h1-span.html":[8452,8452],"./html/header-main-footer.html":[9507,9507],"./html/html-escape.html":[6545,6545],"./html/html-multi-lang.html":[742,742],"./html/img-srcset.html":[8776,8776],"./html/img.html":[4349,4349],"./html/lists.html":[9563,9563],"./html/native-dialog.html":[7692,7692],"./html/nav.html":[8167,8167],"./html/node-hierarchy.html":[7034,4653],"./html/password-toggle.html":[9698,9698],"./html/picture.html":[2556,2556],"./html/popover.html":[3132,3132],"./html/section-hx.html":[6298,6298],"./html/stop-propagation.html":[4291,4291],"./html/table.html":[2086,2086],"./html/tag-omission.html":[5134,5134],"./html/text-content-vs-inner-html.html":[9546,9546],"./html/text-markers.html":[2633,2633],"./html/url-encoding.html":[1709,1709],"./html/video-audio.html":[9006,9006],"./html/whitespace.html":[817,817],"./html/worker.html":[198,198],"./js/array-index-access":[7105,7105],"./js/array-index-access.js":[7105,7105],"./js/async-fn-basic":[5772,5772],"./js/async-fn-basic.js":[5772,5772],"./js/auto-semicolon-insertion":[299,299],"./js/auto-semicolon-insertion.js":[299,299],"./js/box-sizing":[946,946],"./js/box-sizing.js":[946,946],"./js/classes-basic":[7409,7409],"./js/classes-basic.js":[7409,7409],"./js/classes-this-context":[85,85],"./js/classes-this-context.js":[85,85],"./js/control-for-each":[2943,2943],"./js/control-for-each.js":[2943,2943],"./js/control-for-manual":[6808,6808],"./js/control-for-manual.js":[6808,6808],"./js/control-if":[4963,4963],"./js/control-if.js":[4963,4963],"./js/control-switch":[8932,8932],"./js/control-switch.js":[8932,8932],"./js/control-try-catch":[5645,5645],"./js/control-try-catch.js":[5645,5645],"./js/control-try-finally":[889,889],"./js/control-try-finally.js":[889,889],"./js/cors":[1921,1921],"./js/cors.js":[1921,1921],"./js/css-container-query":[8206,8206],"./js/css-container-query.js":[8206,8206],"./js/css-display-none-select":[358,358],"./js/css-display-none-select.js":[358,358],"./js/css-position-fixed-dialog":[8963,8963],"./js/css-position-fixed-dialog.js":[8963,8963],"./js/css-z-index":[3544,3544],"./js/css-z-index.js":[3544,3544],"./js/date-now":[3837,3837],"./js/date-now.js":[3837,3837],"./js/destruct-array":[9166,9166],"./js/destruct-array.js":[9166,9166],"./js/destruct-object":[3668,3668],"./js/destruct-object.js":[3668,3668],"./js/double-equal":[9740,9740],"./js/double-equal.js":[9740,9740],"./js/elements-by-count":[8617,8617],"./js/elements-by-count.js":[8617,8617],"./js/event-loop-order":[1448,1448],"./js/event-loop-order.js":[1448,1448],"./js/factorial-functional":[7503,7503],"./js/factorial-functional.js":[7503,7503],"./js/factorial-imperative":[4780,4780],"./js/factorial-imperative.js":[4780,4780],"./js/factorial-object":[9353,9353],"./js/factorial-object.js":[9353,9353],"./js/fetch-post":[2113,2113],"./js/fetch-post.js":[2113,2113],"./js/fetch-response":[6528,6528],"./js/fetch-response.js":[6528,6528],"./js/fetch-simple":[7889,7889],"./js/fetch-simple.js":[7889,7889],"./js/form-buttons":[6342,6342],"./js/form-buttons.js":[6342,6342],"./js/fullscreen":[1881,1881],"./js/fullscreen.js":[1881,1881],"./js/function-arrow":[6200,6200],"./js/function-arrow.js":[6200,6200],"./js/function-statement":[7916,7916],"./js/function-statement.js":[7916,7916],"./js/function-this":[6833,6833],"./js/function-this.js":[6833,6833],"./js/generator-fn-basic":[1692,9311],"./js/generator-fn-basic.js":[1692,9311],"./js/generator-fn-infinite":[4881,4881],"./js/generator-fn-infinite.js":[4881,4881],"./js/iterator":[9126,9126],"./js/iterator.js":[9126,9126],"./js/json-parse":[7292,7292],"./js/json-parse.js":[7292,7292],"./js/json-stringify":[658,658],"./js/json-stringify.js":[658,658],"./js/map":[3564,3564],"./js/map.js":[3564,3564],"./js/method-chain":[6557,6557],"./js/method-chain.js":[6557,6557],"./js/native-dialog":[972,972],"./js/native-dialog.js":[972,972],"./js/node-hierarchy":[2818,2818],"./js/node-hierarchy.js":[2818,2818],"./js/null-error":[474,474],"./js/null-error.js":[474,474],"./js/nullish-coalescing":[6526,6526],"./js/nullish-coalescing.js":[6526,6526],"./js/object-property-special-chars":[3755,3755],"./js/object-property-special-chars.js":[3755,3755],"./js/optional-chaining":[2638,2638],"./js/optional-chaining-fn":[6251,6251],"./js/optional-chaining-fn.js":[6251,6251],"./js/optional-chaining.js":[2638,2638],"./js/password-toggle":[5906,5906],"./js/password-toggle.js":[5906,5906],"./js/promise-chain":[1015,1015],"./js/promise-chain-async-await":[8041,8041],"./js/promise-chain-async-await.js":[8041,8041],"./js/promise-chain.js":[1015,1015],"./js/promise-timeout":[2881,2881],"./js/promise-timeout.js":[2881,2881],"./js/regexp-capture-group":[2636,2636],"./js/regexp-capture-group-named":[5520,5520],"./js/regexp-capture-group-named.js":[5520,5520],"./js/regexp-capture-group.js":[2636,2636],"./js/regexp-test":[6038,6038],"./js/regexp-test.js":[6038,6038],"./js/set":[6094,6094],"./js/set.js":[6094,6094],"./js/simple-statement":[2270,2270],"./js/simple-statement.js":[2270,2270],"./js/spread-array":[1027,1027],"./js/spread-array.js":[1027,1027],"./js/spread-object":[275,275],"./js/spread-object.js":[275,275],"./js/stop-propagation":[739,739],"./js/stop-propagation.js":[739,739],"./js/text-content-vs-inner-html":[7202,7202],"./js/text-content-vs-inner-html.js":[7202,7202],"./js/this-context-set":[8515,8515],"./js/this-context-set.js":[8515,8515],"./js/triple-equal":[2689,2689],"./js/triple-equal.js":[2689,2689],"./js/ts-with-doc-comment-types":[6117,6117],"./js/ts-with-doc-comment-types.js":[6117,6117],"./js/typeof":[9213,9213],"./js/typeof.js":[9213,9213],"./js/undefined-not-function":[1480,9099],"./js/undefined-not-function.js":[1480,9099],"./js/url":[8431,8431],"./js/url-encoding":[3921,3921],"./js/url-encoding.js":[3921,3921],"./js/url.js":[8431,8431],"./js/var-scope":[4178,4178],"./js/var-scope.js":[4178,4178],"./js/worker":[2630,2630],"./js/worker.js":[2630,2630],"./ts/append-to-list":[7277,7277],"./ts/append-to-list.ts":[7277,7277],"./ts/string-constant-union":[2284,2284],"./ts/string-constant-union.ts":[2284,2284],"./ts/union-type":[8990,8990],"./ts/union-type.ts":[8990,8990],"./ts/unsound-opt-prop":[708,708],"./ts/unsound-opt-prop.ts":[708,708]};function o(e){if(!t.o(n,e))return Promise.resolve().then((()=>{var s=new Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}));var s=n[e],o=s[0];return t.e(s[1]).then((()=>t(o)))}o.keys=()=>Object.keys(n),o.id=9999,e.exports=o}}]);