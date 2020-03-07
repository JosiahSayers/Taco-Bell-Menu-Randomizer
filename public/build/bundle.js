var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(n)}function l(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const i="undefined"!=typeof window;let s=i?()=>window.performance.now():()=>Date.now(),u=i?t=>requestAnimationFrame(t):t;const a=new Set;function f(t){a.forEach(e=>{e.c(t)||(a.delete(e),e.f())}),0!==a.size&&u(f)}function d(t){let e;return 0===a.size&&u(f),{promise:new Promise(n=>{a.add(e={c:t,f:n})}),abort(){a.delete(e)}}}function m(t,e){t.appendChild(e)}function h(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function y(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function v(){return $(" ")}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t,e){e=""+e,t.data!==e&&(t.data=e)}let k,w,_=0,j={};function C(t,e,n,o,r,l,c,i=0){const s=16.666/o;let u="{\n";for(let t=0;t<=1;t+=s){const o=e+(n-e)*l(t);u+=100*t+`%{${c(o,1-o)}}\n`}const a=u+`100% {${c(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(a)}_${i}`;if(!j[f]){if(!k){const t=y("style");document.head.appendChild(t),k=t.sheet}j[f]=!0,k.insertRule(`@keyframes ${f} ${a}`,k.cssRules.length)}const d=t.style.animation||"";return t.style.animation=`${d?`${d}, `:""}${f} ${o}ms linear ${r}ms 1 both`,_+=1,f}function E(t,e){t.style.animation=(t.style.animation||"").split(", ").filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")).join(", "),e&&!--_&&u(()=>{if(_)return;let t=k.cssRules.length;for(;t--;)k.deleteRule(t);j={}})}function A(t){w=t}function I(){if(!w)throw new Error("Function called outside component initialization");return w}const S=[],R=[],M=[],N=[],O=Promise.resolve();let P=!1;function z(t){M.push(t)}let L=!1;const q=new Set;function F(){if(!L){L=!0;do{for(let t=0;t<S.length;t+=1){const e=S[t];A(e),T(e.$$)}for(S.length=0;R.length;)R.pop()();for(let t=0;t<M.length;t+=1){const e=M[t];q.has(e)||(q.add(e),e())}M.length=0}while(S.length);for(;N.length;)N.pop()();P=!1,L=!1,q.clear()}}function T(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}let B;function D(){return B||(B=Promise.resolve(),B.then(()=>{B=null})),B}function G(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const H=new Set;let U;function J(){U={r:0,c:[],p:U}}function K(){U.r||r(U.c),U=U.p}function Q(t,e){t&&t.i&&(H.delete(t),t.i(e))}function V(t,e,n,o){if(t&&t.o){if(H.has(t))return;H.add(t),U.c.push(()=>{H.delete(t),o&&(n&&t.d(1),o())}),t.o(e)}}const W={duration:0};function X(n,o,r){let c,i,u=o(n,r),a=!1,f=0;function m(){c&&E(n,c)}function h(){const{delay:o=0,duration:r=300,easing:l=e,tick:h=t,css:p}=u||W;p&&(c=C(n,0,1,r,o,l,p,f++)),h(0,1);const g=s()+o,y=g+r;i&&i.abort(),a=!0,z(()=>G(n,!0,"start")),i=d(t=>{if(a){if(t>=y)return h(1,0),G(n,!0,"end"),m(),a=!1;if(t>=g){const e=l((t-g)/r);h(e,1-e)}}return a})}let p=!1;return{start(){p||(E(n),l(u)?(u=u(),D().then(h)):h())},invalidate(){p=!1},end(){a&&(m(),a=!1)}}}function Y(n,o,c){let i,u=o(n,c),a=!0;const f=U;function m(){const{delay:o=0,duration:l=300,easing:c=e,tick:m=t,css:h}=u||W;h&&(i=C(n,1,0,l,o,c,h));const p=s()+o,g=p+l;z(()=>G(n,!1,"start")),d(t=>{if(a){if(t>=g)return m(0,1),G(n,!1,"end"),--f.r||r(f.c),!1;if(t>=p){const e=c((t-p)/l);m(1-e,e)}}return a})}return f.r+=1,l(u)?D().then(()=>{u=u(),m()}):m(),{end(t){t&&u.tick&&u.tick(1,0),a&&(i&&E(n,i),a=!1)}}}function Z(t,e){const n=e.token={};function o(t,o,r,l){if(e.token!==n)return;e.resolved=l;let c=e.ctx;void 0!==r&&(c=c.slice(),c[r]=l);const i=t&&(e.current=t)(c);let s=!1;e.block&&(e.blocks?e.blocks.forEach((t,n)=>{n!==o&&t&&(J(),V(t,1,1,()=>{e.blocks[n]=null}),K())}):e.block.d(1),i.c(),Q(i,1),i.m(e.mount(),e.anchor),s=!0),e.block=i,e.blocks&&(e.blocks[o]=i),s&&F()}if((r=t)&&"object"==typeof r&&"function"==typeof r.then){const n=I();if(t.then(t=>{A(n),o(e.then,1,e.value,t),A(null)},t=>{A(n),o(e.catch,2,e.error,t),A(null)}),e.current!==e.pending)return o(e.pending,0),!0}else{if(e.current!==e.then)return o(e.then,1,e.value,t),!0;e.resolved=t}var r}function tt(t,e,o){const{fragment:c,on_mount:i,on_destroy:s,after_update:u}=t.$$;c&&c.m(e,o),z(()=>{const e=i.map(n).filter(l);s?s.push(...e):r(e),t.$$.on_mount=[]}),u.forEach(z)}function et(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function nt(t,e){-1===t.$$.dirty[0]&&(S.push(t),P||(P=!0,O.then(F)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ot(e,n,l,c,i,s,u=[-1]){const a=w;A(e);const f=n.props||{},d=e.$$={fragment:null,ctx:null,props:s,update:t,not_equal:i,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:o(),dirty:u};let m=!1;d.ctx=l?l(e,f,(t,n,...o)=>{const r=o.length?o[0]:n;return d.ctx&&i(d.ctx[t],d.ctx[t]=r)&&(d.bound[t]&&d.bound[t](r),m&&nt(e,t)),n}):[],d.update(),m=!0,r(d.before_update),d.fragment=!!c&&c(d.ctx),n.target&&(n.hydrate?d.fragment&&d.fragment.l(function(t){return Array.from(t.childNodes)}(n.target)):d.fragment&&d.fragment.c(),n.intro&&Q(e.$$.fragment),tt(e,n.target,n.anchor),F()),A(a)}class rt{$destroy(){et(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function lt(t,e,n){const o=t.slice();return o[1]=e[n],o}function ct(t,e,n){const o=t.slice();return o[4]=e[n],o}function it(t,e,n){const o=t.slice();return o[7]=e[n],o}function st(t,e,n){const o=t.slice();return o[10]=e[n],o}function ut(t){let e,n,o=t[10]+"";return{c(){e=y("li"),n=$(o),b(e,"class","kept svelte-9x6jye")},m(t,o){h(t,e,o),m(e,n)},p(t,e){1&e&&o!==(o=t[10]+"")&&x(n,o)},d(t){t&&p(e)}}}function at(t){let e,n,o=t[7]+"";return{c(){e=y("li"),n=$(o),b(e,"class","removed svelte-9x6jye")},m(t,o){h(t,e,o),m(e,n)},p(t,e){1&e&&o!==(o=t[7]+"")&&x(n,o)},d(t){t&&p(e)}}}function ft(t){let e,n,o=t[4]+"";return{c(){e=y("li"),n=$(o),b(e,"class","svelte-9x6jye")},m(t,o){h(t,e,o),m(e,n)},p(t,e){1&e&&o!==(o=t[4]+"")&&x(n,o)},d(t){t&&p(e)}}}function dt(t){let e,n,o=t[1]+"";return{c(){e=y("li"),n=$(o),b(e,"class","svelte-9x6jye")},m(t,o){h(t,e,o),m(e,n)},p(t,e){1&e&&o!==(o=t[1]+"")&&x(n,o)},d(t){t&&p(e)}}}function mt(e){let n,o,r,l,c,i,s,u,a,f,d,k,w,_,j,C,E,A,I,S,R=e[0].title+"",M=ht(e[0].category)+"",N=e[0].includedItems,O=[];for(let t=0;t<N.length;t+=1)O[t]=ut(st(e,N,t));let P=e[0].removedItems,z=[];for(let t=0;t<P.length;t+=1)z[t]=at(it(e,P,t));let L=e[0].addons,q=[];for(let t=0;t<L.length;t+=1)q[t]=ft(ct(e,L,t));let F=e[0].sauces,T=[];for(let t=0;t<F.length;t+=1)T[t]=dt(lt(e,F,t));return{c(){n=y("div"),o=y("h1"),r=$(R),l=v(),c=y("h2"),i=$("Menu Category: "),s=$(M),u=v(),a=y("h3"),a.textContent="Item Ingredients",f=v(),d=y("ul");for(let t=0;t<O.length;t+=1)O[t].c();k=v();for(let t=0;t<z.length;t+=1)z[t].c();w=v(),_=y("h3"),_.textContent="Addons",j=v(),C=y("ul");for(let t=0;t<q.length;t+=1)q[t].c();E=v(),A=y("h3"),A.textContent="Sauces",I=v(),S=y("ul");for(let t=0;t<T.length;t+=1)T[t].c();b(o,"class","svelte-9x6jye"),b(c,"class","svelte-9x6jye"),b(d,"id","default-items"),b(d,"class","svelte-9x6jye"),b(C,"id","addons"),b(C,"class","svelte-9x6jye"),b(S,"id","sauces"),b(S,"class","svelte-9x6jye"),b(n,"class","svelte-9x6jye")},m(t,e){h(t,n,e),m(n,o),m(o,r),m(n,l),m(n,c),m(c,i),m(c,s),m(n,u),m(n,a),m(n,f),m(n,d);for(let t=0;t<O.length;t+=1)O[t].m(d,null);m(d,k);for(let t=0;t<z.length;t+=1)z[t].m(d,null);m(n,w),m(n,_),m(n,j),m(n,C);for(let t=0;t<q.length;t+=1)q[t].m(C,null);m(n,E),m(n,A),m(n,I),m(n,S);for(let t=0;t<T.length;t+=1)T[t].m(S,null)},p(t,[e]){if(1&e&&R!==(R=t[0].title+"")&&x(r,R),1&e&&M!==(M=ht(t[0].category)+"")&&x(s,M),1&e){let n;for(N=t[0].includedItems,n=0;n<N.length;n+=1){const o=st(t,N,n);O[n]?O[n].p(o,e):(O[n]=ut(o),O[n].c(),O[n].m(d,k))}for(;n<O.length;n+=1)O[n].d(1);O.length=N.length}if(1&e){let n;for(P=t[0].removedItems,n=0;n<P.length;n+=1){const o=it(t,P,n);z[n]?z[n].p(o,e):(z[n]=at(o),z[n].c(),z[n].m(d,null))}for(;n<z.length;n+=1)z[n].d(1);z.length=P.length}if(1&e){let n;for(L=t[0].addons,n=0;n<L.length;n+=1){const o=ct(t,L,n);q[n]?q[n].p(o,e):(q[n]=ft(o),q[n].c(),q[n].m(C,null))}for(;n<q.length;n+=1)q[n].d(1);q.length=L.length}if(1&e){let n;for(F=t[0].sauces,n=0;n<F.length;n+=1){const o=lt(t,F,n);T[n]?T[n].p(o,e):(T[n]=dt(o),T[n].c(),T[n].m(S,null))}for(;n<T.length;n+=1)T[n].d(1);T.length=F.length}},i:t,o:t,d(t){t&&p(n),g(O,t),g(z,t),g(q,t),g(T,t)}}}function ht(t){const e=t.split(/\s|-/),n=[];return e.forEach(t=>n.push(t[0].toUpperCase()+t.substring(1))),n.join(" ")}function pt(t,e,n){let{item:o}=e;return t.$set=t=>{"item"in t&&n(0,o=t.item)},[o]}class gt extends rt{constructor(t){super(),ot(this,t,pt,mt,c,{item:0})}}function yt(t){const e=t-1;return e*e*e+1}function $t(t,{delay:n=0,duration:o=400,easing:r=e}){const l=+getComputedStyle(t).opacity;return{delay:n,duration:o,easing:r,css:t=>`opacity: ${t*l}`}}function vt(t,{delay:e=0,duration:n=400,easing:o=yt,x:r=0,y:l=0,opacity:c=0}){const i=getComputedStyle(t),s=+i.opacity,u="none"===i.transform?"":i.transform,a=s*(1-c);return{delay:e,duration:n,easing:o,css:(t,e)=>`\n\t\t\ttransform: ${u} translate(${(1-t)*r}px, ${(1-t)*l}px);\n\t\t\topacity: ${s-a*e}`}}function bt(e){let n;return{c(){n=y("p"),n.textContent="An error occurd while grabbing this item. Please try again!"},m(t,e){h(t,n,e)},p:t,i:t,o:t,d(t){t&&p(n)}}}function xt(t){let e,n,o=t[2]&&kt(t);return{c(){o&&o.c(),e=$("")},m(t,r){o&&o.m(t,r),h(t,e,r),n=!0},p(t,n){t[2]?o?(o.p(t,n),Q(o,1)):(o=kt(t),o.c(),Q(o,1),o.m(e.parentNode,e)):o&&(J(),V(o,1,1,()=>{o=null}),K())},i(t){n||(Q(o),n=!0)},o(t){V(o),n=!1},d(t){o&&o.d(t),t&&p(e)}}}function kt(t){let e,n,o,r;const l=new gt({props:{item:t[2]}});return{c(){var t;e=y("div"),(t=l.$$.fragment)&&t.c(),b(e,"class","item-container svelte-16lotfb")},m(t,n){h(t,e,n),tt(l,e,null),r=!0},p(t,e){const n={};1&e&&(n.item=t[2]),l.$set(n)},i(t){r||(Q(l.$$.fragment,t),z(()=>{o&&o.end(1),n||(n=X(e,vt,{x:500})),n.start()}),r=!0)},o(t){V(l.$$.fragment,t),n&&n.invalidate(),o=Y(e,vt,{x:-300}),r=!1},d(t){t&&p(e),et(l),t&&o&&o.end()}}}function wt(e){let n,o,r,l;return{c(){n=y("div"),n.innerHTML='<img src="images/taco.png" class="spin svelte-16lotfb" alt="taco">',b(n,"class","image-container svelte-16lotfb")},m(t,e){h(t,n,e),l=!0},p:t,i(t){l||(z(()=>{r&&r.end(1),o||(o=X(n,$t,{})),o.start()}),l=!0)},o(t){o&&o.invalidate(),r=Y(n,$t,{}),l=!1},d(t){t&&p(n),t&&r&&r.end()}}}function _t(t){let e,n,o,r,l,c,i={ctx:t,current:null,token:null,pending:wt,then:xt,catch:bt,value:2,error:3,blocks:[,,,]};return Z(n=t[0],i),{c(){e=y("div"),i.block.c(),o=v(),r=y("button"),r.textContent="Generate Random Menu Item",b(r,"id","random-single-button"),b(r,"class","svelte-16lotfb"),b(e,"class","overlay svelte-16lotfb")},m(n,s){var u,a,f,d;h(n,e,s),i.block.m(e,i.anchor=null),i.mount=()=>e,i.anchor=o,m(e,o),m(e,r),l=!0,u=r,a="click",f=t[1],u.addEventListener(a,f,d),c=()=>u.removeEventListener(a,f,d)},p(e,[o]){if(t=e,i.ctx=t,1&o&&n!==(n=t[0])&&Z(n,i));else{const e=t.slice();e[2]=i.resolved,i.block.p(e,o)}},i(t){l||(Q(i.block),l=!0)},o(t){for(let t=0;t<3;t+=1){V(i.blocks[t])}l=!1},d(t){t&&p(e),i.block.d(),i.token=null,i=null,c()}}}function jt(t,e,n){let o;return[o,function(){n(0,o=async function(){const t=await fetch("/random/single"),e=await t.json();if(t.ok)return e;throw new Error}())}]}return new class extends rt{constructor(t){super(),ot(this,t,jt,_t,c,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
