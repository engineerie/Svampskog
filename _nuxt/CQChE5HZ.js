import{r as I,u as g,a5 as U,c as $,q as V,i as q,U as F,b as E,a6 as Q,d as C,s as _,g as Y,k as X,a7 as Z,S as J,a8 as K,o as ee,n as te,p as ne}from"./DQS-DgH0.js";import{C as ae,a as O,i as R}from"./DX50ChZz.js";import{X as re,a as se,D as G}from"./DZrcxwoD.js";import{c as ie,x as oe,y as le,l as W}from"./z7MCSWeV.js";import{Z as ce,bd as ue,o as de,a6 as he,c as ye,a5 as B,d as fe,e as ve,Q as pe,r as ge}from"./CPJaI1G0.js";function me(f,n,e){var s=null,o=g(!0),l=null,c=ie,i=null,m=I(a);f=typeof f=="function"?f:f===void 0?oe:g(+f),n=typeof n=="function"?n:n===void 0?g(0):g(+n),e=typeof e=="function"?e:e===void 0?le:g(+e);function a(t){var d,b,h,y=(t=U(t)).length,r,u=!1,p,v=new Array(y),x=new Array(y);for(l==null&&(i=c(p=m())),d=0;d<=y;++d){if(!(d<y&&o(r=t[d],d,t))===u)if(u=!u)b=d,i.areaStart(),i.lineStart();else{for(i.lineEnd(),i.lineStart(),h=d-1;h>=b;--h)i.point(v[h],x[h]);i.lineEnd(),i.areaEnd()}u&&(v[d]=+f(r,d,t),x[d]=+n(r,d,t),i.point(s?+s(r,d,t):v[d],e?+e(r,d,t):x[d]))}if(p)return i=null,p+""||null}function k(){return W().defined(o).curve(c).context(l)}return a.x=function(t){return arguments.length?(f=typeof t=="function"?t:g(+t),s=null,a):f},a.x0=function(t){return arguments.length?(f=typeof t=="function"?t:g(+t),a):f},a.x1=function(t){return arguments.length?(s=t==null?null:typeof t=="function"?t:g(+t),a):s},a.y=function(t){return arguments.length?(n=typeof t=="function"?t:g(+t),e=null,a):n},a.y0=function(t){return arguments.length?(n=typeof t=="function"?t:g(+t),a):n},a.y1=function(t){return arguments.length?(e=t==null?null:typeof t=="function"?t:g(+t),a):e},a.lineX0=a.lineY0=function(){return k().x(f).y(n)},a.lineY1=function(){return k().x(f).y(e)},a.lineX1=function(){return k().x(s).y(n)},a.defined=function(t){return arguments.length?(o=typeof t=="function"?t:g(!!t),a):o},a.curve=function(t){return arguments.length?(c=t,l!=null&&(i=c(l)),a):c},a.context=function(t){return arguments.length?(t==null?l=i=null:i=c(l=t),a):l},a}const ke=Object.assign(Object.assign({},re),{color:void 0,curveType:ae.MonotoneX,baseline:()=>0,opacity:1,cursor:null,line:!1,lineColor:void 0,lineWidth:2,lineDashArray:void 0,minHeight1Px:!1,minHeight:void 0,stackMinHeight:!1}),z=$`
  label: area-component;
`,xe=V`
  :root {
    --vis-area-cursor: default;
    --vis-area-fill-opacity: 1;
    --vis-area-stroke-color: none;
    --vis-area-stroke-width: 0px;
    --vis-area-stroke-dasharray: none;
    --vis-area-stroke-opacity: 1;
    --vis-area-hover-fill-opacity: none;
    --vis-area-hover-stroke-width: none;

    /* Dark Theme */
    --vis-dark-area-stroke-color: none;
  }

  body.theme-dark ${`.${z}`} {
    --vis-area-stroke-color: var(--vis-dark-area-stroke-color);
  }

`,P=$`
  label: area;
  cursor: var(--vis-area-cursor);
  fill-opacity: var(--vis-area-fill-opacity);
  stroke-width: var(--vis-area-stroke-width);
  stroke-dasharray: var(--vis-area-stroke-dasharray);
  stroke: var(--vis-area-stroke-color);
  stroke-opacity: var(--vis-area-stroke-opacity);

  &:hover {
    fill-opacity: var(--vis-area-hover-fill-opacity);
    stroke-width: var(--vis-area-hover-stroke-width);
  }
`,N=$`
  label: areaLinePath;
  fill: none;
  stroke-dasharray: var(--vis-line-stroke-dasharray);
  stroke-dashoffset: var(--vis-line-stroke-dashoffset);
`,be=Object.freeze(Object.defineProperty({__proto__:null,area:P,areaLinePath:N,globalStyles:xe,root:z},Symbol.toStringTag,{value:"Module"}));class w extends se{constructor(n){super(),this._defaultConfig=ke,this.config=this._defaultConfig,this.stacked=!0,this.events={[w.selectors.area]:{}},n&&this.setConfig(n),this.stacked=Array.isArray(this.config.y)}get bleed(){const{config:{line:n,lineWidth:e}}=this;if(!n)return{top:0,bottom:0,left:0,right:0};const s=this.yScale.domain(),l=(this.yScale.range()[0]>this.yScale.range()[1]?G.North:G.South)===G.South,c=e>3,i=e>=10;return{top:!i&&(!l&&s[1]===0||l&&s[0]===0)?0:e/2,bottom:!i&&(!l&&s[0]===0||l&&s[1]===0)?0:e/2,left:c?e/2:0,right:c?e/2:0}}_render(n){super._render(n);const{config:e,datamodel:{data:s}}=this,o=q(n)?n:e.duration,l=O[e.curveType];this._areaGen=me().x(r=>r.x).y0(r=>r.y0).y1(r=>r.y1).curve(l);const c=F(e.y)?e.y:[e.y],i=s.map((r,u)=>this.xScale(E(r,e.x,u))),m=Q(s,e.baseline,c,this._prevNegative);this._prevNegative=m.map(r=>!!r.isMostlyNegative);const a=[],k=m.map(r=>r.map((u,p)=>{var v,x;const T=i[p],M=this.yScale(u[0]),H=this.yScale(u[1]),L=H>M,S=e.stackMinHeight&&a[p]||0,j=L?M+S:M-S,D=L?H+S:H-S;let A=0;return(e.minHeight||e.minHeight1Px)&&Math.abs(D-j)<((v=e.minHeight)!==null&&v!==void 0?v:1)&&(A=((x=e.minHeight)!==null&&x!==void 0?x:1)-Math.abs(D-j),e.stackMinHeight&&(a[p]=S+A)),{x:T,y0:j,y1:L?D+A:D-A}})),t=k.length-1,d=[...k].reverse(),b=this.g.selectAll(`.${P}`).data(d),h=b.enter().append("path").attr("class",P).attr("d",r=>this._areaGen(r)||this._emptyPath()).style("opacity",0).style("fill",(r,u)=>C(s,e.color,t-u)),y=_(h.merge(b),o).style("opacity",(r,u)=>r.some(v=>v.y0-v.y1!==0)?E(s,e.opacity,t-u):0).style("fill",(r,u)=>C(s,e.color,t-u)).style("cursor",(r,u)=>Y(s,e.cursor,t-u));o?y.attrTween("d",(u,p,v)=>{const x=X(v[p]).attr("d"),T=this._areaGen(u)||this._emptyPath();return R(x,T)}):y.attr("d",r=>this._areaGen(r)||this._emptyPath()),_(b.exit(),o).style("opacity",0).remove(),e.line&&this._renderLines(o,k)}_renderLines(n,e){var s;const{config:o,datamodel:{data:l}}=this,c=e.length-1,i=[...e].reverse(),m=(s=o.lineColor)!==null&&s!==void 0?s:o.color,a=this.g.selectAll(`.${N}`).data(i),k=this.g.selectAll(`.${P}`).nodes(),t=a.enter().insert("path",(h,y)=>k[y+1]).attr("class",N).attr("stroke",(h,y)=>C(l,m,c-y)).attr("stroke-width",o.lineWidth).attr("stroke-opacity",0),d=_(t.merge(a),n).attr("stroke",(h,y)=>C(l,m,c-y)).attr("stroke-width",o.lineWidth).attr("stroke-opacity",1).attr("cursor",(h,y)=>Y(l,o.cursor,c-y)).style("stroke-dasharray",(h,y)=>{var r,u;return(u=(r=Z(l,o.lineDashArray,y))===null||r===void 0?void 0:r.join(" "))!==null&&u!==void 0?u:null}),b=O[o.curveType];this._lineGen=W().x(h=>h.x).y(h=>h.y1).curve(b),n?d.attrTween("d",(y,r,u)=>{const p=X(u[r]).attr("d")||this._emptyLinePath(),v=this._lineGen(y)||this._emptyLinePath();return R(p,v)}):d.attr("d",h=>this._lineGen(h)||this._emptyLinePath()),_(a.exit(),n).style("opacity",0).remove()}getYDataExtent(n){const{config:e,datamodel:s}=this,o=F(e.y)?e.y:[e.y],l=this.xScale.domain(),c=n?J(s.data,l,e.x,!0):s.data;return K(c,e.baseline,...o)}_emptyPath(){const n=this.xScale.range(),e=this.yScale.domain(),s=this.yScale((e[0]+e[1])/2),o=s;return this._areaGen([{y0:s,y1:o,x:n[0]},{y0:s,y1:o,x:n[1]}])}_emptyLinePath(){const n=this.xScale.range(),e=this.yScale.range();return`M${n[0]},${e[0]} L${n[1]},${e[0]}`}}w.selectors=be;const Se={"data-vis-component":""},we=ce({__name:"index",props:{color:{type:[Function,String,Array,null]},curveType:{},baseline:{type:[Function,Number,null]},opacity:{type:[Function,Number,null]},cursor:{type:[Function,String,null]},minHeight1Px:{type:Boolean},minHeight:{},x:{type:[Function,Number,null]},y:{type:[Function,Number,null,Array]},id:{type:Function},xScale:{type:[Object,Function]},yScale:{type:[Object,Function]},excludeFromDomainCalculation:{type:Boolean},duration:{},events:{},attributes:{},data:{}},setup(f,{expose:n}){const e=ue(ee),s=f,o=pe(()=>e.data.value??s.data),l=te(s),c=ge();return de(()=>{he(()=>{var i;c.value=new w(l.value),(i=c.value)==null||i.setData(o.value),e.update(c.value)})}),ye(()=>{var i;(i=c.value)==null||i.destroy(),e.destroy()}),B(l,(i,m)=>{var a;ne(i,m)||(a=c.value)==null||a.setConfig(l.value)}),B(o,()=>{var i;(i=c.value)==null||i.setData(o.value)}),n({component:c}),(i,m)=>(fe(),ve("div",Se))}});export{we as C};
