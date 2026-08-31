import{c as g,q as L,i as C,U as N,b as w,d as O,g as E,k as U,a7 as Y,s as $,o as R,n as q,p as z}from"./DQS-DgH0.js";import{C as G,a as V,i as Q}from"./DX50ChZz.js";import{X as Z,a as I,D as j}from"./DZrcxwoD.js";import{l as J}from"./z7MCSWeV.js";import{Z as K,bd as ee,o as te,a6 as se,c as ne,a5 as B,d as ae,e as ie,Q as oe,r as le}from"./CPJaI1G0.js";const re=Object.assign(Object.assign({},Z),{curveType:G.MonotoneX,lineWidth:2,lineDashArray:void 0,fallbackValue:void 0,highlightOnHover:!1,cursor:null,interpolateMissingData:!1}),ce=L`
  :root {
    --vis-line-cursor: default;
    --vis-line-stroke-dasharray: none;
    --vis-line-stroke-dashoffset: 0;

    --vis-line-gapfill-stroke-dasharray: 2 3;
    --vis-line-gapfill-stroke-opacity: 0.8;
    --vis-line-gapfill-stroke-dashoffset: 0;
  }
`,de=g`
  label: line-component;
`,m=g`
  label: line;
  transition: opacity 200ms;
  cursor: var(--vis-line-cursor);
`,F=g`
  label: linePath;
  fill: none;
  stroke-dasharray: var(--vis-line-stroke-dasharray);
  stroke-dashoffset: var(--vis-line-stroke-dashoffset);
`,A=g`
  label: lineSelectionHelper;
  fill: none;
  stroke: rgba(0, 0, 0, 0);
  stroke-width: 8px;
`,P=g`
  opacity: 0.2;
`,M=g`
  label: interpolated-path;
  fill: none;
  stroke-dasharray: var(--vis-line-gapfill-stroke-dasharray);
  stroke-dashoffset: var(--vis-line-gapfill-stroke-dashoffset);
  stroke-opacity: var(--vis-line-gapfill-stroke-opacity);
`,he=Object.freeze(Object.defineProperty({__proto__:null,dim:P,globalStyles:ce,interpolatedPath:M,line:m,linePath:F,lineSelectionHelper:A,root:de},Symbol.toStringTag,{value:"Module"}));class D extends I{constructor(t){super(),this._defaultConfig=re,this.config=this._defaultConfig,this.curve=V[G.MonotoneX],this.events={[D.selectors.line]:{mouseover:this._highlight.bind(this),mouseleave:this._resetHighlight.bind(this)}},t&&this.setConfig(t)}get bleed(){const{config:{lineWidth:t}}=this,e=this.yScale.domain(),i=(this.yScale.range()[0]>this.yScale.range()[1]?j.North:j.South)===j.South,u=t>3,c=t>=10;return{top:!c&&(!i&&e[1]===0||i&&e[0]===0)?0:t/2,bottom:!c&&(!i&&e[0]===0||i&&e[1]===0)?0:t/2,left:u?t/2:0,right:u?t/2:0}}_render(t){super._render(t);const{config:e,datamodel:{data:l}}=this,i=C(t)?t:e.duration;this.curve=V[e.curveType],this.lineGen=J().x(n=>n.x).y(n=>n.y).defined(n=>n.defined).curve(this.curve);const u=N(e.y)?e.y:[e.y],c=l.map((n,s)=>this.xScale(w(n,e.x,s))),r=u.map(n=>{const s=l.map((d,o)=>{const a=w(d,n,o),h=(C(a)||a===null)&&isFinite(a)?a:e.fallbackValue,S=e.interpolateMissingData?(C(a)||a===null)&&isFinite(a):isFinite(h);return{x:c[o],y:this.yScale(h??0),defined:S,value:h}}),b=s.reduce((d,o)=>o.defined||d,!1);let p=!1;const v=s.reduce((d,o,a)=>{!o.defined&&isFinite(e.fallbackValue)&&d.push(Object.assign(Object.assign({},o),{defined:!0})),!o.defined&&!p&&(p=!0);const h=a>0&&!s[a-1].defined||a<s.length-1&&!s[a+1].defined;return o.defined&&h&&(p||d.push(Object.assign(Object.assign({},o),{defined:!1})),d.push(o),p=!1),d},[]),k=b&&s.some(d=>d.value!==null);return{values:s,defined:b,gaps:v,visible:k}}),y=this.g.selectAll(`.${m}`).data(r),f=y.enter().append("g").attr("class",m);f.append("path").attr("class",F).attr("stroke",(n,s)=>O(l,e.color,s)).attr("stroke-opacity",0).attr("stroke-width",e.lineWidth),f.append("path").attr("class",A).attr("d",this._emptyPath()),f.append("path").attr("class",M).attr("d",this._emptyPath()).style("opacity",0);const T=f.merge(y);T.style("cursor",(n,s)=>E(l,e.cursor,s)),T.each((n,s,b)=>{var p;const v=U(b[s]),k=v.select(`.${F}`),d=v.select(`.${A}`),o=v.select(`.${M}`),a=n.visible,h=Y(l,e.lineDashArray,s),S=$(k,i).attr("stroke",O(l,e.color,s)).attr("stroke-width",e.lineWidth).attr("stroke-opacity",a?1:0).style("stroke-dasharray",(p=h?.join(" "))!==null&&p!==void 0?p:null),H=n.values.some(x=>!x.defined),_=this.lineGen(n.values);if(i&&!H){const x=k.attr("d")||this._emptyPath(),X=_||this._emptyPath();S.attrTween("d",()=>Q(x,X))}else n.visible&&S.attr("d",_);d.attr("d",_).attr("visibility",a?null:"hidden"),H&&e.interpolateMissingData?$(o,i).attr("d",this.lineGen(n.gaps)).attr("stroke",O(l,e.color,s)).attr("stroke-width",e.lineWidth-1).style("opacity",1):o.transition().duration(i).style("opacity",0)}),$(y.exit(),i).style("opacity",0).remove()}_emptyPath(){const t=this.xScale.range(),e=this.yScale.range();return`M${t[0]},${e[0]} L${t[1]},${e[0]}`}_highlight(t){const{config:e}=this;e.highlightOnHover&&this.g.selectAll(`.${m}`).classed(P,l=>l!==t)}_resetHighlight(){const{config:t}=this;t.highlightOnHover&&this.g.selectAll(`.${m}`).classed(P,!1)}}D.selectors=he;const ue={"data-vis-component":""},be=K({__name:"index",props:{color:{type:[Function,String,Array,null]},curveType:{},lineWidth:{},lineDashArray:{type:[Function,Array,null]},fallbackValue:{},highlightOnHover:{type:Boolean},cursor:{type:[Function,String,null]},interpolateMissingData:{type:Boolean},x:{type:[Function,Number,null]},y:{type:[Function,Number,null,Array]},id:{type:Function},xScale:{type:[Object,Function]},yScale:{type:[Object,Function]},excludeFromDomainCalculation:{type:Boolean},duration:{},events:{},attributes:{},data:{}},setup(W,{expose:t}){const e=ee(R),l=W,i=oe(()=>e.data.value??l.data),u=q(l),c=le();return te(()=>{se(()=>{var r;c.value=new D(u.value),(r=c.value)==null||r.setData(i.value),e.update(c.value)})}),ne(()=>{var r;(r=c.value)==null||r.destroy(),e.destroy()}),B(u,(r,y)=>{var f;z(r,y)||(f=c.value)==null||f.setConfig(u.value)}),B(i,()=>{var r;(r=c.value)==null||r.setData(i.value)}),t({component:c}),(r,y)=>(ae(),ie("div",ue))}});export{be as C};
