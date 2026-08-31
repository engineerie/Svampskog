const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CrmhTS-U.js","./Cg0OhUZv.js","./9T6YONd9.js","./7sANiKVT.js","./CiBI_nO0.js","./DQS-DgH0.js","./Cpj98o6Y.js","./CPJaI1G0.js","./entry.Cte5XDI5.css","./Bj1LfWpk.js"])))=>i.map(i=>d[i]);
import{ah as Pn,ai as Tn,k as V,aj as so,B as lo,W as at,K as Mn,ak as Gt,al as Ao,j as Te,am as Fo,an as Ko,i as gt,ao as An,N as co,C as Fn,T as Go,c as G,q as Lt,ap as Gn,aq as Cn,ar as Dn,m as ee,b as Z,as as yt,d as uo,g as K,e as Qo,at as ho,aa as In,au as Bn,a7 as be,av as Le,aw as _t,y as Jo,s as Q,ag as fo,ax as Rn,v as en,x as On,ay as Hn,az as Wn,aA as kt,z as Kt,a9 as ke,aB as tn,aC as on,aD as Un,M as tt,U as Vn,a as Xn,aE as Ct,o as Yn,n as jn,p as Zn}from"./DQS-DgH0.js";import{p as ve}from"./CgL7NFbW.js";import{s as qn,p as mt}from"./CiP_ZzTK.js";import{a as Kn}from"./j6HGkDVd.js";import{r as Qn,P as Jn,e as Co}from"./z7MCSWeV.js";import{b as xt,Z as ea,bd as ta,o as oa,a6 as na,c as aa,a5 as Do,d as ia,e as ra,Q as sa,r as la}from"./CPJaI1G0.js";import{g as ca}from"./CRwZWlcU.js";function ua(e,t,o){var n=new Pn,r=t;return n._restart=n.restart,n.restart=function(a,s,i){s=+s,i=i==null?Tn():+i,n._restart(function l(c){c+=r,n._restart(l,r+=s,i),a(c)},s,i)},n.restart(e,t,o),n}var da=1e-12;function Io(e){return((e=Math.exp(e))+1/e)/2}function ha(e){return((e=Math.exp(e))-1/e)/2}function fa(e){return((e=Math.exp(2*e))-1)/(e+1)}const pa=(function e(t,o,n){function r(a,s){var i=a[0],l=a[1],c=a[2],p=s[0],d=s[1],b=s[2],N=p-i,x=d-l,T=N*N+x*x,v,f;if(T<da)f=Math.log(b/c)/t,v=function(F){return[i+F*N,l+F*x,c*Math.exp(t*F*f)]};else{var E=Math.sqrt(T),m=(b*b-c*c+n*T)/(2*c*o*E),h=(b*b-c*c-n*T)/(2*b*o*E),w=Math.log(Math.sqrt(m*m+1)-m),L=Math.log(Math.sqrt(h*h+1)-h);f=(L-w)/t,v=function(F){var A=F*f,_=Io(w),I=c/(o*E)*(_*fa(t*A+w)-ha(w));return[i+I*N,l+I*x,c*_/Io(t*A+w)]}}return v.duration=f*1e3*t/Math.SQRT2,v}return r.rho=function(a){var s=Math.max(.001,+a),i=s*s,l=i*i;return e(s,i,l)},r})(Math.SQRT2,2,4),ga={passive:!1},st={capture:!0,passive:!1};function Dt(e){e.stopImmediatePropagation()}function We(e){e.preventDefault(),e.stopImmediatePropagation()}function po(e){var t=e.document.documentElement,o=V(e).on("dragstart.drag",We,st);"onselectstart"in t?o.on("selectstart.drag",We,st):(t.__noselect=t.style.MozUserSelect,t.style.MozUserSelect="none")}function go(e,t){var o=e.document.documentElement,n=V(e).on("dragstart.drag",null);t&&(n.on("click.drag",We,st),setTimeout(function(){n.on("click.drag",null)},0)),"onselectstart"in o?n.on("selectstart.drag",null):(o.style.MozUserSelect=o.__noselect,delete o.__noselect)}const ht=e=>()=>e;function Qt(e,{sourceEvent:t,subject:o,target:n,identifier:r,active:a,x:s,y:i,dx:l,dy:c,dispatch:p}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:t,enumerable:!0,configurable:!0},subject:{value:o,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},identifier:{value:r,enumerable:!0,configurable:!0},active:{value:a,enumerable:!0,configurable:!0},x:{value:s,enumerable:!0,configurable:!0},y:{value:i,enumerable:!0,configurable:!0},dx:{value:l,enumerable:!0,configurable:!0},dy:{value:c,enumerable:!0,configurable:!0},_:{value:p}})}Qt.prototype.on=function(){var e=this._.on.apply(this._,arguments);return e===this._?this:e};function ma(e){return!e.ctrlKey&&!e.button}function va(){return this.parentNode}function ba(e,t){return t??{x:e.x,y:e.y}}function ya(){return navigator.maxTouchPoints||"ontouchstart"in this}function _a(){var e=ma,t=va,o=ba,n=ya,r={},a=so("start","drag","end"),s=0,i,l,c,p,d=0;function b(h){h.on("mousedown.drag",N).filter(n).on("touchstart.drag",v).on("touchmove.drag",f,ga).on("touchend.drag touchcancel.drag",E).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function N(h,w){if(!(p||!e.call(this,h,w))){var L=m(this,t.call(this,h,w),h,w,"mouse");L&&(V(h.view).on("mousemove.drag",x,st).on("mouseup.drag",T,st),po(h.view),Dt(h),c=!1,i=h.clientX,l=h.clientY,L("start",h))}}function x(h){if(We(h),!c){var w=h.clientX-i,L=h.clientY-l;c=w*w+L*L>d}r.mouse("drag",h)}function T(h){V(h.view).on("mousemove.drag mouseup.drag",null),go(h.view,c),We(h),r.mouse("end",h)}function v(h,w){if(e.call(this,h,w)){var L=h.changedTouches,F=t.call(this,h,w),A=L.length,_,I;for(_=0;_<A;++_)(I=m(this,F,h,w,L[_].identifier,L[_]))&&(Dt(h),I("start",h,L[_]))}}function f(h){var w=h.changedTouches,L=w.length,F,A;for(F=0;F<L;++F)(A=r[w[F].identifier])&&(We(h),A("drag",h,w[F]))}function E(h){var w=h.changedTouches,L=w.length,F,A;for(p&&clearTimeout(p),p=setTimeout(function(){p=null},500),F=0;F<L;++F)(A=r[w[F].identifier])&&(Dt(h),A("end",h,w[F]))}function m(h,w,L,F,A,_){var I=a.copy(),B=ve(_||L,w),O,H,u;if((u=o.call(h,new Qt("beforestart",{sourceEvent:L,target:b,identifier:A,active:s,x:B[0],y:B[1],dx:0,dy:0,dispatch:I}),F))!=null)return O=u.x-B[0]||0,H=u.y-B[1]||0,function y(g,S,P){var z=B,k;switch(g){case"start":r[A]=y,k=s++;break;case"end":delete r[A],--s;case"drag":B=ve(P||S,w),k=s;break}I.call(g,h,new Qt(g,{sourceEvent:S,subject:u,target:b,identifier:A,active:k,x:B[0]+O,y:B[1]+H,dx:B[0]-z[0],dy:B[1]-z[1],dispatch:I}),F)}}return b.filter=function(h){return arguments.length?(e=typeof h=="function"?h:ht(!!h),b):e},b.container=function(h){return arguments.length?(t=typeof h=="function"?h:ht(h),b):t},b.subject=function(h){return arguments.length?(o=typeof h=="function"?h:ht(h),b):o},b.touchable=function(h){return arguments.length?(n=typeof h=="function"?h:ht(!!h),b):n},b.on=function(){var h=a.on.apply(a,arguments);return h===a?b:h},b.clickDistance=function(h){return arguments.length?(d=(h=+h)*h,b):Math.sqrt(d)},b}const It=e=>()=>e;function ka(e,{sourceEvent:t,target:o,selection:n,mode:r,dispatch:a}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:t,enumerable:!0,configurable:!0},target:{value:o,enumerable:!0,configurable:!0},selection:{value:n,enumerable:!0,configurable:!0},mode:{value:r,enumerable:!0,configurable:!0},_:{value:a}})}function xa(e){e.stopImmediatePropagation()}function Bt(e){e.preventDefault(),e.stopImmediatePropagation()}var Bo={name:"drag"},Rt={name:"space"},Oe={name:"handle"},He={name:"center"};const{abs:Ro,max:ue,min:de}=Math;function Oo(e){return[+e[0],+e[1]]}function Jt(e){return[Oo(e[0]),Oo(e[1])]}var Ot={},Ht={},Sa={name:"xy",handles:["n","w","e","s","nw","ne","sw","se"].map(eo),input:function(e){return e==null?null:Jt(e)},output:function(e){return e}},Ne={overlay:"crosshair",selection:"move",n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Ho={e:"w",w:"e",nw:"ne",ne:"nw",se:"sw",sw:"se"},Wo={n:"s",s:"n",nw:"sw",ne:"se",se:"ne",sw:"nw"},wa={overlay:1,selection:1,n:null,e:1,s:null,w:-1,nw:-1,ne:1,se:1,sw:-1},Na={overlay:1,selection:1,n:-1,e:null,s:1,w:null,nw:-1,ne:-1,se:1,sw:1};function eo(e){return{type:e}}function $a(e){return!e.ctrlKey&&!e.button}function La(){var e=this.ownerSVGElement||this;return e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]}function za(){return navigator.maxTouchPoints||"ontouchstart"in this}function Wt(e){for(;!e.__brush;)if(!(e=e.parentNode))return;return e.__brush}function Ea(e){return e[0][0]===e[1][0]||e[0][1]===e[1][1]}function Pa(){return Ta(Sa)}function Ta(e){var t=La,o=$a,n=za,r=!0,a=so("start","brush","end"),s=6,i;function l(v){var f=v.property("__brush",T).selectAll(".overlay").data([eo("overlay")]);f.enter().append("rect").attr("class","overlay").attr("pointer-events","all").attr("cursor",Ne.overlay).merge(f).each(function(){var m=Wt(this).extent;V(this).attr("x",m[0][0]).attr("y",m[0][1]).attr("width",m[1][0]-m[0][0]).attr("height",m[1][1]-m[0][1])}),v.selectAll(".selection").data([eo("selection")]).enter().append("rect").attr("class","selection").attr("cursor",Ne.selection).attr("fill","#777").attr("fill-opacity",.3).attr("stroke","#fff").attr("shape-rendering","crispEdges");var E=v.selectAll(".handle").data(e.handles,function(m){return m.type});E.exit().remove(),E.enter().append("rect").attr("class",function(m){return"handle handle--"+m.type}).attr("cursor",function(m){return Ne[m.type]}),v.each(c).attr("fill","none").attr("pointer-events","all").on("mousedown.brush",b).filter(n).on("touchstart.brush",b).on("touchmove.brush",N).on("touchend.brush touchcancel.brush",x).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}l.move=function(v,f,E){v.tween?v.on("start.brush",function(m){p(this,arguments).beforestart().start(m)}).on("interrupt.brush end.brush",function(m){p(this,arguments).end(m)}).tween("brush",function(){var m=this,h=m.__brush,w=p(m,arguments),L=h.selection,F=e.input(typeof f=="function"?f.apply(this,arguments):f,h.extent),A=lo(L,F);function _(I){h.selection=I===1&&F===null?null:A(I),c.call(m),w.brush()}return L!==null&&F!==null?_:_(1)}):v.each(function(){var m=this,h=arguments,w=m.__brush,L=e.input(typeof f=="function"?f.apply(m,h):f,w.extent),F=p(m,h).beforestart();at(m),w.selection=L===null?null:L,c.call(m),F.start(E).brush(E).end(E)})},l.clear=function(v,f){l.move(v,null,f)};function c(){var v=V(this),f=Wt(this).selection;f?(v.selectAll(".selection").style("display",null).attr("x",f[0][0]).attr("y",f[0][1]).attr("width",f[1][0]-f[0][0]).attr("height",f[1][1]-f[0][1]),v.selectAll(".handle").style("display",null).attr("x",function(E){return E.type[E.type.length-1]==="e"?f[1][0]-s/2:f[0][0]-s/2}).attr("y",function(E){return E.type[0]==="s"?f[1][1]-s/2:f[0][1]-s/2}).attr("width",function(E){return E.type==="n"||E.type==="s"?f[1][0]-f[0][0]+s:s}).attr("height",function(E){return E.type==="e"||E.type==="w"?f[1][1]-f[0][1]+s:s})):v.selectAll(".selection,.handle").style("display","none").attr("x",null).attr("y",null).attr("width",null).attr("height",null)}function p(v,f,E){var m=v.__brush.emitter;return m&&(!E||!m.clean)?m:new d(v,f,E)}function d(v,f,E){this.that=v,this.args=f,this.state=v.__brush,this.active=0,this.clean=E}d.prototype={beforestart:function(){return++this.active===1&&(this.state.emitter=this,this.starting=!0),this},start:function(v,f){return this.starting?(this.starting=!1,this.emit("start",v,f)):this.emit("brush",v),this},brush:function(v,f){return this.emit("brush",v,f),this},end:function(v,f){return--this.active===0&&(delete this.state.emitter,this.emit("end",v,f)),this},emit:function(v,f,E){var m=V(this.that).datum();a.call(v,this.that,new ka(v,{sourceEvent:f,target:l,selection:e.output(this.state.selection),mode:E,dispatch:a}),m)}};function b(v){if(i&&!v.touches||!o.apply(this,arguments))return;var f=this,E=v.target.__data__.type,m=(r&&v.metaKey?E="overlay":E)==="selection"?Bo:r&&v.altKey?He:Oe,h=e===Ht?null:wa[E],w=e===Ot?null:Na[E],L=Wt(f),F=L.extent,A=L.selection,_=F[0][0],I,B,O=F[0][1],H,u,y=F[1][0],g,S,P=F[1][1],z,k,$=0,M=0,W,D=h&&w&&r&&v.shiftKey,U,j,X=Array.from(v.touches||[v],C=>{const Y=C.identifier;return C=ve(C,f),C.point0=C.slice(),C.identifier=Y,C});at(f);var q=p(f,arguments,!0).beforestart();if(E==="overlay"){A&&(W=!0);const C=[X[0],X[1]||X[0]];L.selection=A=[[I=e===Ht?_:de(C[0][0],C[1][0]),H=e===Ot?O:de(C[0][1],C[1][1])],[g=e===Ht?y:ue(C[0][0],C[1][0]),z=e===Ot?P:ue(C[0][1],C[1][1])]],X.length>1&&ae(v)}else I=A[0][0],H=A[0][1],g=A[1][0],z=A[1][1];B=I,u=H,S=g,k=z;var te=V(f).attr("pointer-events","none"),oe=te.selectAll(".overlay").attr("cursor",Ne[E]);if(v.touches)q.moved=ge,q.ended=he;else{var ie=V(v.view).on("mousemove.brush",ge,!0).on("mouseup.brush",he,!0);r&&ie.on("keydown.brush",re,!0).on("keyup.brush",me,!0),po(v.view)}c.call(f),q.start(v,m.name);function ge(C){for(const Y of C.changedTouches||[C])for(const se of X)se.identifier===Y.identifier&&(se.cur=ve(Y,f));if(D&&!U&&!j&&X.length===1){const Y=X[0];Ro(Y.cur[0]-Y[0])>Ro(Y.cur[1]-Y[1])?j=!0:U=!0}for(const Y of X)Y.cur&&(Y[0]=Y.cur[0],Y[1]=Y.cur[1]);W=!0,Bt(C),ae(C)}function ae(C){const Y=X[0],se=Y.point0;var ce;switch($=Y[0]-se[0],M=Y[1]-se[1],m){case Rt:case Bo:{h&&($=ue(_-I,de(y-g,$)),B=I+$,S=g+$),w&&(M=ue(O-H,de(P-z,M)),u=H+M,k=z+M);break}case Oe:{X[1]?(h&&(B=ue(_,de(y,X[0][0])),S=ue(_,de(y,X[1][0])),h=1),w&&(u=ue(O,de(P,X[0][1])),k=ue(O,de(P,X[1][1])),w=1)):(h<0?($=ue(_-I,de(y-I,$)),B=I+$,S=g):h>0&&($=ue(_-g,de(y-g,$)),B=I,S=g+$),w<0?(M=ue(O-H,de(P-H,M)),u=H+M,k=z):w>0&&(M=ue(O-z,de(P-z,M)),u=H,k=z+M));break}case He:{h&&(B=ue(_,de(y,I-$*h)),S=ue(_,de(y,g+$*h))),w&&(u=ue(O,de(P,H-M*w)),k=ue(O,de(P,z+M*w)));break}}S<B&&(h*=-1,ce=I,I=g,g=ce,ce=B,B=S,S=ce,E in Ho&&oe.attr("cursor",Ne[E=Ho[E]])),k<u&&(w*=-1,ce=H,H=z,z=ce,ce=u,u=k,k=ce,E in Wo&&oe.attr("cursor",Ne[E=Wo[E]])),L.selection&&(A=L.selection),U&&(B=A[0][0],S=A[1][0]),j&&(u=A[0][1],k=A[1][1]),(A[0][0]!==B||A[0][1]!==u||A[1][0]!==S||A[1][1]!==k)&&(L.selection=[[B,u],[S,k]],c.call(f),q.brush(C,m.name))}function he(C){if(xa(C),C.touches){if(C.touches.length)return;i&&clearTimeout(i),i=setTimeout(function(){i=null},500)}else go(C.view,W),ie.on("keydown.brush keyup.brush mousemove.brush mouseup.brush",null);te.attr("pointer-events","all"),oe.attr("cursor",Ne.overlay),L.selection&&(A=L.selection),Ea(A)&&(L.selection=null,c.call(f)),q.end(C,m.name)}function re(C){switch(C.keyCode){case 16:{D=h&&w;break}case 18:{m===Oe&&(h&&(g=S-$*h,I=B+$*h),w&&(z=k-M*w,H=u+M*w),m=He,ae(C));break}case 32:{(m===Oe||m===He)&&(h<0?g=S-$:h>0&&(I=B-$),w<0?z=k-M:w>0&&(H=u-M),m=Rt,oe.attr("cursor",Ne.selection),ae(C));break}default:return}Bt(C)}function me(C){switch(C.keyCode){case 16:{D&&(U=j=D=!1,ae(C));break}case 18:{m===He&&(h<0?g=S:h>0&&(I=B),w<0?z=k:w>0&&(H=u),m=Oe,ae(C));break}case 32:{m===Rt&&(C.altKey?(h&&(g=S-$*h,I=B+$*h),w&&(z=k-M*w,H=u+M*w),m=He):(h<0?g=S:h>0&&(I=B),w<0?z=k:w>0&&(H=u),m=Oe),oe.attr("cursor",Ne[E]),ae(C));break}default:return}Bt(C)}}function N(v){p(this,arguments).moved(v)}function x(v){p(this,arguments).ended(v)}function T(){var v=this.__brush||{selection:null};return v.extent=Jt(t.apply(this,arguments)),v.dim=e,v}return l.extent=function(v){return arguments.length?(t=typeof v=="function"?v:It(Jt(v)),l):t},l.filter=function(v){return arguments.length?(o=typeof v=="function"?v:It(!!v),l):o},l.touchable=function(v){return arguments.length?(n=typeof v=="function"?v:It(!!v),l):n},l.handleSize=function(v){return arguments.length?(s=+v,l):s},l.keyModifiers=function(v){return arguments.length?(r=!!v,l):r},l.on=function(){var v=a.on.apply(a,arguments);return v===a?l:v},l}var le;(function(e){e.Circular="circular",e.Concentric="concentric",e.Parallel="parallel",e.ParallelHorizontal="parallel horizontal",e.Dagre="dagre",e.Force="force",e.Elk="elk",e.Precalculated="precalculated"})(le||(le={}));var St;(function(e){e.Dashed="dashed",e.Solid="solid"})(St||(St={}));var Ye;(function(e){e.Single="single",e.Double="double"})(Ye||(Ye={}));var ne;(function(e){e.Circle="circle",e.Square="square",e.Hexagon="hexagon",e.Triangle="triangle"})(ne||(ne={}));var Ue;(function(e){e.None="none",e.Greyout="greyout",e.GreyoutNonConnected="greyout-non-connected"})(Ue||(Ue={}));var Pe;(function(e){e.Center="center",e.Top="top",e.Bottom="bottom",e.Left="left",e.Right="right"})(Pe||(Pe={}));const ft=e=>()=>e;function Ma(e,{sourceEvent:t,target:o,transform:n,dispatch:r}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:t,enumerable:!0,configurable:!0},target:{value:o,enumerable:!0,configurable:!0},transform:{value:n,enumerable:!0,configurable:!0},_:{value:r}})}function $e(e,t,o){this.k=e,this.x=t,this.y=o}$e.prototype={constructor:$e,scale:function(e){return e===1?this:new $e(this.k*e,this.x,this.y)},translate:function(e,t){return e===0&t===0?this:new $e(this.k,this.x+this.k*e,this.y+this.k*t)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var zt=new $e(1,0,0);ot.prototype=$e.prototype;function ot(e){for(;!e.__zoom;)if(!(e=e.parentNode))return zt;return e.__zoom}function Ut(e){e.stopImmediatePropagation()}function Je(e){e.preventDefault(),e.stopImmediatePropagation()}function Aa(e){return(!e.ctrlKey||e.type==="wheel")&&!e.button}function Fa(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]):[[0,0],[e.clientWidth,e.clientHeight]]}function Uo(){return this.__zoom||zt}function Ga(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function Ca(){return navigator.maxTouchPoints||"ontouchstart"in this}function Da(e,t,o){var n=e.invertX(t[0][0])-o[0][0],r=e.invertX(t[1][0])-o[1][0],a=e.invertY(t[0][1])-o[0][1],s=e.invertY(t[1][1])-o[1][1];return e.translate(r>n?(n+r)/2:Math.min(0,n)||Math.max(0,r),s>a?(a+s)/2:Math.min(0,a)||Math.max(0,s))}function Ia(){var e=Aa,t=Fa,o=Da,n=Ga,r=Ca,a=[0,1/0],s=[[-1/0,-1/0],[1/0,1/0]],i=250,l=pa,c=so("start","zoom","end"),p,d,b,N=500,x=150,T=0,v=10;function f(u){u.property("__zoom",Uo).on("wheel.zoom",A,{passive:!1}).on("mousedown.zoom",_).on("dblclick.zoom",I).filter(r).on("touchstart.zoom",B).on("touchmove.zoom",O).on("touchend.zoom touchcancel.zoom",H).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}f.transform=function(u,y,g,S){var P=u.selection?u.selection():u;P.property("__zoom",Uo),u!==P?w(u,y,g,S):P.interrupt().each(function(){L(this,arguments).event(S).start().zoom(null,typeof y=="function"?y.apply(this,arguments):y).end()})},f.scaleBy=function(u,y,g,S){f.scaleTo(u,function(){var P=this.__zoom.k,z=typeof y=="function"?y.apply(this,arguments):y;return P*z},g,S)},f.scaleTo=function(u,y,g,S){f.transform(u,function(){var P=t.apply(this,arguments),z=this.__zoom,k=g==null?h(P):typeof g=="function"?g.apply(this,arguments):g,$=z.invert(k),M=typeof y=="function"?y.apply(this,arguments):y;return o(m(E(z,M),k,$),P,s)},g,S)},f.translateBy=function(u,y,g,S){f.transform(u,function(){return o(this.__zoom.translate(typeof y=="function"?y.apply(this,arguments):y,typeof g=="function"?g.apply(this,arguments):g),t.apply(this,arguments),s)},null,S)},f.translateTo=function(u,y,g,S,P){f.transform(u,function(){var z=t.apply(this,arguments),k=this.__zoom,$=S==null?h(z):typeof S=="function"?S.apply(this,arguments):S;return o(zt.translate($[0],$[1]).scale(k.k).translate(typeof y=="function"?-y.apply(this,arguments):-y,typeof g=="function"?-g.apply(this,arguments):-g),z,s)},S,P)};function E(u,y){return y=Math.max(a[0],Math.min(a[1],y)),y===u.k?u:new $e(y,u.x,u.y)}function m(u,y,g){var S=y[0]-g[0]*u.k,P=y[1]-g[1]*u.k;return S===u.x&&P===u.y?u:new $e(u.k,S,P)}function h(u){return[(+u[0][0]+ +u[1][0])/2,(+u[0][1]+ +u[1][1])/2]}function w(u,y,g,S){u.on("start.zoom",function(){L(this,arguments).event(S).start()}).on("interrupt.zoom end.zoom",function(){L(this,arguments).event(S).end()}).tween("zoom",function(){var P=this,z=arguments,k=L(P,z).event(S),$=t.apply(P,z),M=g==null?h($):typeof g=="function"?g.apply(P,z):g,W=Math.max($[1][0]-$[0][0],$[1][1]-$[0][1]),D=P.__zoom,U=typeof y=="function"?y.apply(P,z):y,j=l(D.invert(M).concat(W/D.k),U.invert(M).concat(W/U.k));return function(X){if(X===1)X=U;else{var q=j(X),te=W/q[2];X=new $e(te,M[0]-q[0]*te,M[1]-q[1]*te)}k.zoom(null,X)}})}function L(u,y,g){return!g&&u.__zooming||new F(u,y)}function F(u,y){this.that=u,this.args=y,this.active=0,this.sourceEvent=null,this.extent=t.apply(u,y),this.taps=0}F.prototype={event:function(u){return u&&(this.sourceEvent=u),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(u,y){return this.mouse&&u!=="mouse"&&(this.mouse[1]=y.invert(this.mouse[0])),this.touch0&&u!=="touch"&&(this.touch0[1]=y.invert(this.touch0[0])),this.touch1&&u!=="touch"&&(this.touch1[1]=y.invert(this.touch1[0])),this.that.__zoom=y,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(u){var y=V(this.that).datum();c.call(u,this.that,new Ma(u,{sourceEvent:this.sourceEvent,target:f,transform:this.that.__zoom,dispatch:c}),y)}};function A(u,...y){if(!e.apply(this,arguments))return;var g=L(this,y).event(u),S=this.__zoom,P=Math.max(a[0],Math.min(a[1],S.k*Math.pow(2,n.apply(this,arguments)))),z=ve(u);if(g.wheel)(g.mouse[0][0]!==z[0]||g.mouse[0][1]!==z[1])&&(g.mouse[1]=S.invert(g.mouse[0]=z)),clearTimeout(g.wheel);else{if(S.k===P)return;g.mouse=[z,S.invert(z)],at(this),g.start()}Je(u),g.wheel=setTimeout(k,x),g.zoom("mouse",o(m(E(S,P),g.mouse[0],g.mouse[1]),g.extent,s));function k(){g.wheel=null,g.end()}}function _(u,...y){if(b||!e.apply(this,arguments))return;var g=u.currentTarget,S=L(this,y,!0).event(u),P=V(u.view).on("mousemove.zoom",M,!0).on("mouseup.zoom",W,!0),z=ve(u,g),k=u.clientX,$=u.clientY;po(u.view),Ut(u),S.mouse=[z,this.__zoom.invert(z)],at(this),S.start();function M(D){if(Je(D),!S.moved){var U=D.clientX-k,j=D.clientY-$;S.moved=U*U+j*j>T}S.event(D).zoom("mouse",o(m(S.that.__zoom,S.mouse[0]=ve(D,g),S.mouse[1]),S.extent,s))}function W(D){P.on("mousemove.zoom mouseup.zoom",null),go(D.view,S.moved),Je(D),S.event(D).end()}}function I(u,...y){if(e.apply(this,arguments)){var g=this.__zoom,S=ve(u.changedTouches?u.changedTouches[0]:u,this),P=g.invert(S),z=g.k*(u.shiftKey?.5:2),k=o(m(E(g,z),S,P),t.apply(this,y),s);Je(u),i>0?V(this).transition().duration(i).call(w,k,S,u):V(this).call(f.transform,k,S,u)}}function B(u,...y){if(e.apply(this,arguments)){var g=u.touches,S=g.length,P=L(this,y,u.changedTouches.length===S).event(u),z,k,$,M;for(Ut(u),k=0;k<S;++k)$=g[k],M=ve($,this),M=[M,this.__zoom.invert(M),$.identifier],P.touch0?!P.touch1&&P.touch0[2]!==M[2]&&(P.touch1=M,P.taps=0):(P.touch0=M,z=!0,P.taps=1+!!p);p&&(p=clearTimeout(p)),z&&(P.taps<2&&(d=M[0],p=setTimeout(function(){p=null},N)),at(this),P.start())}}function O(u,...y){if(this.__zooming){var g=L(this,y).event(u),S=u.changedTouches,P=S.length,z,k,$,M;for(Je(u),z=0;z<P;++z)k=S[z],$=ve(k,this),g.touch0&&g.touch0[2]===k.identifier?g.touch0[0]=$:g.touch1&&g.touch1[2]===k.identifier&&(g.touch1[0]=$);if(k=g.that.__zoom,g.touch1){var W=g.touch0[0],D=g.touch0[1],U=g.touch1[0],j=g.touch1[1],X=(X=U[0]-W[0])*X+(X=U[1]-W[1])*X,q=(q=j[0]-D[0])*q+(q=j[1]-D[1])*q;k=E(k,Math.sqrt(X/q)),$=[(W[0]+U[0])/2,(W[1]+U[1])/2],M=[(D[0]+j[0])/2,(D[1]+j[1])/2]}else if(g.touch0)$=g.touch0[0],M=g.touch0[1];else return;g.zoom("touch",o(m(k,$,M),g.extent,s))}}function H(u,...y){if(this.__zooming){var g=L(this,y).event(u),S=u.changedTouches,P=S.length,z,k;for(Ut(u),b&&clearTimeout(b),b=setTimeout(function(){b=null},N),z=0;z<P;++z)k=S[z],g.touch0&&g.touch0[2]===k.identifier?delete g.touch0:g.touch1&&g.touch1[2]===k.identifier&&delete g.touch1;if(g.touch1&&!g.touch0&&(g.touch0=g.touch1,delete g.touch1),g.touch0)g.touch0[1]=this.__zoom.invert(g.touch0[0]);else if(g.end(),g.taps===2&&(k=ve(k,this),Math.hypot(d[0]-k[0],d[1]-k[1])<v)){var $=V(this).on("dblclick.zoom");$&&$.apply(this,arguments)}}}return f.wheelDelta=function(u){return arguments.length?(n=typeof u=="function"?u:ft(+u),f):n},f.filter=function(u){return arguments.length?(e=typeof u=="function"?u:ft(!!u),f):e},f.touchable=function(u){return arguments.length?(r=typeof u=="function"?u:ft(!!u),f):r},f.extent=function(u){return arguments.length?(t=typeof u=="function"?u:ft([[+u[0][0],+u[0][1]],[+u[1][0],+u[1][1]]]),f):t},f.scaleExtent=function(u){return arguments.length?(a[0]=+u[0],a[1]=+u[1],f):[a[0],a[1]]},f.translateExtent=function(u){return arguments.length?(s[0][0]=+u[0][0],s[1][0]=+u[1][0],s[0][1]=+u[0][1],s[1][1]=+u[1][1],f):[[s[0][0],s[0][1]],[s[1][0],s[1][1]]]},f.constrain=function(u){return arguments.length?(o=u,f):o},f.duration=function(u){return arguments.length?(i=+u,f):i},f.interpolate=function(u){return arguments.length?(l=u,f):l},f.on=function(){var u=c.on.apply(c,arguments);return u===c?f:u},f.clickDistance=function(u){return arguments.length?(T=(u=+u)*u,f):Math.sqrt(T)},f.tapDistance=function(u){return arguments.length?(v=+u,f):v},f}class Ba extends Mn{constructor(){super(...arguments),this._nodes=[],this._links=[],this._inputNodesMap=new Map,this._nodesMap=new Map,this.nodeId=t=>Gt(t.id)||isFinite(t.id)?`${t.id}`:void 0,this.linkId=t=>Gt(t.id)||isFinite(t.id)?`${t.id}`:void 0}getNodeById(t){return this._nodesMap.get(t)}get data(){return this._data}set data(t){var o,n;if(!t)return;this._data=t;const r=this.nodes,a=this.links;this._inputNodesMap.clear(),this._nodesMap.clear();const s=Ao((o=t?.nodes)!==null&&o!==void 0?o:[]),i=Ao((n=t?.links)!==null&&n!==void 0?n:[]);this.transferState(s,r,this.nodeId),this.transferState(i,a,this.linkId),s.forEach((l,c)=>{l._index=c,l._id=this.nodeId(l)||`${c}`,this._inputNodesMap.set(l,t.nodes[c]),this._nodesMap.set(l._id,l)}),Te(this.nodeSort)&&s.sort(this.nodeSort),i.forEach((l,c)=>{l._indexGlobal=c,l.source=this.findNode(s,l.source),l.target=this.findNode(s,l.target)}),i.forEach((l,c)=>{if(!Fo(l._index)&&!Fo(l._neighbours))return;const p=i.filter(d=>l.source===d.source&&l.target===d.target||l.source===d.target&&l.target===d.source);p.forEach((d,b)=>{var N,x;d._index=b,d._id=this.linkId(d)||`${(N=d.source)===null||N===void 0?void 0:N._id}-${(x=d.target)===null||x===void 0?void 0:x._id}-${b}`,d._neighbours=p.length,d._direction=l.source===d.source&&l.target===d.target?1:-1})}),s.forEach(l=>{l.links=i.filter(c=>c.source===l||c.target===l),l._isConnected=l.links.length!==0}),this._nonConnectedNodes=s.filter(l=>!l._isConnected),this._connectedNodes=Ko(s,...this._nonConnectedNodes),this._nodes=s,this._links=i.filter(l=>l.source===l.target?(console.warn(`Unovis | Graph Data Model: Skipping link ${l._id} because it has the same source and target`),!1):l.source&&l.target)}get nodes(){return this._nodes}get links(){return this._links}get connectedNodes(){return this._connectedNodes}get nonConnectedNodes(){return this._nonConnectedNodes}findNode(t,o){let n;return gt(o)?n=t[o]:Gt(o)?n=t.find(r=>this.nodeId(r)===o):An(o)&&(n=t.find(r=>co(this._inputNodesMap.get(r),o))),n||console.warn(`Unovis | Graph Data Model: Node ${o} is missing from the nodes list`),n}transferState(t,o,n){for(const r of t){const a=o.find(s=>n(s)===n(r));a?r._state=Object.assign({},a._state):r._state={}}}setNodeStateById(t,o){const n=this.getNodeById(t);if(!n){console.warn(`Unovis | Graph Data Model: Node ${t} not found`);return}n._state=o}}function Et(e,t,o,n){function r(a){return a instanceof o?a:new o(function(s){s(a)})}return new(o||(o=Promise))(function(a,s){function i(p){try{c(n.next(p))}catch(d){s(d)}}function l(p){try{c(n.throw(p))}catch(d){s(d)}}function c(p){p.done?a(p.value):r(p.value).then(i,l)}c((n=n.apply(e,t||[])).next())})}const Ra=Object.assign(Object.assign({},Fn),{duration:1e3,zoomScaleExtent:[.35,1.25],disableZoom:!1,zoomEventFilter:void 0,disableDrag:!1,disableBrush:!1,zoomThrottledUpdateNodeThreshold:100,layoutType:le.Force,layoutAutofit:!0,layoutAutofitTolerance:8,layoutNonConnectedAside:!1,fitViewPadding:50,fitViewAlign:Pe.Center,layoutGroupOrder:[],layoutParallelNodeSpacing:void 0,layoutParallelSubGroupsPerRow:1,layoutParallelNodesPerColumn:6,layoutParallelGroupSpacing:void 0,layoutParallelSubGroupSpacing:40,layoutParallelSortConnectionsByGroup:void 0,layoutNodeGroup:e=>e.group,layoutParallelNodeSubGroup:e=>e.subgroup,forceLayoutSettings:{linkDistance:60,linkStrength:.45,charge:-500,forceXStrength:.15,forceYStrength:.25,numIterations:void 0,fixNodePositionAfterSimulation:!1},dagreLayoutSettings:{rankdir:"BT",ranker:"longest-path"},layoutElkSettings:void 0,layoutElkNodeGroups:void 0,layoutElkGetNodeShape:void 0,linkFlowAnimDuration:2e4,linkFlowParticleSize:2,linkFlowParticleSpeed:void 0,linkWidth:1,linkStyle:St.Solid,linkBandWidth:0,linkArrow:void 0,linkStroke:void 0,linkFlow:!1,linkLabel:void 0,linkLabelShiftFromCenter:!0,linkNeighborSpacing:8,linkDisabled:!1,linkCurvature:0,linkHighlightOnHover:!0,linkSourcePointOffset:void 0,linkTargetPointOffset:void 0,selectedLinkId:void 0,nodeSize:30,nodeStrokeWidth:3,nodeShape:ne.Circle,nodeGaugeValue:0,nodeIcon:e=>e.icon,nodeIconSize:void 0,nodeLabel:e=>e.label,nodeLabelTrim:!0,nodeLabelTrimLength:15,nodeLabelTrimMode:Go.Middle,nodeSubLabel:"",nodeSubLabelTrim:!0,nodeSubLabelTrimLength:15,nodeSubLabelTrimMode:Go.Middle,nodeSideLabels:void 0,nodeBottomIcon:void 0,nodeDisabled:!1,nodeFill:e=>e.fill,nodeGaugeFill:void 0,nodeStroke:e=>e.stroke,nodeEnterPosition:void 0,nodeEnterScale:.75,nodeExitPosition:void 0,nodeExitScale:.75,nodeSort:void 0,nodeSelectionHighlightMode:Ue.GreyoutNonConnected,nodeGaugeAnimDuration:1500,selectedNodeId:void 0,selectedNodeIds:void 0,panels:void 0,onNodeDragStart:void 0,onNodeDrag:void 0,onNodeDragEnd:void 0,onZoom:void 0,onZoomStart:void 0,onZoomEnd:void 0,onLayoutCalculated:void 0,onNodeSelectionBrush:void 0,onNodeSelectionDrag:void 0,onRenderComplete:void 0,shouldDataUpdate:(e,t)=>!co(e,t)}),mo=G`
  label: nodes;
`,Oa=Lt`
  :root {
    /* Node Fill */
    --vis-graph-node-stroke-color: rgb(206, 211, 222);
    --vis-graph-node-fill-color: #fff;
    --vis-graph-node-gauge-color: #adb4c2;
    --vis-graph-node-selection-color: #acb3b8;

    --vis-dark-graph-node-stroke-color: rgba(30,30,30,.25);
    --vis-dark-graph-node-fill-color: #494b56;
    --vis-dark-graph-node-gauge-color: #989aa3;
    --vis-dark-graph-node-selection-color: #494b56;

    /* Node Central Icon */
    --vis-graph-node-icon-fill-color-bright: #ffffff;
    --vis-graph-node-icon-fill-color-dark: var(--vis-color-grey);
    --vis-graph-node-icon-fill-color: #9ea7b8;

    --vis-dark-graph-node-icon-fill-color: var(--vis-graph-node-icon-fill-color-bright);

    /* Node Bottom Icon */
    --vis-graph-node-bottom-icon-font-size: 14pt;
    --vis-graph-node-bottom-icon-fill-color: #a0a6ad;
    --vis-graph-node-bottom-icon-stroke-color: #fff;
    --vis-graph-node-bottom-icon-stroke-width: 2px;

    --vis-dark-graph-node-bottom-icon-fill-color: #a0a6ad;
    --vis-dark-graph-node-bottom-icon-stroke-color: #fff;

    /* Node Label */
    --vis-graph-node-label-font-size: 9pt;
    --vis-graph-node-label-background: #ffffff;
    --vis-graph-node-label-text-color: #0F1E57;
    --vis-graph-node-sublabel-text-color: #989aa3;
    --vis-graph-node-sublabel-font-size: 8pt;
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-graph-node-label-font-family: */

    --vis-dark-graph-node-label-background: var(--vis-color-grey);
    --vis-dark-graph-node-label-text-color: #ffffff;
    --vis-dark-graph-node-sublabel-text-color: #989aa3;

    /* Node Side Labels (circular labels)*/
    --vis-graph-node-side-label-background-fill-color: #a0a9af;
    --vis-graph-node-side-label-background-stroke-color: #ffffff;
    --vis-graph-node-side-label-fill-color-bright: #ffffff;
    --vis-graph-node-side-label-fill-color-dark: #494b56;

    --vis-dark-graph-node-side-label-background-fill-color: #989aa3;
    --vis-dark-graph-node-side-label-background-stroke-color: var(--vis-color-grey);
    --vis-dark-graph-node-side-label-fill-color-bright: #f1f4f7;
    --vis-dark-graph-node-side-label-fill-color-dark: var(--vis-color-grey);

    /* Greyout */
    --vis-graph-node-greyout-opacity: 0.9;
    --vis-graph-node-greyout-filter: none;
    --vis-graph-node-greyout-color: #ebeff7;
    --vis-graph-node-icon-greyout-color: #c6cad1;
    --vis-graph-node-side-label-background-greyout-color: #f1f4f7;

    --vis-dark-graph-node-greyout-color: #494b56;
    --vis-dark-graph-node-icon-greyout-color: var(--vis-color-grey);
    --vis-dark-graph-node-side-label-background-greyout-color: #494B56;

    /* Brushed */
    --vis-graph-brushed-node-stroke-color: var(--vis-color-main);
    --vis-graph-brushed-node-label-text-color: var(--vis-color-main);
    --vis-graph-brushed-node-icon-fill-color: var(--vis-color-main);
    
    /* Misc */
    --vis-graph-node-dominant-baseline: middle;
  }

  body.theme-dark ${`.${mo}`} {
    --vis-graph-node-stroke-color: var(--vis-dark-graph-node-stroke-color);
    --vis-graph-node-fill-color: var(--vis-dark-graph-node-fill-color);
    --vis-graph-node-gauge-color: var(--vis-dark-graph-node-gauge-color);
    --vis-graph-node-selection-color: var(--vis-dark-graph-node-selection-color);

    --vis-graph-node-icon-fill-color: var(--vis-dark-graph-node-icon-fill-color);

    --vis-graph-node-bottom-icon-fill-color: var(--vis-dark-graph-node-bottom-icon-fill-color);
    --vis-graph-node-bottom-icon-stroke-color: var(--vis-dark-graph-node-bottom-icon-stroke-color);

    --vis-graph-node-label-background: var(--vis-dark-graph-node-label-background);
    --vis-graph-node-label-text-color: var(--vis-dark-graph-node-label-text-color);
    --vis-graph-node-sublabel-text-color: var(--vis-dark-graph-node-sublabel-text-color);

    --vis-graph-node-side-label-background-fill-color: var(--vis-dark-graph-node-side-label-background-fill-color);
    --vis-graph-node-side-label-background-stroke-color: var(--vis-dark-graph-side-label-background-stroke-color);
    --vis-graph-node-side-label-fill-color-bright: var(--vis-dark-graph-node-side-label-fill-color-bright);
    --vis-graph-node-side-label-fill-color-dark: var(vis-dark-graph-node-side-label-fill-color-dark);

    --vis-graph-node-greyout-color: var(--vis-dark-graph-node-greyout-color);
    --vis-graph-node-icon-greyout-color: var(--vis-dark-graph-node-icon-greyout-color);
    --vis-graph-node-side-label-background-greyout-color: var(--vis-dark-graph-node-side-label-background-greyout-color);
  }
`,je=G`
  label: brushable;
`,xe=G`
  label: node-shape;

  stroke: var(--vis-graph-node-stroke-color);
  fill: var(--vis-graph-node-fill-color);

  :not(.${je}) {
    transition: .4s fill, 4s stroke;
  }
`,ut=G`
  label: icon;

  font-family: var(--vis-graph-icon-font-family), var(--vis-font-family);
  dominant-baseline: var(--vis-graph-node-dominant-baseline);
  text-anchor: middle;
  pointer-events: none;
  fill: var(--vis-graph-node-icon-fill-color);

  :not(.${je}) {
    transition: .4s all;
  }
`,vo=G`
  label: node-bottom-icon;
  font-family: var(--vis-graph-icon-font-family), var(--vis-font-family);
  font-size: var(--vis-graph-node-bottom-icon-font-size);
  dominant-baseline: var(--vis-graph-node-dominant-baseline);
  text-anchor: middle;
  pointer-events: none;
  fill: var(--vis-graph-node-bottom-icon-fill-color);
  stroke: var(--vis-graph-node-bottom-icon-stroke-color);
  stroke-width: var(--vis-graph-node-bottom-icon-stroke-width);

  :not(.${je}) {
    transition: .4s all;
  }
`,bo=G`
  label: dragged;
`,Ge=G`
  label: label;

  text-anchor: middle;
  font-weight: 300;
  font-size: var(--vis-graph-node-label-font-size);
`,nn=G`
  label: background;

  opacity: 0.9;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  fill: var(--vis-graph-node-label-background);
`,Ve=G`
  label: label-text;
`,Pt=G`
  label: label-text-content;

  fill: var(--vis-graph-node-label-text-color);
  font-family: var(--vis-graph-node-label-font-family, var(--vis-font-family));
`,yo=G`
  label: sublabel-text-content;

  fill: var(--vis-graph-node-sublabel-text-color);
  font-family: var(--vis-graph-node-label-font-family, var(--vis-font-family));
  font-size: var(--vis-graph-node-sublabel-font-size);
`,_o=G`
  label: side-labels-group;
`,Ze=G`
  label: side-label-background;

  stroke-opacity: 0.8;
  stroke: var(--vis-graph-node-side-label-background-stroke-color);
  fill: var(--vis-graph-node-side-label-background-fill-color);
`,qe=G`
  label: side-label;

  font-family: var(--vis-graph-icon-font-family), var(--vis-font-family);
  dominant-baseline: var(--vis-graph-node-dominant-baseline);
  text-anchor: middle;
  font-size: 16px;
  fill: var(--vis-graph-node-side-label-fill-color-bright);
`,ko=G`
  label: side-label-group;
  cursor: default;
`,_e=G`
  label: g-node;

  transition: .25s opacity;
`,an=G`
  label: draggable;

  &:hover {
    cursor: grab;
  }

  &${`.${bo}`} {
    cursor: grabbing;
  }
`,vt=G`
  label: g-node-exit;
  pointer-events: none;
`,Tt=G`
  label: active;
`,Me=G`
  label: node-selection;

  fill: none;
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0;
  transition: 350ms cubic-bezier(0.165, 0.840, 0.440, 1.000);
  transform: scale(.5);
  fill: var(--vis-graph-node-selection-color);
  fill-opacity: 0.1;
  stroke: var(--vis-graph-node-selection-color);
  stroke-opacity: 0.75;

  &${`.${Tt}`} {
    opacity: 1;
    transform: scale(1.2);
  }
`,Ae=G`
  label: node-gauge;

  fill: var(--vis-graph-node-gauge-color);
  transition: .4s fill;
`,rn=G`
  label: polygon;

  ${`.${Ae}`} {
    fill-opacity: 0;
    stroke-linecap: round;
    pointer-events: none;
  }
`,wt=G`
  label: custom-node;

  stroke-width: 0;
`,xo=G`
  label: greyed-out;
  opacity: var(--vis-graph-node-greyout-opacity);
  filter: var(--vis-graph-node-greyout-filter);

  ${`.${xe}`} {
    fill: var(--vis-graph-node-greyout-color) !important;
    stroke: var(--vis-graph-node-greyout-color) !important;
  }

  ${`.${ut}`} {
     fill: var(--vis-graph-node-icon-greyout-color) !important;
  }

  ${`.${Ae}`} {
    fill: var(--vis-graph-node-greyout-color) !important;
    stroke: var(--vis-graph-node-greyout-color) !important;
  }

  ${`.${Ge}`} {
    opacity: 0.5;
  }

  ${`.${Ze}`} {
     fill: var(--vis-graph-node-side-label-background-greyout-color) !important;
     stroke-opacity: 0.5;
   }

   ${`.${qe}`} {
    fill: var(--vis-graph-node-side-label-fill-color-bright) !important;
    opacity: 0.25;
  }
`,nt=G`
  label: brushed-node;

  ${`.${xe}`} {
    stroke: var(--vis-graph-brushed-node-stroke-color);
  }
  ${`.${ut}`} {
    fill: var(--vis-graph-brushed-node-icon-fill-color);
  }
  ${`.${Pt}`} {
    fill: var(--vis-graph-brushed-node-label-text-color);
  }
`,Ha=Object.freeze(Object.defineProperty({__proto__:null,brushable:je,brushed:nt,customNode:wt,draggable:an,gNode:_e,gNodeExit:vt,greyedOutNode:xo,label:Ge,labelBackground:nn,labelText:Ve,labelTextContent:Pt,node:xe,nodeBottomIcon:vo,nodeGauge:Ae,nodeIcon:ut,nodeIsDragged:bo,nodePolygon:rn,nodeSelection:Me,nodeSelectionActive:Tt,nodes:mo,sideLabel:qe,sideLabelBackground:Ze,sideLabelGroup:ko,sideLabelsGroup:_o,subLabelTextContent:yo,variables:Oa},Symbol.toStringTag,{value:"Module"})),sn=G`
  label: links;
`;Lt`
  :root {
    --vis-graph-link-stroke-color: #e6e9f3;
    --vis-graph-link-stroke-opacity: 1.0;
    --vis-graph-link-greyout-opacity: 0.3;
    --vis-graph-link-dashed-stroke-dasharray: 6 6;

    --vis-graph-link-label-font-size: 9pt;
    --vis-graph-link-label-background: #e6e9f3;
    --vis-graph-link-label-text-color-dark: #18181B;
    --vis-graph-link-label-text-color-bright: #fff;
    --vis-graph-link-label-text-color: var(--vis-graph-link-label-text-color-dark);

    --vis-graph-link-band-opacity: 0.35;
    --vis-graph-link-support-stroke-width: 10px;
    --vis-graph-link-flow-opacity: 1;

    --vis-dark-graph-link-stroke-color: #494b56;
    --vis-dark-graph-link-label-background: #3f3f45;
    --vis-dark-graph-link-label-text-color: var(--vis-graph-link-label-text-color-bright);


    --vis-graph-link-dominant-baseline: middle;
  }

  body.theme-dark ${`.${sn}`} {
    --vis-graph-link-stroke-color: var(--vis-dark-graph-link-stroke-color);
    --vis-graph-link-label-stroke-color: var(--vis-dark-graph-link-label-stroke-color);
    --vis-graph-link-label-text-color: var(--vis-dark-graph-link-label-text-color);
    --vis-graph-link-label-background: var(--vis-dark-graph-link-label-background);
  }
`;const dt=G`
  label: link-support;

  fill: none;
  stroke-linecap: round;
  stroke-width: var(--vis-graph-link-support-stroke-width);
  stroke-opacity: 0;
  stroke: var(--vis-graph-link-stroke-color);
  transition: stroke-opacity 0.2s;
`,Fe=G`
  label: link;

  fill: none;
  stroke: var(--vis-graph-link-stroke-color);
  stroke-opacity: var(--vis-graph-link-stroke-opacity);
  transition: stroke 800ms;
  stroke-linecap: round;
  pointer-events: none;
`,Wa=G`
  label: dashed;

  ${`.${Fe}`} {
    stroke-dasharray: var(--vis-graph-link-dashed-stroke-dasharray);
  }
`,ln=G`
  label: link-arrow;
  fill: var(--vis-graph-link-stroke-color);
`,we=G`
  label: g-link;
`,Vt=G`
  label: g-link-exit;
  pointer-events: none;
`,cn=G`
  label: greyed-out;
  opacity: var(--vis-graph-link-greyout-opacity);
`,lt=G`
  label: link-band;

  stroke-opacity: var(--vis-graph-link-band-opacity);
  pointer-events: none;
  stroke: var(--vis-graph-node-stroke-color);
  fill: none;
`,Mt=G`
  label: flow-group;
  
  pointer-events: none;
`,Ke=G`
  label: flow-circle;

  fill: var(--vis-graph-link-stroke-color);
  opacity: var(--vis-graph-link-flow-opacity);
`,to=G`
  label: label-group;
`,Vo=G`
  label: label-background;

  fill: var(--vis-graph-link-label-background);
`,Xt=G`
  label: label-content;

  font-size: var(--vis-graph-link-label-font-size);
  font-family: var(--vis-font-family);
  fill: var(--vis-graph-link-label-text-color);
  text-anchor: middle;
  dominant-baseline: var(--vis-graph-link-dominant-baseline);
  user-select: none;
`;Lt`
  :root {
    --vis-graph-icon-font-family: ${Gn};

    /* Brush */
    --vis-graph-brush-selection-opacity: 0.2;
  }
`;const Ua=G`
  label: graph-component;
`,un=G`
  label: background;
`,dn=G`
  label: graph-group;
`,Va=G`
  label: brush;

  :not(.active) {
    display: none;
  }

  .active {
    .selection {
      fill-opacity: 0;
      stroke: none;
    }

    .handle {
      display: none;
    }
  }
`,Xa=G`
  label: zoom-out-level-1;

  ${`.${Ge}`} {
    rect {
      stroke: none;
    }
  }
`,So=G`
  label: zoom-out-level-2;

  ${`.${Ge}`} {
    visibility: visible;
  }

  ${`.${Ae}`} {
    visibility: visible;
  }

  ${`.${xe}`} {
    stroke-width: 4px;
  }

  rect${`.${xe}`} {
    stroke-width: 2px;
  }

  ${`.${we}`} {
    animation: none;
    stroke-dasharray: none;
  }

  ${`.${Ke}`} {
    display: none;
  }

  ${`.${Me}`} {
    &${`.${Tt}`} {
      transform: scale(1.15);
    }
  }
`,hn=G`
  label: panels;
`;Lt`
  :root {
    --vis-graph-panel-border-color: #E6E9F3;
    --vis-graph-panel-border-opacity: 0.9;
    --vis-graph-panel-fill-color: #ffffff;

    --vis-graph-panel-label-color: #6c778c;
    --vis-graph-panel-label-background: #ffffff;

    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-graph-panel-label-font-family: */
    --vis-graph-panel-label-font-size: 10pt;
    --vis-graph-panel-label-font-weight: 300;

    --vis-graph-panel-dashed-outline-color: #b7b7b7;

    --vis-graph-panel-side-icon-symbol-color: #9ea7b8;
    --vis-graph-panel-side-icon-shape-fill-color: #ffffff;

    --vis-dark-graph-panel-border-color: var(--vis-color-grey);
    --vis-dark-graph-panel-fill-color: #292b34;
    --vis-dark-graph-panel-label-color: #E6E9F3;
    --vis-dark-graph-panel-label-background: var(--vis-color-grey);
    --vis-dark-graph-panel-side-icon-symbol-color: #ffffff;
    --vis-dark-graph-panel-side-icon-shape-fill-color: #6c778c;
    --vis-dark-graph-panel-border-color: #a0a6ad;
  }

  body.theme-dark ${`.${hn}`} {
    --vis-graph-panel-border-color: var(--vis-dark-graph-panel-border-color);
    --vis-graph-panel-fill-color: var(--vis-dark-graph-panel-fill-color);
    --vis-graph-panel-label-color: var(--vis-dark-graph-panel-label-color);
    --vis-graph-panel-label-background: var(--vis-dark-graph-panel-label-background);
    --vis-graph-panel-side-icon-symbol-color: var(--vis-dark-graph-panel-side-icon-symbol-color);
    --vis-graph-panel-side-icon-shape-fill-color: var(--vis-dark-graph-panel-side-icon-shape-fill-color);
    --vis-graph-panel-border-color:  var(--vis-dark-graph-panel-border-color);
  }
`;const oo=G`
  label: g-panel;
`,wo=G`
  label: panel;

  stroke: var(--vis-graph-panel-border-color);
  stroke-opacity: var(--vis-graph-panel-border-opacity);
  fill: var(--vis-graph-panel-fill-color);
`,No=G`
  label: label;

  fill: var(--vis-graph-panel-label-color);
`,Ya=G`
  label: background;

  opacity: 0.9;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  fill: var(--vis-graph-panel-label-background);
  stroke: none;
`,it=G`
  label: label-text;

  text-anchor: middle;
  font-size: var(--vis-graph-panel-label-font-size);
  font-weight: var(--vis-graph-panel-label-font-weight);;
  cursor: default;
  stroke: none;
  font-family: var(--vis-graph-panel-label-font-family, var(--vis-font-family));
`,fn=G`
  label: active;
`,$o=G`
  label: panel-selection-outline;

  opacity: 0;
  stroke-width: 1;
  stroke-dasharray: 3 3;
  fill: var(--vis-graph-node-selection-color);
  fill-opacity: 0.1;
  stroke: var(--vis-graph-panel-dashed-outline-color);
  stroke-opacity: 0;

  &${`.${fn}`} {
    opacity: 1;
    stroke-opacity: 0.75;
  }
`;G`
  label: greyout;
  opacity: 0.4;
`;const Lo=G`
  label: side-icon-group;
`,zo=G`
  label: side-icon-shape;

  fill: var(--vis-graph-panel-side-icon-shape-fill-color);
  stroke-width: 2px;
`,ja=G`
  label: side-icon-custom;
`,Eo=G`
  label: side-label-icon-text;
  font-family: var(--vis-graph-icon-font-family), var(--vis-font-family);
  fill: var(--vis-graph-panel-side-icon-symbol-color);
  stroke: none;
  dominant-baseline: middle;
  text-anchor: middle;
  pointer-events: none;
  cursor: default;
`,pn=["svg","g","path","rect","circle","ellipse","line","polyline","polygon","defs","clipPath","use","symbol","image","marker","style","mask",...Cn];function Za(e,t=pn){return Dn(e,t)}function Po(e){const t=new RegExp(`<(${pn.join("|")})\\b`,"i"),o=/\b(d|fill|stroke|transform|viewBox)=/i;return t.test(e)||o.test(e)}const At=30,Xo=10,no=4;function Ee(e,t,o){return Z(e,t,o)||At}function gn(e,t){e._animState={endAngle:0,nodeIndex:t}}function qa(e,t,o,n){var r;const{nodeStrokeWidth:a,nodeSize:s,nodeGaugeValue:i}=t;n._animState||gn(n,e._index);const l=lo(n._animState,{endAngle:2*Math.PI*((r=Z(e,i,e._index))!==null&&r!==void 0?r:0)/100,nodeIndex:e._index,nodeSize:Ee(e,s,e._index),borderWidth:Z(e,a,e._index)});return n._animState=l(0),c=>(n._animState=l(c),o(n._animState))}function Yt(e,t,o,n){var r;const{nodeShape:a,nodeGaugeValue:s}=t,i=Ee(e,t.nodeSize,e._index);let l;switch(K(e,a,e._index)){case ne.Square:l=4;break;case ne.Triangle:l=3;break;case ne.Hexagon:default:l=6}n._animState||gn(n,e._index);const c=lo(n._animState,{endAngle:2*Math.PI*((r=Z(e,s,e._index))!==null&&r!==void 0?r:0)/100,nodeIndex:e._index});return n._animState=c(0),p=>(n._animState=c(p),l===4?qn({x:-i/2,y:-i/2,w:i,h:i,r:5,score:n._animState.endAngle/(2*Math.PI)}):o(i,l,n._animState.endAngle,!0))}function Xe(e,t,o){const n=In(t),a=e.select(`.${o}`).node().getBBox();return e.select("rect").attr("visibility",n?"hidden":null).attr("rx",4).attr("ry",4).attr("x",-a.width/2-Xo).attr("y","-0.64em").attr("width",a.width+2*Xo).attr("height",a.height+2*no).style("transform",`translateY(${-no}px)`)}function fe(e){return e._state&&!yt(e._state.fx)?e._state.fx:e.x}function pe(e){return e._state&&!yt(e._state.fy)?e._state.fy:e.y}function jt(e){return typeof e=="number"?e:At}function ze(e,t){return ee(e||[],(o,n)=>Ee(o,t,n))||At}function Yo(e,t){return Bn(e||[],(o,n)=>Ee(o,t,n))||At}function mn(e,t){if(!e.color)return null;const o=Qo(e.color,t);return ho(o)>.65?"var(--vis-graph-node-side-label-fill-color-dark)":"var(--vis-graph-node-side-label-fill-color-bright)"}function bt(e,t,o){var n;return(n=uo(e,t,o,!0))!==null&&n!==void 0?n:null}function Ka(e,t,o,n){const r=bt(e,t,o);if(!r)return null;const a=Qo(r,n);return ho(a)>.65?"var(--vis-graph-node-icon-fill-color-dark)":"var(--vis-graph-node-icon-fill-color-bright)"}function ao(e){return/^#[^]+/.test(e)}function ct(e,t,o,n,r,a=":last-child"){e.each((s,i,l)=>{const c=V(l[i]),p=K(s,t,r);let d;const b=Po(p);if(b)d=c.insert("g",a).html(Za(p));else switch(p){case ne.Square:d=c.insert("rect",a).attr("rx",5).attr("ry",5);break;case ne.Hexagon:case ne.Triangle:d=c.insert("path",a);break;case ne.Circle:default:d=c.insert("circle",a)}return d.classed(n,b),d.attr("class",o)})}function io(e,t,o,n){if(e.size()===0)return;const r=e.datum(),a=Ee(r,o,n);e.filter("circle").attr("r",a/2),e.filter("rect").attr("width",a).attr("height",a).attr("x",-a/2).attr("y",-a/2),e.filter("path").attr("d",()=>{let s;switch(K(r,t,n)){case ne.Square:s=4;break;case ne.Triangle:s=3;break;case ne.Hexagon:default:s=6}return mt(a,s)}),e.filter("g").filter(()=>!Po(K(r,t,n))).html(K(r,t,n)),e.filter("g").each((s,i,l)=>{const c=V(l[i]),p=c.node().getBBox();c.attr("transform",`translate(${-p.width/2},${-p.height/2})`)})}var Se;(function(e){e[e.Level0=1]="Level0",e[e.Level1=.6]="Level1",e[e.Level2=.4]="Level2",e[e.Level3=.2]="Level3"})(Se||(Se={}));const Zt=10;function Qa(e,t,o,n=1){e.each((r,a,s)=>{const i=s[a],l=V(i);if(l.attr("transform",(d,b)=>{var N,x,T;const v=be(d,t.nodeEnterPosition,b),f=(N=Z(d,t.nodeEnterScale,b))!==null&&N!==void 0?N:0,E=(x=v?.[0])!==null&&x!==void 0?x:fe(d),m=(T=v?.[1])!==null&&T!==void 0?T:pe(d);return`translate(${E}, ${m}) scale(${f})`}).attr("opacity",0),t.nodeEnterCustomRenderFunction)t.nodeEnterCustomRenderFunction(r,l,t,o,n);else{const d=K(r,t.nodeShape,r._index);i.nodeShape=d,ct(l,d,xe,wt,r._index),ct(l,d,Me,wt,r._index),l.append("path").attr("class",Ae),l.append("g").attr("class",ut),l.append("g").attr("class",_o),l.append("text").attr("class",vo)}const c=l.append("g").attr("class",Ge);c.append("rect").attr("class",nn);const p=c.append("text").attr("class",Ve).attr("dy","0.32em");p.append("tspan").attr("class",Pt),p.append("tspan").attr("class",yo).attr("dy","1.1em").attr("x","0")})}function rt(e,t,o,n=1){const{nodeDisabled:r}=t;t.nodePartialUpdateCustomRenderFunction||t.nodeEnterCustomRenderFunction?e.each((a,s,i)=>{var l;const c=V(i[s]);(l=t.nodePartialUpdateCustomRenderFunction)===null||l===void 0||l.call(t,a,c,t,o,n)}):e.each((a,s,i)=>{const l=V(i[s]),c=Le(a,r,a._index)||a._state.greyout;l.classed(xo,c&&!a._state.brushed).classed(an,!t.disableDrag),l.selectAll(`.${Me}`).classed(Tt,a._state.selected||a._state.brushed),l.selectAll(`.${qe}`).style("fill",d=>c?null:mn(d,e.node())),l.selectAll(`.${Ze}`).style("fill",d=>c?null:d.color)})}function vn(e,t){return Q(e,t).attr("transform",o=>`translate(${fe(o)}, ${pe(o)}) scale(1)`).attr("opacity",1)}function et(e,t,o,n=1){const{nodeGaugeAnimDuration:r,nodeStrokeWidth:a,nodeShape:s,nodeSize:i,nodeGaugeValue:l,nodeGaugeFill:c,nodeIcon:p,nodeIconSize:d,nodeLabel:b,nodeLabelTrim:N,nodeLabelTrimMode:x,nodeLabelTrimLength:T,nodeSubLabel:v,nodeSubLabelTrim:f,nodeSubLabelTrimMode:E,nodeSubLabelTrimLength:m,nodeSideLabels:h,nodeStroke:w,nodeFill:L,nodeBottomIcon:F}=t,A=vn(e,o);return t.nodeUpdateCustomRenderFunction?(e.each((_,I,B)=>{const O=V(B[I]);t.nodeUpdateCustomRenderFunction(_,O,t,o,n)}),rt(e,t,o,n),A):(e.each((_,I,B)=>{const O=B[I],H=V(O),u=K(_,s,_._index);O.nodeShape!==u&&(H.select(`.${xe}`).remove(),ct(H,s,xe,wt,_._index,`.${Me}`),H.select(`.${Me}`).remove(),ct(H,u,Me,null,_._index,`.${Ae}`),O.nodeShape=u)}),e.each((_,I,B)=>{var O,H,u;const y=B[I],g=V(y),S=g.select(`.${xe}`),P=g.select(`.${Ae}`),z=g.select(`.${ut}`),k=g.select(`.${_o}`),$=g.select(`.${Ge}`),M=$.select(`.${Pt}`),W=$.select(`.${yo}`),D=g.select(`.${vo}`),U=g.select(`.${Me}`),j=Ee(_,i,_._index),X=Kn().innerRadius(R=>R.nodeSize/2-R.borderWidth/2).outerRadius(R=>R.nodeSize/2+R.borderWidth/2).startAngle(0*(Math.PI/180)).endAngle(R=>R.endAngle);g.classed(So,n<Se.Level2).classed(bo,R=>R._state.isDragged),g.classed(rn,()=>{const R=K(_,s,_._index);return R===ne.Triangle||R===ne.Hexagon||R===ne.Square}),S.call(io,s,i,_._index).attr("stroke-width",(O=Z(_,a,_._index))!==null&&O!==void 0?O:0).style("fill",bt(_,L,_._index)).style("stroke",(H=uo(_,w,_._index,!0))!==null&&H!==void 0?H:null);const q=S.node().getBBox();P.attr("stroke-width",Z(_,a,_._index)).style("display",Z(_,l,_._index)?null:"none").style("fill",bt(_,c,_._index)).style("stroke",bt(_,c,_._index)).style("stroke-opacity",R=>K(R,s,R._index)===ne.Circle?0:null),P.transition().duration(r).attrTween("d",(R,J,ye)=>{switch(K(R,s,R._index)){case ne.Circle:return qa(R,t,X,ye[J]);case ne.Hexagon:return Yt(R,t,mt,ye[J]);case ne.Square:return Yt(R,t,mt,ye[J]);case ne.Triangle:return Yt(R,t,mt,ye[J]);default:return null}}),io(U,s,i,_._index);const te=y.nodeIcon,oe=K(_,p,_._index),ie=(u=Z(_,d,_._index))!==null&&u!==void 0?u:2.5*Math.sqrt(j),ge=Ka(_,L,_._index,e.node()),ae=ao(oe);te!==oe&&(z.selectAll("*").remove(),z.append(ae?"use":"text"),y.nodeIcon=oe),ae?z.select("use").attr("href",oe).attr("x",-ie/2).attr("y",-ie/2).attr("width",ie).attr("height",ie).style("fill",ge):z.select("text").style("font-size",`${ie}px`).attr("dy","0.1em").style("fill",ge).html(oe);const he=be(_,h,_._index)||[],re=k.selectAll("g").data(he),me=re.enter().append("g").attr("class",ko);me.append("circle").attr("class",Ze).attr("r",R=>{var J;return(J=R.radius)!==null&&J!==void 0?J:Zt}),me.append("text").attr("class",qe);const C=re.merge(me).style("cursor",R=>{var J;return(J=R.cursor)!==null&&J!==void 0?J:null});C.select(`.${qe}`).html(R=>R.text).attr("dy","0.1em").style("fill",R=>{var J;return(J=R.textColor)!==null&&J!==void 0?J:mn(R,e.node())}).style("font-size",R=>{var J,ye;return(J=R.fontSize)!==null&&J!==void 0?J:`${(2+((ye=R.radius)!==null&&ye!==void 0?ye:Zt))/Math.pow(R.text.toString().length,.3)}px`}),C.select(`.${Ze}`).style("fill",R=>R.color),C.attr("transform",(R,J)=>{var ye;if(he.length===1)return`translate(${j/2.5}, ${-j/2.5})`;const Ft=1.05*j/2,Mo=J*1.15*2*Math.atan2((ye=R.radius)!==null&&ye!==void 0?ye:Zt,Ft)-Math.PI/3;return`translate(${Ft*Math.cos(Mo)}, ${Ft*Math.sin(Mo)})`}),re.exit().remove();const Y=K(_,b,_._index),se=K(_,v,_._index),ce=Le(_,N,_._index)?_t(Y,Z(_,T,_._index),be(_,x,_._index)):Y,Re=Le(_,f,_._index)?_t(se,Z(_,m,_._index),be(_,E,_._index)):se;M.text(ce),W.text(Re),g.on("mouseenter",()=>{M.text(Y),W.text(se),Xe($,Y,Ve),g.raise()}).on("mouseleave",()=>{M.text(ce),W.text(Re),Xe($,ce,Ve)});const Ce=Jo("var(--vis-graph-node-label-font-size)",y)||12,En=no+1.25*Math.pow(Ce,1.03),To=Po(K(_,s,_._index))?q.height:j;$.attr("transform",`translate(0, ${To/2+En})`),n>=Se.Level3&&Xe($,K(_,b,_._index),Ve),D.html(K(_,F,_._index)).attr("transform",`translate(0, ${To/2})`)}),rt(e,t,o,n),A)}function Ja(e,t,o,n=1){Q(e,o/2).attr("opacity",0).attr("transform",(r,a)=>{var s,i,l;const c=be(r,t.nodeExitPosition,a),p=(s=Z(r,t.nodeExitScale,a))!==null&&s!==void 0?s:0,d=(i=c?.[0])!==null&&i!==void 0?i:fe(r),b=(l=c?.[1])!==null&&l!==void 0?l:pe(r);return`translate(${d}, ${b}) scale(${p})`}).remove(),t.nodeExitCustomRenderFunction&&e.each((r,a,s)=>{const i=V(s[a]);t.nodeExitCustomRenderFunction(r,i,t,o,n)})}function ei(e,t){const{nodeLabel:o}=t;e.each((n,r,a)=>{const i=V(a[r]).select(`.${Ge}`);Xe(i,K(n,o,r),Ve)})}const ti=fo(ei,1e3);function bn(e,t,o){t.nodeOnZoomCustomRenderFunction||t.nodeEnterCustomRenderFunction?e.each((n,r,a)=>{var s;const i=V(a[r]);(s=t.nodeOnZoomCustomRenderFunction)===null||s===void 0||s.call(t,n,i,t,o)}):(e.classed(Xa,o<Se.Level1),e.classed(So,o<Se.Level2),e.selectAll(`${Ze}`).attr("transform",`scale(${1/Math.pow(o,.35)})`),e.selectAll(`.${qe}`).attr("transform",`scale(${1/Math.pow(o,.45)})`),o>=Se.Level3&&e.call(ti,t))}const oi=fo(bn,500),Ie=9,Nt=7;function ni(e,t){const o=e.source,n=e.target,r=Math.atan2(pe(n)-pe(o),fe(n)-fe(o))-Math.PI/2,a=Math.cos(r)*t*e._direction*(e._index-(e._neighbours-1)/2),s=Math.sin(r)*t*e._direction*(e._index-(e._neighbours-1)/2);return{dx:a,dy:s}}function yn(e,t){const{dx:o,dy:n}=ni(e,t);return`translate(${o}, ${n})`}function _n(e,t,o){return Z(e,o.linkWidth,e._indexGlobal)/Math.pow(t,.5)}function $t(e,t,o){const{nodeSize:n,linkBandWidth:r}=o,a=Z(e.source,n,e.source._index),s=Z(e.target,n,e.target._index),i=Math.min(a,s);return Math.min(i,Z(e,r,e._indexGlobal)/Math.pow(t||1,.5))||0}function kn(e,t){var o;const{linkStroke:n}=t;return((o=uo(e,n,e._indexGlobal,!0))!==null&&o!==void 0?o:"var(--vis-graph-link-stroke-color)")||null}function xn(e,t){const o=be(e,t.linkArrow,e._indexGlobal);if(o)return o===Ye.Double?o:Ye.Single}function ai(){return`M${-Ie/2},${-Nt/2} V${Nt/2} L${Ie/2},0 Z`}function ii(){return`M${-Ie/2},0 L${Ie/2},${-Nt/2} L${Ie*1.5},0 L${Ie/2},${Nt/2} Z`}function ri(e){if(!e.color)return null;const t=Rn(e.color).hex();return ho(t)>.65?"var(--vis-graph-link-label-text-color-dark)":"var(--vis-graph-link-label-text-color-bright)"}function si(e){e.attr("opacity",0),e.append("path").attr("class",dt),e.append("path").attr("class",Fe),e.append("path").attr("class",lt),e.append("use").attr("class",ln),e.append("g").attr("class",Mt).style("opacity",0).selectAll(`.${Ke}`).data(Qn(0,6)).enter().append("circle").attr("class",Ke)}function Sn(e,t,o){const n=(r,a)=>Le(r,t.linkDisabled,a)||r._state.greyout;e.classed(cn,(r,a)=>n(r,a)),e.each((r,a,s)=>{const i=s[a],l=V(i);l.select(`.${Fe}`),l.select(`.${lt}`),l.select(`.${dt}`).style("stroke-opacity",r._state.hovered||r._state.selected?.2:0).style("stroke-width",r._state.selected?$t(r,o,t)+5:r._state.hovered?$t(r,o,t)+10:null)})}function wn(e,t,o,n=1,r,a){return e.each((s,i,l)=>{var c;const p=l[i],d=V(p),b=d.select(`.${Fe}`),N=d.select(`.${lt}`),x=d.select(`.${dt}`),T=d.select(`.${ln}`),v=kn(s,t),f=yn(s,t.linkNeighborSpacing),E=en(be(s,t.linkLabel,s._indexGlobal)),m=be(s,t.linkSourcePointOffset,i),h=be(s,t.linkTargetPointOffset,i),w=fe(s.source)+(m?.[0]||0),L=pe(s.source)+(m?.[1]||0),F=fe(s.target)+(h?.[0]||0),A=pe(s.target)+(h?.[1]||0),_=(c=Z(s,t.linkCurvature,i))!==null&&c!==void 0?c:0,I=w+(F-w)*.5*_,B=L+(A-L)*0*_,O=w+(F-w)*.5*_,H=L+(A-L)*1*_,u=`M${w},${L} C${I},${B} ${O},${H} ${F},${A}`,y=x.attr("d",u).node(),g=a.get(u),S=g??y.getTotalLength();g||a.set(u,S),x.style("stroke",v).attr("transform",f),b.attr("class",Fe).style("stroke-width",_n(s,n,t)).style("stroke",v).attr("transform",f),Q(b,o).attr("d",u),N.attr("class",lt).attr("transform",f).style("stroke-width",$t(s,n,t)).style("stroke",v),Q(N,o).attr("d",u);const P=xn(s,t);if(P){const z=S*(E.length?.65:.5),k=y.getPointAtLength(z),$=y.getPointAtLength(z+1),M=Math.atan2($.y-k.y,$.x-k.x)*(180/Math.PI),W=T.attr("href");T.attr("href",`#${r(P)}`),Q(T,W?o:0).attr("fill",v).attr("transform",`translate(${k.x}, ${k.y}) rotate(${M})`)}else T.attr("href",null)})}function qt(e,t,o,n=1,r,a){const{linkStyle:s,linkFlow:i,linkLabel:l,linkLabelShiftFromCenter:c}=t;e.size()&&(e.classed(Wa,p=>be(p,s,p._indexGlobal)===St.Dashed),wn(e,t,o,n,r,a),e.each((p,d,b)=>{const N=b[d],x=V(N),T=x.select(`.${Mt}`),f=x.select(`.${dt}`).node(),E=kn(p,t),m=yn(p,t.linkNeighborSpacing),h=en(be(p,l,p._indexGlobal)),w=Z(p,t.linkFlowParticleSize,p._indexGlobal);T.attr("transform",m).style("display",Le(p,i,p._indexGlobal)?null:"none"),T.selectAll(`.${Ke}`).attr("r",w/Math.sqrt(n)).style("fill",E),Q(T,o).style("opacity",n<Se.Level2?0:1);const L=h.map(y=>{var g,S,P;const z=((g=y.text)===null||g===void 0?void 0:g.toString())||"",k=ao(z),$=(S=On(y.fontSize))!==null&&S!==void 0?S:Jo("var(--vis-graph-link-label-font-size)",x.node()),M=z.length<=2||k,W=4,D=M?W:8,U=Hn(z,$);return Object.assign(Object.assign({},y),{_shouldRenderUseElement:k,_fontSizePx:$,_shouldBeRenderedAsCircle:M,_paddingVertical:W,_paddingHorizontal:D,_estimatedWidthPx:U,_borderRadius:(P=y.radius)!==null&&P!==void 0?P:M?$:4,_backgroundWidth:(M?$:U)+D*2,_backgroundHeight:$+W*2})}),F=x.selectAll(`.${to}`).data(L,y=>y.text),A=F.enter().append("g").attr("class",to);A.each((y,g,S)=>{var P;const z=V(S[g]);z.append("rect").attr("class",Vo);const k=y?(P=y.text)===null||P===void 0?void 0:P.toString():void 0,$=ao(k);z.select(`.${Xt}`).remove(),z.append($?"use":"text").attr("class",Xt)}),A.style("opacity",0);const _=F.merge(A),I=1;let B=-Wn(L,y=>y._backgroundWidth+I)/2;const O=a.get(f.getAttribute("d")),H=O??f.getTotalLength(),u=xn(p,t);_.each((y,g,S)=>{var P,z;const k=S[g],$=V(k),M=(P=y.text)===null||P===void 0?void 0:P.toString(),W=$.select(`.${Xt}`),D=u?Ie*2:0,U=Le(p,c,p._indexGlobal)?-D+4:0,j=f.getPointAtLength(H/2+U+B+y._backgroundWidth/2),X=`translate(${j.x}, ${j.y})`,q=$.select(`.${Vo}`);$.attr("transform")||$.attr("transform",`${X} scale(0)`);const te=(z=y.textColor)!==null&&z!==void 0?z:ri(y);y._shouldRenderUseElement?W.attr("href",M).attr("x",-y._fontSizePx/2).attr("y",-y._fontSizePx/2).attr("width",y._fontSizePx).attr("height",y._fontSizePx).style("color",te):W.text(M).attr("dy","0.1em").style("font-size",y._fontSizePx).style("fill",te),$.attr("hidden",null).style("cursor",y.cursor),Q($,o).attr("transform",`${X} scale(1)`).style("opacity",1),q.attr("x",-y._backgroundWidth/2).attr("y",-y._backgroundHeight/2).attr("width",y._backgroundWidth).attr("height",y._backgroundHeight).attr("rx",y._borderRadius).style("fill",y.color),B+=y._backgroundWidth+I}),Q(F.exit(),o).style("opacity",0).remove()}),o>0?(e.attr("pointer-events","none"),Q(e,o).attr("opacity",1).on("end interrupt",(d,b,N)=>{V(N[b]).attr("pointer-events","stroke").attr("opacity",1)})):e.attr("opacity",1),Sn(e,t,n))}function li(e,t,o){Q(e,o/2).attr("opacity",0).remove()}function jo(e,t,o,n){const{linkFlow:r}=t;o<Se.Level2||e.each((a,s,i)=>{const l=i[s],c=V(l),p=c.select(`.${Mt}`),d=c.select(`.${Fe}`).node(),b=n.get(d.getAttribute("d")),N=b??d.getTotalLength();if(!Le(a,r,a._indexGlobal)||!N)return;const x=a._state.flowAnimDistanceRelative,T=p.selectAll(`.${Ke}`);T.attr("transform",v=>{const f=(x+ +v/(T.size()-1))%1,E=d.getPointAtLength(f*N);return`translate(${E.x}, ${E.y})`})})}function Nn(e,t,o){e.classed(So,o<Se.Level2),e.select(`.${Mt}`).style("opacity",o<Se.Level2?0:1),e.each((a,s,i)=>{const l=Z(a,t.linkFlowParticleSize,a._indexGlobal)/Math.sqrt(o);V(i[s]).selectAll(`.${Ke}`).attr("r",l)}),e.selectAll(`.${Fe}`).style("stroke-width",a=>_n(a,o,t)),e.selectAll(`.${lt}`).style("stroke-width",a=>$t(a,o,t))}const ci=fo(Nn,500),pt=15,ui=16,De=5,Zo=25;function di(e){var t,o,n,r;const a=kt(e);return{left:(t=a?e.left:e)!==null&&t!==void 0?t:pt,right:(o=a?e.right:e)!==null&&o!==void 0?o:pt,top:(n=a?e.top:e)!==null&&n!==void 0?n:pt,bottom:(r=a?e.bottom:e)!==null&&r!==void 0?r:pt}}function hi(e){return(e??[]).map(o=>Object.assign(Object.assign({},o),{_padding:di(o.padding)}))}function fi(e,t,o){e&&t.forEach(n=>{const r=e.filter(a=>a.nodes&&a.nodes.includes(n._id));n._panels=r})}function pi(e,t,o,n){const r=t.select(`.${xe}`);if(r.empty())return;const a=40,s=110,i=10;let l;r.each((c,p)=>{const d=Ee(c,o,p),b=Math.max(d,s),N=d+i+a,x=10,T={x1:fe(c)-b/2,y1:pe(c)-N/2+x,x2:fe(c)+b/2,y2:pe(c)+N/2+x};l?(l.x1>T.x1&&(l.x1=T.x1),l.y1>T.y1&&(l.y1=T.y1),l.x2<T.x2&&(l.x2=T.x2),l.y2<T.y2&&(l.y2=T.y2)):l=Object.assign({},T)}),e._x=l.x1-e._padding.left,e._y=l.y1-e._padding.top,e._width=l.x2-l.x1+e._padding.left+e._padding.right,e._height=l.y2-l.y1+e._padding.top+e._padding.bottom,e._disabled=r.data().map((c,p)=>Le(c,n,c._index)||c._state.greyout).every(c=>c)}function gi(e,t){e._numNodes=t.size()}function mi(e,t,o){const{layoutNonConnectedAside:n}=o;t&&t.forEach(r=>{const a=e.filter(s=>(!n||s._isConnected)&&r.nodes.includes(s._id));pi(r,a,o.nodeSize,o.nodeDisabled)})}function vi(e,t,o){const{layoutNonConnectedAside:n}=o;t&&t.forEach(r=>{const a=e.filter(s=>(!n||s._isConnected)&&r.nodes.includes(s._id));gi(r,a)})}function $n(e){const t=e._width/2,o=ui+(e.dashedOutline?De:0),n=e.labelPosition===Jn.Bottom?e._height+o:-o;return`translate(${t}, ${n})`}function bi(e){e.attr("transform",n=>`translate(${n._x}, ${n._y})`).style("opacity",0),e.append("rect").attr("class",$o).attr("rx",9).attr("ry",9).attr("width",n=>n._width).attr("height",n=>n._height),e.append("rect").attr("class",wo).attr("rx",7).attr("ry",7).attr("width",n=>n._width).attr("height",n=>n._height);const t=e.append("g").attr("class",No).attr("transform",$n);t.append("rect").attr("class",Ya),t.append("text").attr("class",it).attr("dy","0.32em");const o=e.append("g").attr("class",Lo).attr("transform",(n,r,a)=>{const s=-De;return`translate(${n._width+s}, 5)`});ct(o,n=>n.sideIconShape,zo,ja),o.append("text").attr("class",Eo)}function yi(e,t,o){Q(e,o).attr("transform",i=>`translate(${i._x}, ${i._y})`).style("opacity",i=>i._disabled?.4:1);const n=e.selectAll(`.${wo}`).data(i=>[i]);Q(n,o).attr("width",i=>i._width).attr("height",i=>i._height).style("stroke",i=>i.borderColor).style("fill",i=>i.fillColor).style("stroke-width",i=>i.borderWidth);const r=e.select(`.${$o}`).classed(fn,i=>i.dashedOutline);Q(r,o).attr("x",i=>-De).attr("y",i=>-De).attr("width",i=>i._width+De*2).attr("height",i=>i._height+De*2);const a=e.select(`.${Lo}`);a.select(`.${zo}`).call(io,i=>i.sideIconShape,i=>{var l;return(l=i.sideIconShapeSize)!==null&&l!==void 0?l:Zo}).style("stroke",i=>i.sideIconShapeStroke).style("cursor",i=>{var l;return(l=i.sideIconCursor)!==null&&l!==void 0?l:null}).style("opacity",i=>i.sideIconShape?1:0),a.select(`.${Eo}`).html(i=>i.sideIconSymbol).attr("dy",1).style("fill",i=>i.sideIconSymbolColor).style("font-size",i=>{var l,c;return(l=i.sideIconFontSize)!==null&&l!==void 0?l:((c=i.sideIconShapeSize)!==null&&c!==void 0?c:Zo)/2.5}),Q(a,o).attr("transform",i=>{const l=-De;return`translate(${i._width+l}, 5)`});const s=e.select(`.${No}`);s.select(`.${it}`).text(i=>_t(i.label,i.labelTrimLength,i.labelTrimMode)),Q(s,o).attr("transform",$n),s.on("mouseover",(i,l)=>{const c=V(i.currentTarget),p=l.label;c.select("text").text(p),Xe(c,p,it)}).on("mouseleave",(i,l)=>{const c=V(i.currentTarget),p=_t(l.label,l.labelTrimLength,l.labelTrimMode);c.select("text").text(p),Xe(c,p,it)})}function _i(e,t,o){Q(e,o/2).style("opacity",0).remove()}const ro={hierarchyHandling:"INCLUDE_CHILDREN","nodePlacement.strategy":"NETWORK_SIMPLEX","elk.padding":"[top=15.0,left=15.0,bottom=15.0,right=15.0]","spacing.nodeNodeBetweenLayers":"50","spacing.edgeNodeBetweenLayers":"50","spacing.nodeNode":"10"};function Qe(e,t,o,n,r=0){e.forEach((a,s)=>{const i=o/2+s*o,l=n?Math.floor(i/n):0;a.y=t+l*o||0,a.x=n?i%n+r:i+r})}function Ln(e,t){return e instanceof Map?Array.from(e.entries()).map(([n,r])=>{const a=Ln(r,t);if(n){const s=kt(t)?Kt(ro,t):Kt(ro,be(n,t));return{id:n,layoutOptions:s,children:a}}else return a}).flat():e}function zn(e){var t,o;const n=e.x,r=e.y;(t=e.edges)===null||t===void 0||t.forEach(a=>{var s,i;(s=a.sections)===null||s===void 0||s.forEach(l=>{var c;l.startPoint.x+=n,l.startPoint.y+=r,l.endPoint.x+=n,l.endPoint.y+=r,(c=l.bendPoints)===null||c===void 0||c.forEach(p=>{p.x+=n,p.y+=r})}),(i=a.labels)===null||i===void 0||i.forEach(l=>{l.x+=n,l.y+=r})}),(o=e.children)===null||o===void 0||o.forEach(a=>{a.x+=n,a.y+=r,zn(a)})}function ki(e,t,o,n){const{nonConnectedNodes:r,connectedNodes:a,nodes:s}=e,{layoutNonConnectedAside:i,nodeSize:l}=t,c=o,p=n,d=i?a:s,b=ze(d,l),N=p/b,x=N<d.length/2?d.length/2/N:1,T=c/b,v=T<d.length/2?d.length/2/T:1,f=Math.max(v,x);if(d.forEach((E,m)=>{const h=f*c/2,w=f*p/2,L=2*m*Math.PI/d.length;E.x=c/2+h*Math.cos(L),E.y=p/2+w*Math.sin(L)}),i){const E=ze(r,l),m=ee(a.map(F=>F.y)),h=ee(a.map(F=>F.x)),w=ke(a.map(F=>F.x)),L=h-w;Qe(r,m+E*3,E*2.25,Math.max(L,o),w)}}function qo(e,t,o,n,r){var a,s,i,l;const{nonConnectedNodes:c,connectedNodes:p,nodes:d}=e,{layoutNonConnectedAside:b,layoutGroupOrder:N,layoutParallelSortConnectionsByGroup:x,layoutParallelNodesPerColumn:T,layoutParallelSubGroupsPerRow:v,nodeSize:f,layoutNodeGroup:E,layoutParallelNodeSubGroup:m,layoutParallelGroupSpacing:h,layoutParallelNodeSpacing:w,layoutParallelSubGroupSpacing:L}=t,F=o-jt(f),A=n-jt(f)-(c.length?jt(f)*5:0),_=b?p:d,I=tn(_.map(k=>K(k,E,k._index))),O=on(I,k=>N.indexOf(k)).map(k=>{const $=_.filter(D=>K(D,E,D._index)===k),M=Un($,D=>K(D,m,D._index)),W=Object.keys(M).map(D=>({nodes:M[D],name:D}));return{name:k,nodes:$,subgroups:W}}),H=O.find(k=>k.name===x);if(H){const k={};let $=0;H.subgroups.forEach(M=>{M.nodes.forEach(W=>{W.links.forEach(D=>{const U=D?.target._id;k[U]=$,$=$+1})})}),Ko(O,H).forEach(M=>{M.subgroups.forEach(W=>{W.nodes.sort((D,U)=>(k[D._id]||0)-(k[U._id]||0))})})}const u=ee(O,k=>{var $;return($=k.nodes)===null||$===void 0?void 0:$.length}),y=40,g=10,S=L??0,P=ze(_,f),z=Vn(w)?w:[w,w];if(r==="horizontal"){const k=2*P+g,$=3.5*P+g,M=(a=z[0])!==null&&a!==void 0?a:tt(F/(u-1),k,$),W=P*4+y,D=P*1.5+y,U=h??tt(A/(O.length-1),D,W),j=(s=z[1])!==null&&s!==void 0?s:P+y+g;let X=O.length<2?n/2:0;O.forEach(q=>{let te=0,oe=0,ie=0,ge=0,ae=0,he=0;q.subgroups.forEach(re=>{const me=Math.ceil(re.nodes.length/T);let C=0,Y=te,se=X+oe;re.nodes.forEach(Ce=>{Y=Y+M,Ce.x=Y,Ce.y=se,ge=Math.max(ge,Y),C=C+1,C>=T&&(C=0,se+=j,Y=te)});const ce=Math.min(re.nodes.length,T)*M,Re=me*j;ie=Math.max(ie,ce),oe=oe+Re+S,he=he+1,he>=v&&(he=0,oe=0,te=te+ie+S,ie=0),ae=Math.max(ae,se)}),q.subgroups.forEach(re=>{re.nodes.forEach(me=>{me.x-=ge/2})}),ge=0,X=ae+U})}else{const k=6*P+g,$=10*P+g,M=h??tt(F/(u-1),k,$),W=P*2+y,D=P*1.5+y,U=(i=z[1])!==null&&i!==void 0?i:tt(A/(O.length-1),D,W),j=(l=z[0])!==null&&l!==void 0?l:P*2;let X=O.length<2?o/2:0;O.forEach(q=>{let te=0,oe=0,ie=0,ge=0,ae=0,he=0;q.subgroups.forEach(re=>{const me=Math.ceil(re.nodes.length/T);let C=0,Y=te,se=X+oe;re.nodes.forEach(Ce=>{Y=Y+U,Ce.x=se,Ce.y=Y,ae=Math.max(ae,Y),C=C+1,C>=T&&(C=0,se+=j,Y=te)});const ce=Math.min(re.nodes.length,T)*U,Re=me*j;ie=Math.max(ie,ce),oe=oe+Re+S,he=he+1,he>=v&&(he=0,oe=0,te=te+ie+S,ie=0),ge=Math.max(ge,se)}),q.subgroups.forEach(re=>{re.nodes.forEach(me=>{me.y-=ae/2})}),ae=0,X=ge+M})}if(b){const k=ze(c,f),$=ee(p.map(U=>U.y))||0,M=ee(p.map(U=>U.x))||0,W=ke(p.map(U=>U.x))||0,D=M-W||o;Qe(c,$+k*3,k*2.25,Math.max(D,o))}}function xi(e,t,o){return Et(this,void 0,void 0,function*(){const{nonConnectedNodes:n,connectedNodes:r,nodes:a,links:s}=e,{nodeSize:i,layoutNonConnectedAside:l,dagreLayoutSettings:c,nodeStrokeWidth:p,nodeLabel:d}=t,{Graph:b}=yield xt(()=>import("./CrmhTS-U.js"),__vite__mapDeps([0,1,2]),import.meta.url),{layout:N}=yield xt(()=>import("./7sANiKVT.js"),__vite__mapDeps([3,1,2]),import.meta.url),x=new b;x.setGraph(c),x.setDefaultEdgeLabel(()=>({}));const T=40;if((l?r:a).forEach(f=>{x.setNode(`${f._index}`,{label:K(f,d,f._index),width:Z(f,i,f._index)*1.5+Z(f,p,f._index),height:T+Z(f,i,f._index)*1.5,originalNode:f})}),s.forEach(f=>{x.setEdge(`${f.source._index}`,`${f.target._index}`)}),N(x),x.nodes().forEach(f=>{const E=x.node(f);E.originalNode.x=E.x,E.originalNode.y=E.y}),l){const f=ze(n,i),E=ee(r.map(L=>L.y)),m=ee(r.map(L=>L.x)),h=ke(r.map(L=>L.x)),w=m-h;Qe(n,E+f*3,f*2.25,Math.max(w,o),0)}})}function Si(e,t,o,n){var r,a;const{nonConnectedNodes:s,connectedNodes:i,nodes:l}=e,{layoutNonConnectedAside:c,layoutGroupOrder:p,nodeSize:d,layoutNodeGroup:b}=t,N=c?i:l,x=tn(N.map(m=>K(m,b,m._index))),v=on(x,m=>p.indexOf(m)).map(m=>({name:m,nodes:N.filter(h=>K(h,b,h._index)===m)}));let f=2*Yo((a=(r=v[0])===null||r===void 0?void 0:r.nodes)!==null&&a!==void 0?a:[],d);const E=o/n;if(v.forEach((m,h)=>{const w=Yo(m.nodes,d),L=1.1*w*m.nodes.length/Math.PI;f<L&&(f=L),m.nodes.forEach((A,_)=>{if(h===0&&m.nodes.length===1)A.x=o/2,A.y=n/2;else{let I=0;h===0&&m.nodes.length===3&&(I=Math.PI/6),h===0&&m.nodes.length===4&&(I=Math.PI/4);const B=2*_*Math.PI/m.nodes.length+h*Math.PI/12+I;A.x=o/2+f*Math.cos(B)*E,A.y=n/2+f*Math.sin(B)}});const F=w*3;f+=F}),c){const m=ze(s,d),h=ee(i.map(A=>A.y)),w=ee(i.map(A=>A.x)),L=ke(i.map(A=>A.x)),F=w-L;Qe(s,h+m*3,m*2.25,F,L)}}function wi(e,t,o){var n;return Et(this,void 0,void 0,function*(){const{layoutNonConnectedAside:r,forceLayoutSettings:a,nodeSize:s}=t,{forceSimulation:i,forceLink:l,forceManyBody:c,forceX:p,forceY:d,forceCollide:b}=yield xt(()=>import("./CiBI_nO0.js"),__vite__mapDeps([4,5,6,7,8]),import.meta.url),{nonConnectedNodes:N,connectedNodes:x,nodes:T,links:v}=e;a.fixNodePositionAfterSimulation?T.forEach(m=>{m.fx=yt(m._state.fx)?void 0:m._state.fx,m.fy=yt(m._state.fy)?void 0:m._state.fy}):T.forEach(m=>{delete m._state.fx,delete m._state.fy});const f=i(r?x:T).force("link",l(v).id(m=>String(m._id)).distance((m,h)=>Te(a.linkDistance)?a.linkDistance(m,h):a.linkDistance).strength((m,h)=>Te(a.linkStrength)?a.linkStrength(m,h):a.linkStrength)).force("charge",c().strength((m,h)=>{if(Te(a.charge))return a.charge(m,h);{const w=v.reduce((L,F)=>L+ +(F.source===m||F.target===m),0);return a.charge*Math.sqrt(w)}})).force("x",p().strength(a.forceXStrength)).force("y",d().strength(a.forceYStrength)).force("collide",b().radius((m,h)=>Ee(m,s,h)).iterations(1)).stop(),E=(n=a.numIterations)!==null&&n!==void 0?n:Math.ceil(Math.log(f.alphaMin())/Math.log(1-f.alphaDecay()));for(let m=0,h=E;m<h;++m)f.tick();if(a.fixNodePositionAfterSimulation&&T.forEach(m=>{delete m.fx,delete m.fy,m._state.fx=m.x,m._state.fy=m.y}),r){const m=ze(N,s),h=ee(x.map(A=>A.y)),w=ee(x.map(A=>A.x)),L=ke(x.map(A=>A.x)),F=w-L;Qe(N,h+m*6,m*2.25,Math.max(F,o),L)}})}function Ni(e,t,o){return Et(this,void 0,void 0,function*(){const n=(yield xt(()=>import("./Bj1LfWpk.js").then(d=>d.e),__vite__mapDeps([9,6]),import.meta.url)).default,r=new n,a=30,s=e.nodes.map((d,b)=>Object.assign(Object.assign(Object.assign({},d),{id:d._id,width:Z(d,t.nodeSize,d._index)+Z(d,t.nodeStrokeWidth,d._index),height:Z(d,t.nodeSize,d._index)+a}),t.layoutElkGetNodeShape?t.layoutElkGetNodeShape(d,b):{}));let i;if(t.layoutElkNodeGroups){const d=t.layoutElkNodeGroups.map(N=>x=>K(x,N,x._index)),b=ca(s,...d);i=Ln(b,t.layoutElkSettings)}else i=s;const l="root",c={id:l,layoutOptions:Kt(ro,be(l,t.layoutElkSettings)),children:i,edges:e.links.map(d=>({id:d._id,sources:[d.source._id],targets:[d.target._id]}))},p=yield r.layout(c);if(zn(p),s.forEach((d,b)=>{const N=e.nodes.find(x=>x._id===d.id);N&&(N.x=d.x+d.width/2,N.y=d.y+d.height/2)}),t.layoutNonConnectedAside){const d=ze(e.nonConnectedNodes,t.nodeSize),b=ee(e.connectedNodes.map(v=>v.y))||0,N=ee(e.connectedNodes.map(v=>v.x))||0,x=ke(e.connectedNodes.map(v=>v.x))||0,T=N-x||o;Qe(e.nonConnectedNodes,b+d*3,d*2.25,Math.max(T,o))}})}class Be extends Xn{constructor(t){super(),this._defaultConfig=Ra,this.config=this._defaultConfig,this.datamodel=new Ba,this._isFirstRender=!0,this._shouldRecalculateLayout=!1,this._shouldSetPanels=!1,this._isAutoFitDisabled=!1,this._isDragging=!1,this._linkPathLengthMap=new Map,this._linkFlowFrameElapsed=0,this.events={[Be.selectors.background]:{click:this._onBackgroundClick.bind(this)},[Be.selectors.node]:{click:this._onNodeClick.bind(this),mouseover:this._onNodeMouseOver.bind(this),mouseout:this._onNodeMouseOut.bind(this)},[Be.selectors.link]:{click:this._onLinkClick.bind(this),mouseover:this._onLinkMouseOver.bind(this),mouseout:this._onLinkMouseOut.bind(this)}},t&&this.setConfig(t),this._backgroundRect=this.g.append("rect").attr("class",un),this._graphGroup=this.g.append("g").attr("class",dn),this._brush=this.g.append("g").attr("class",Va),this._zoomBehavior=Ia().scaleExtent(this.config.zoomScaleExtent).on("zoom",o=>this._onZoom(o.transform,o)).on("start",o=>this._onZoomStart(o.transform,o)).on("end",o=>this._onZoomEnd(o.transform,o)),this._brushBehavior=Pa().on("start brush end",this._onBrush.bind(this)).filter(o=>o.shiftKey).keyModifiers(!1),this._panelsGroup=this._graphGroup.append("g").attr("class",hn),this._linksGroup=this._graphGroup.append("g").attr("class",sn),this._nodesGroup=this._graphGroup.append("g").attr("class",mo),this._defs=this._graphGroup.append("defs"),this._getLinkArrowDefId=this._getLinkArrowDefId.bind(this)}get selectedNode(){var t;return(t=this._selectedNodes)===null||t===void 0?void 0:t[0]}get selectedNodes(){return this._selectedNodes}get selectedLink(){return this._selectedLink}setData(t){const{config:o}=this;o.shouldDataUpdate(this.datamodel.data,t,this.datamodel)&&(this.datamodel.nodeSort=o.nodeSort,this.datamodel.data=t,this._shouldRecalculateLayout=!0,o.layoutAutofit&&(this._shouldFitLayout=!0),this._shouldSetPanels=!0,this._addSVGDefs())}setConfig(t){super.setConfig(t);const o=this._shouldLayoutRecalculate();this._shouldRecalculateLayout=this._shouldRecalculateLayout||o,this._shouldFitLayout=this._shouldFitLayout||o,this._shouldFitLayout&&(this._isAutoFitDisabled=!1),this._shouldSetPanels=!0}get bleed(){const t=this.config.fitViewPadding;return gt(t)?{top:t,bottom:t,left:t,right:t}:t}_render(t){const{config:{disableBrush:o,disableZoom:n,duration:r,layoutAutofit:a,zoomEventFilter:s},datamodel:i}=this;if(!i.nodes&&!i.links)return;const l=gt(t)?t:r;this._backgroundRect.attr("width",this._width).attr("height",this._height).attr("opacity",0),(this._prevWidth!==this._width||this._prevHeight!==this._height)&&a&&(this._shouldFitLayout=!0,this._prevWidth=this._width,this._prevHeight=this._height),o?(this._brush.on(".brush",null),V(window).on("keydown.unovis-graph",null).on("keyup.unovis-graph",null),this._brush.classed("active")&&this._clearBrush()):(this._brushBehavior.extent([[0,0],[this._width,this._height]]),this._brush.call(this._brushBehavior),V(window).on("keydown.unovis-graph",c=>c.key==="Shift"&&this._activateBrush()).on("keyup.unovis-graph",c=>c.key==="Shift"&&this._clearBrush()),this._zoomBehavior.filter(c=>!c.shiftKey)),(this._shouldRecalculateLayout||!this._layoutCalculationPromise)&&(this._layoutCalculationPromise=this._calculateLayout(),this._layoutCalculationPromise.then(()=>{var c,p;(p=(c=this.config).onLayoutCalculated)===null||p===void 0||p.call(c,i.nodes,i.links)})),this._zoomBehavior.filter(Te(s)?s:c=>(!c.ctrlKey||c.type==="wheel")&&!c.button&&!c.shiftKey),this._layoutCalculationPromise.then(()=>{var c,p,d;if(!this.isDestroyed()){if(this._initPanelsData(),this._isFirstRender?(this._fit(),this._shouldFitLayout=!1):this._shouldFitLayout&&!this._isAutoFitDisabled&&(this._fit(r),this._shouldFitLayout=!1),this._resetSelectionGreyoutState(),this.config.selectedNodeId||this.config.selectedNodeIds){const N=((c=this.config.selectedNodeIds)!==null&&c!==void 0?c:[this.config.selectedNodeId]).map(x=>i.getNodeById(x));this._setNodeSelectionState(N)}if(this.config.selectedLinkId){const b=i.links.find(N=>N.id===this.config.selectedLinkId);this._setLinkSelectionState(b)}this._drawNodes(l),this._drawLinks(l),this._timer||(this._timer=ua(this._onLinkFlowTimerFrame.bind(this),35)),n?this.g.on(".zoom",null):this.g.call(this._zoomBehavior).on("dblclick.zoom",null),this._setUpComponentEventsThrottled(),this._setCustomAttributesThrottled(),(d=(p=this.config).onRenderComplete)===null||d===void 0||d.call(p,this.g,i.nodes,i.links,this.config,l,this._scale,this._containerWidth,this._containerHeight),this._isFirstRender=!1}})}_drawNodes(t){const{config:o,datamodel:n}=this,r=n.nodes,a=this._nodesGroup.selectAll(`.${_e}:not(.${vt})`).data(r,d=>String(d._id)),s=a.enter().append("g").attr("class",_e).call(Qa,o,t,this._scale),i=a.merge(s),l=et(i,o,t,this._scale);this._drawPanels(l,t),a.exit().classed(vt,!0).call(Ja,o,t,this._scale);const p=this;if(o.disableDrag)i.on(".drag",null);else{const d=_a().on("start drag end",function(b,N){p._handleDrag(N,b,V(this))});i.call(d)}}_drawLinks(t){const{config:o,datamodel:{links:n}}=this,r=this._linksGroup.selectAll(`.${we}:not(.${Vt}`).data(n,l=>String(l._id)),a=r.enter().append("g").attr("class",we).call(si,o,t);r.merge(a).call(qt,o,t,this._scale,this._getLinkArrowDefId,this._linkPathLengthMap),r.exit().attr("class",Vt).call(li,o,t)}_drawPanels(t,o){var n;const{config:r}=this;if(Q(this._panelsGroup,o/2).style("opacity",!((n=r.panels)===null||n===void 0)&&n.length?1:0),!this._panels)return;const a=t.duration?t.selection():t;vi(a,this._panels,r),mi(a,this._panels,r);const s=this._panels.filter(d=>d._numNodes),i=this._panelsGroup.selectAll(`.${oo}`).data(s,d=>d.label);i.exit().call(_i,r,o);const c=i.enter().append("g").attr("class",oo).call(bi,a),p=i.merge(c);this._updatePanels(p,o)}_updatePanels(t,o){const{config:n}=this;this._panels&&t.call(yi,n,o)}_calculateLayout(){return Et(this,void 0,void 0,function*(){const{config:t,datamodel:o}=this;if(this._currentLayoutType!==t.layoutType)for(const n of o.nodes)delete n._state.fx,delete n._state.fy;switch(t.layoutType){case le.Precalculated:break;case le.Parallel:qo(o,t,this._width,this._height);break;case le.ParallelHorizontal:qo(o,t,this._width,this._height,"horizontal");break;case le.Dagre:yield xi(o,t,this._width);break;case le.Force:yield wi(o,t,this._width);break;case le.Concentric:Si(o,t,this._width,this._height);break;case le.Elk:yield Ni(o,t,this._width);break;case le.Circular:default:ki(o,t,this._width,this._height);break}this._initPanelsData(),this._shouldRecalculateLayout=!1,this._currentLayoutType=t.layoutType})}_initPanelsData(){const{config:t,datamodel:o}=this;this._shouldSetPanels&&(this._panels=hi(t.panels),fi(this._panels,o.nodes,this.config),this._shouldSetPanels=!1)}_fit(t=0,o,n=this.config.fitViewAlign){const{datamodel:r,config:{nodeSize:a}}=this,s=o?.length?r.nodes.filter(d=>o.includes(d.id)):r.nodes,i=ze(s,a),l=[ke(s,d=>fe(d)-i/2-(ee((d._panels||[]).map(b=>b._padding.left))||0)),ee(s,d=>fe(d)+i/2+(ee((d._panels||[]).map(b=>b._padding.right))||0))],c=[ke(s,d=>pe(d)-i/2-(ee((d._panels||[]).map(b=>b._padding.top))||0)),ee(s,d=>pe(d)+i/2+(ee((d._panels||[]).map(b=>b._padding.bottom))||0))];if(l.some(d=>d===void 0)||c.some(d=>d===void 0)){console.warn("Unovis | Graph: Some of the node coordinates are undefined. This can happen if you try to fit the graph before the layout has been calculated.");return}const p=this._getTransform(l,c,n);Q(this.g,t).call(this._zoomBehavior.transform,p),this._onZoom(p)}_getTransform(t,o,n){const{zoomScaleExtent:r}=this.config,{left:a,top:s,right:i,bottom:l}=this.bleed,c=this._width,p=this._height,d=c/(t[1]-t[0]+(a||0)+(i||0)),b=p/(o[1]-o[0]+(s||0)+(l||0)),N=tt(ke([d,b]),r[0],r[1]);let x,T;switch(n){case Pe.Left:x=a-t[0]*N,T=this._height/2-(o[0]+(o[1]-o[0])/2)*N;break;case Pe.Right:x=this._width-(t[1]-t[0])*N-i,T=this._height/2-(o[0]+(o[1]-o[0])/2)*N;break;case Pe.Top:x=this._width/2-(t[0]+(t[1]-t[0])/2)*N,T=s-o[0]*N;break;case Pe.Bottom:x=this._width/2-(t[0]+(t[1]-t[0])/2)*N,T=this._height-(o[1]-o[0])*N-l;break;case Pe.Center:default:x=this._width/2-(t[0]+(t[1]-t[0])/2)*N,T=this._height/2-(o[0]+(o[1]-o[0])/2)*N}return zt.translate(x,T).scale(N)}_setNodeSelectionState(t){const{config:o,datamodel:n}=this;for(const r of n.nodes)r._state.selected=!1,o.nodeSelectionHighlightMode!==Ue.None&&(r._state.greyout=!0);for(const r of n.links)r._state.selected=!1,o.nodeSelectionHighlightMode!==Ue.None&&(r._state.greyout=!0);this._selectedNodes=t.filter(r=>{const a=!!r;return a||console.warn("Unovis | Graph: Select Node: Not found"),a});for(const r of this._selectedNodes)r._state.selected=!0,r._state.greyout=!1;o.nodeSelectionHighlightMode===Ue.GreyoutNonConnected&&n.links.filter(a=>this._selectedNodes.includes(a.source)||this._selectedNodes.includes(a.target)).forEach(a=>{a.source._state.greyout=!1,a.target._state.greyout=!1,a._state.greyout=!1})}_setLinkSelectionState(t){const{datamodel:{nodes:o,links:n}}=this;t||console.warn("Unovis: Graph: Select Link: Not found"),this._selectedLink=t;const r=t?.source,a=t?.target;o.forEach(s=>{s._state.selected=!1,s._state.greyout=!0,(a?._id===s._id||r?._id===s._id)&&(t._state.greyout=!1)}),n.forEach(s=>{s._state.greyout=!0;const i=s.source,l=s.target;i._id===r?._id&&l._id===a?._id&&(i._state.greyout=!1,l._state.greyout=!1,s._state.greyout=!1)}),n.forEach(s=>{delete s._state.selected}),t&&(t._state.selected=!0)}_resetSelectionGreyoutState(){const{datamodel:{nodes:t,links:o}}=this;this._selectedNodes=[],this._selectedLink=void 0,t.forEach(n=>{delete n._state.selected,delete n._state.greyout}),o.forEach(n=>{delete n._state.greyout,delete n._state.selected})}_updateNodesLinksPartial(){const{config:t}=this;this._linksGroup.selectAll(`.${we}`).call(Sn,t,this._scale),this._nodesGroup.selectAll(`.${_e}`).call(rt,t,t.duration,this._scale)}_onBackgroundClick(){this._resetSelectionGreyoutState(),this._updateNodesLinksPartial()}_onNodeClick(t){}_onNodeMouseOut(t){this._updateNodesLinksPartial()}_onNodeMouseOver(t){this._updateNodesLinksPartial()}_onLinkClick(t){}_onLinkMouseOver(t){this._isDragging||(this.config.linkHighlightOnHover&&(t._state.hovered=!0),this._updateNodesLinksPartial())}_onLinkMouseOut(t){this._isDragging||(delete t._state.hovered,this._updateNodesLinksPartial())}_onLinkFlowTimerFrame(t=0){const{config:o,datamodel:{links:n}}=this;if(!n.some((i,l)=>Le(i,o.linkFlow,l)))return;const a=t-this._linkFlowFrameElapsed,s=this._linksGroup.selectAll(`.${we}`);s.each((i,l,c)=>{var p;const d=Z(i,o.linkFlowParticleSpeed,i._indexGlobal),b=c[l].querySelector(`.${dt}`),N=b?(p=this._linkPathLengthMap.get(b.getAttribute("d")))!==null&&p!==void 0?p:b.getTotalLength():0;if(N<=0)return;const x=d||N/Z(i,o.linkFlowAnimDuration,i._indexGlobal)*1e3;i._state.flowAnimDistancePx=(i._state.flowAnimDistancePx||0)+a/1e3*x,i._state.flowAnimDistanceRelative=i._state.flowAnimDistancePx%N/N}),this._linkFlowFrameElapsed=t,jo(s,this.config,this._scale,this._linkPathLengthMap)}_onZoom(t,o){const{config:n,datamodel:{nodes:r}}=this,a=t||o.transform;this._scale=a.k,this._graphGroup.attr("transform",a.toString()),Te(n.onZoom)&&n.onZoom(this._scale,n.zoomScaleExtent,o,a),this._initialTransform||(this._initialTransform=a),o?.sourceEvent&&(Object.keys(a).reduce((i,l)=>{const c=a[l],p=this._initialTransform[l],d=Math.abs(c-p),b=l==="k"?20*d:d/15;return i+=b,i},0)>n.layoutAutofitTolerance?this._isAutoFitDisabled=!0:this._isAutoFitDisabled=!1),this._nodesGroup.selectAll(`.${_e}`).call(r.length>n.zoomThrottledUpdateNodeThreshold?oi:bn,n,this._scale),this._linksGroup.selectAll(`.${we}`).call(r.length>n.zoomThrottledUpdateNodeThreshold?ci:Nn,n,this._scale,this._getLinkArrowDefId)}_onZoomStart(t,o){const{config:n}=this,r=t||o.transform;this._scale=r.k,Te(n.onZoomStart)&&n.onZoomStart(this._scale,n.zoomScaleExtent,o,r)}_onZoomEnd(t,o){const{config:n}=this,r=t||o.transform;this._scale=r.k,Te(n.onZoomEnd)&&n.onZoomEnd(this._scale,n.zoomScaleExtent,o,r)}_updateNodePosition(t,o,n){var r,a;const s=ot(this.g.node()),i=s.k,l=(a=(r=this._panels)===null||r===void 0?void 0:r.filter(x=>x.nodes.includes(t._id)))!==null&&a!==void 0?a:[],c=Ee(t,this.config.nodeSize,t._index),p=ke([(this._height-s.y)/i,...l.map(x=>x._y+x._height)])-c/2,d=ke([(this._width-s.x)/i,...l.map(x=>x._x+x._width)])-c/2,b=ee([-s.y/i,...l.map(x=>x._y)])+c/2,N=ee([-s.x/i,...l.map(x=>x._x)])+c/2;n<b?n=b:n>p&&(n=p),o<N?o=N:o>d&&(o=d),Math.sqrt(Math.pow(o-t.x,2)+Math.pow(n-t.y,2))<15&&(o=t.x,n=t.y),t._state.fx=o,t._state.fy=n,t._state.fx===t.x&&delete t._state.fx,t._state.fy===t.y&&delete t._state.fy}_onBrush(t){var o;if(!t.selection||!t.sourceEvent)return;const{config:n}=this,r=ot(this._graphGroup.node()),[a,s]=r.invert(t.selection[0]),[i,l]=r.invert(t.selection[1]);this._nodesGroup.selectAll(`.${_e}`).each(p=>{const d=fe(p),b=pe(p);p._state.brushed=d>=a&&d<=i&&b>=s&&b<=l}).classed(nt,p=>p._state.brushed);const c=this._nodesGroup.selectAll(`.${nt}`).call(rt,n,0,this._scale);this._brush.classed("active",t.type!=="end"),(o=n.onNodeSelectionBrush)===null||o===void 0||o.call(n,c.data(),t)}_handleDrag(t,o,n){if(o.sourceEvent.shiftKey&&t._state.brushed)this._dragSelectedNodes(o);else if(!o.sourceEvent.shiftKey)switch(o.type){case"start":this._onDragStarted(t,o,n);break;case"drag":this._onDragged(t,o);break;case"end":this._onDragEnded(t,o,n);break}}_onDragStarted(t,o,n){var r;const{config:a}=this;this._isDragging=!0,t._state.isDragged=!0,n.call(et,a,0,this._scale),(r=a.onNodeDragStart)===null||r===void 0||r.call(a,t,o)}_onDragged(t,o){var n;const{config:r}=this,s=ot(this.g.node()).k,[i,l]=ve(o,this._graphGroup.node());this._updateNodePosition(t,i,l),this._nodesGroup.selectAll(`.${_e}`).filter(x=>x._id===t._id).call(et,r,0,s);const b=this._linksGroup.selectAll(`.${we}`).filter(x=>{const T=x.source,v=x.target;return T._id===t._id||v._id===t._id});b.call(qt,r,0,s,this._getLinkArrowDefId,this._linkPathLengthMap);const N=b.filter(x=>x._state.greyout);N.size()&&jo(N,r,this._scale,this._linkPathLengthMap),(n=r.onNodeDrag)===null||n===void 0||n.call(r,t,o)}_onDragEnded(t,o,n){var r;const{config:a}=this;this._isDragging=!1,t._state.isDragged=!1,n.call(et,a,0,this._scale),(r=a.onNodeDragEnd)===null||r===void 0||r.call(a,t,o)}_dragSelectedNodes(t){var o,n;const{config:r}=this,a=ve(t,this._graphGroup.node()),s=Q(this._nodesGroup.selectAll(`.${nt}`));if(t.type==="start")this._groupDragInit=a,this._isDragging=!0,s.each(i=>{i.x=fe(i),i.y=pe(i),i._state.isDragged=!0});else if(t.type==="drag"){const i=a[0]-this._groupDragInit[0],l=a[1]-this._groupDragInit[1];s.each(p=>this._updateNodePosition(p,p.x+i,p.y+l)),Q(this._linksGroup.selectAll(`.${we}`).filter(p=>{var d,b,N,x;return((b=(d=p.source)===null||d===void 0?void 0:d._state)===null||b===void 0?void 0:b.isDragged)||((x=(N=p.target)===null||N===void 0?void 0:N._state)===null||x===void 0?void 0:x.isDragged)})).call(qt,this.config,0,this._scale,this._getLinkArrowDefId,this._linkPathLengthMap)}else this._isDragging=!1,s.each(i=>{i._state.isDragged=!1});s.call(et,r,0,this._scale),(n=(o=this.config).onNodeSelectionDrag)===null||n===void 0||n.call(o,s.data(),t)}_activateBrush(){this._brush.classed("active",!0),this._nodesGroup.selectAll(`.${_e}`).classed(je,!0)}_clearBrush(){var t;this._brush.classed("active",!1).call((t=this._brushBehavior)===null||t===void 0?void 0:t.clear),this._nodesGroup.selectAll(`.${_e}`).classed(je,!1).classed(nt,!1).each(o=>{o._state.brushed=!1}).call(rt,this.config,0,this._scale)}_shouldLayoutRecalculate(){const{prevConfig:t,config:o}=this;if(t.layoutType!==o.layoutType||t.layoutNonConnectedAside!==o.layoutNonConnectedAside)return!0;if(t.layoutType===le.Force){const n=Ct(t.forceLayoutSettings,o.forceLayoutSettings);if(Object.keys(n).length)return!0}if(t.layoutType===le.Dagre){const n=Ct(t.dagreLayoutSettings,o.dagreLayoutSettings);if(Object.keys(n).length)return!0}if(t.layoutType===le.Elk)if(kt(t.layoutElkSettings)&&kt(o.layoutElkSettings)){const n=Ct(t.layoutElkSettings,o.layoutElkSettings);return!!Object.keys(n).length}else return t.layoutElkSettings!==o.layoutElkSettings;return(t.layoutType===le.Parallel||t.layoutType===le.ParallelHorizontal||t.layoutType===le.Concentric)&&(!co(t.layoutGroupOrder,o.layoutGroupOrder)||t.layoutParallelNodesPerColumn!==o.layoutParallelNodesPerColumn||t.layoutParallelSortConnectionsByGroup!==o.layoutParallelSortConnectionsByGroup)}_getLinkArrowDefId(t){return t?`${this.uid}-${t}`:null}_addSVGDefs(){this._defs.selectAll("*").remove(),this._defs.append("path").attr("d",ai()).attr("id",this._getLinkArrowDefId(Ye.Single)),this._defs.append("path").attr("d",ii()).attr("id",this._getLinkArrowDefId(Ye.Double))}zoomIn(t=.3){const o=1+t;Q(this.g,this.config.duration/2).call(this._zoomBehavior.scaleBy,o)}zoomOut(t=.3){const o=1-t;Q(this.g,this.config.duration/2).call(this._zoomBehavior.scaleBy,o)}setZoom(t){Q(this.g,this.config.duration/2).call(this._zoomBehavior.scaleTo,t)}getZoom(){return ot(this.g.node()).k}fitView(t=this.config.duration,o,n){var r;(r=this._layoutCalculationPromise)===null||r===void 0||r.then(()=>{this._fit(t,o,n)})}fitViewToBounds(t,o,n=this.config.duration,r=this.config.fitViewAlign){const{datamodel:{nodes:a}}=this;if(!t&&!o){console.warn("Unovis | Graph: At least one extent (x or y) must be provided.");return}const s=a.filter(l=>{const c=fe(l),p=pe(l);return(!t||c!==void 0&&c>=t[0]&&c<=t[1])&&(!o||p>=o[0]&&p<=o[1])});if((!t||!o)&&!s.length){console.warn(`Unovis | Graph: No nodes found within provided extent [${t}], [${o}].`);return}const i=this._getTransform(t??Co(s,l=>fe(l)),o??Co(s,l=>pe(l)),r);Q(this.g,n).call(this._zoomBehavior.transform,i),this._onZoom(i)}resetAutofitState(){this._isAutoFitDisabled=!1}getNodesCoordinates(){const{datamodel:{nodes:t}}=this;return t.map(o=>({id:o._id,x:o.x,y:o.y}))}getNodeCoordinatesById(t){const{datamodel:{nodes:o}}=this,n=o.find(r=>r._id===t);if(n)return{id:n._id,x:n.x,y:n.y};console.warn(`Unovis | Graph: Node ${t} not found`)}setNodeStateById(t,o){this.datamodel.setNodeStateById(t,o)}updateNodePositions(t){const{config:o}=this,n=gt(t)?t:o.duration,r=this._linksGroup.selectAll(`.${we}:not(.${Vt}`);wn(r,o,n,this._scale,this._getLinkArrowDefId,this._linkPathLengthMap);const a=this._nodesGroup.selectAll(`.${_e}:not(.${vt})`);vn(a,n)}}Be.selectors={root:Ua,graphGroup:dn,background:un,node:_e,nodeShape:xe,nodeGauge:Ae,nodeSideLabel:ko,nodeLabel:Ge,dimmedNode:xo,link:we,linkLine:Fe,linkLabel:to,dimmedLink:cn,panel:oo,panelRect:wo,panelSelection:$o,panelLabel:No,panelLabelText:it,panelSideIcon:Lo,panelSideIconShape:zo,panelSideIconSymbol:Eo};Be.nodeSelectors=Ha;const $i={"data-vis-component":""},Fi=ea({__name:"index",props:{zoomScaleExtent:{},disableZoom:{type:Boolean},zoomEventFilter:{type:Function},disableDrag:{type:Boolean},disableBrush:{type:Boolean},zoomThrottledUpdateNodeThreshold:{},fitViewPadding:{},fitViewAlign:{},layoutType:{},layoutAutofit:{type:Boolean},layoutAutofitTolerance:{},layoutNonConnectedAside:{type:Boolean},layoutNodeGroup:{type:[Function,String,null]},layoutGroupOrder:{},layoutParallelNodesPerColumn:{},layoutParallelNodeSubGroup:{type:[Function,String,null]},layoutParallelSubGroupsPerRow:{},layoutParallelNodeSpacing:{},layoutParallelSubGroupSpacing:{},layoutParallelGroupSpacing:{},layoutParallelSortConnectionsByGroup:{},forceLayoutSettings:{},dagreLayoutSettings:{},layoutElkSettings:{type:[Function,null]},layoutElkNodeGroups:{},layoutElkGetNodeShape:{type:Function},linkWidth:{type:[Function,Number,null]},linkStyle:{type:[Function,null]},linkBandWidth:{type:[Function,Number,null]},linkArrow:{type:[Function,String,Boolean,null]},linkStroke:{type:[Function,String,Array,null]},linkDisabled:{type:[Function,Boolean,null]},linkFlow:{type:[Function,Boolean,null]},linkFlowAnimDuration:{type:[Function,Number,null]},linkFlowParticleSize:{type:[Function,Number,null]},linkFlowParticleSpeed:{type:[Function,Number,null]},linkLabel:{type:[Function,Array,null]},linkLabelShiftFromCenter:{type:[Function,Boolean,null]},linkNeighborSpacing:{},linkCurvature:{type:[Function,Number,null]},linkHighlightOnHover:{type:Boolean},linkSourcePointOffset:{type:[Function,Array,null]},linkTargetPointOffset:{type:[Function,Array,null]},selectedLinkId:{},nodeSize:{type:[Function,Number,null]},nodeStrokeWidth:{type:[Function,Number,null]},nodeShape:{type:[Function,String,null]},nodeGaugeValue:{type:[Function,Number,null]},nodeGaugeFill:{type:[Function,String,Array,null]},nodeGaugeAnimDuration:{},nodeIcon:{type:[Function,String,null]},nodeIconSize:{type:[Function,Number,null]},nodeLabel:{type:[Function,String,null]},nodeLabelTrim:{type:[Function,Boolean,null]},nodeLabelTrimMode:{type:[Function,String,null]},nodeLabelTrimLength:{type:[Function,Number,null]},nodeSubLabel:{type:[Function,String,null]},nodeSubLabelTrim:{type:[Function,Boolean,null]},nodeSubLabelTrimMode:{type:[Function,String,null]},nodeSubLabelTrimLength:{type:[Function,Number,null]},nodeSideLabels:{type:[Function,Array,null]},nodeBottomIcon:{type:[Function,String,null]},nodeDisabled:{type:[Function,Boolean,null]},nodeFill:{type:[Function,String,Array,null]},nodeStroke:{type:[Function,String,Array,null]},nodeSort:{type:Function},nodeEnterPosition:{type:[Function,Array,null]},nodeEnterScale:{type:[Function,Number,null]},nodeExitPosition:{type:[Function,Array,null]},nodeExitScale:{type:[Function,Number,null]},nodeEnterCustomRenderFunction:{type:Function},nodeUpdateCustomRenderFunction:{type:Function},nodePartialUpdateCustomRenderFunction:{type:Function},nodeExitCustomRenderFunction:{type:Function},nodeOnZoomCustomRenderFunction:{type:Function},nodeSelectionHighlightMode:{},selectedNodeId:{},selectedNodeIds:{},panels:{},onNodeDragStart:{type:Function},onNodeDrag:{type:Function},onNodeDragEnd:{type:Function},onZoom:{type:Function},onZoomStart:{type:Function},onZoomEnd:{type:Function},onLayoutCalculated:{type:Function},onNodeSelectionBrush:{type:Function},onNodeSelectionDrag:{type:Function},onRenderComplete:{type:Function},shouldDataUpdate:{type:Function},duration:{},events:{},attributes:{},data:{}},setup(e,{expose:t}){const o=ta(Yn),n=e,r=sa(()=>o.data.value??n.data),a=jn(n),s=la();return oa(()=>{na(()=>{var i;s.value=new Be(a.value),(i=s.value)==null||i.setData(r.value),o.update(s.value)})}),aa(()=>{var i;(i=s.value)==null||i.destroy(),o.destroy()}),Do(a,(i,l)=>{var c;Zn(i,l)||(c=s.value)==null||c.setConfig(a.value)}),Do(r,()=>{var i;(i=s.value)==null||i.setData(r.value)}),t({component:s}),(i,l)=>(ia(),ra("div",$i))}});export{Be as G,Fi as a,Ue as b,le as c};
