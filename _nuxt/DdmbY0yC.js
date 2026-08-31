import{s as S,k as R,ax as $,aG as G,aH as O,at as N,b as h,y as P,g as f,au as w,a7 as _,d as m,c as C,q as M,i as V,aI as z,_ as I,o as E,n as H,p as W}from"./DQS-DgH0.js";import{X,a as U}from"./DZrcxwoD.js";import{Z as Y,bd as q,o as Q,a6 as Z,c as J,a5 as L,d as K,e as ee,Q as te,r as le}from"./CPJaI1G0.js";var b;(function(t){t.AbsolutePx="absolute_px",t.AbsolutePercentage="absolute_percentage",t.DataSpace="data_space"})(b||(b={}));const se=Object.assign(Object.assign({},X),{color:t=>t.color,y:void 0,xPositioning:b.DataSpace,yPositioning:b.DataSpace,labelFontSize:void 0,label:void 0,backgroundColor:void 0,cursor:null,labelTextBrightnessRatio:.65,clustering:!0,clusterLabel:t=>t.length.toString(),clusterFontSize:void 0,clusterBackgroundColor:void 0,clusterCursor:void 0,clusterLabelColor:null});function ne(t){t.attr("transform",s=>`translate(${s._screen.x},${s._screen.y})`),t.append("rect").style("fill",s=>s._screen.backgroundColor),t.append("text").style("text-anchor","middle").style("dominant-baseline","central").style("fill",s=>s._screen.backgroundColor).style("pointer-events","none"),t.attr("transform",s=>`translate(${s._screen.x},${s._screen.y}) scale(0)`)}function re(t,s,e){t.each((n,i,o)=>{var r,l;const a=R(o[i]),c=a.select("text"),g=a.select("rect"),u=n._screen.backgroundColor,y=(r=n._screen.labelText)!==null&&r!==void 0?r:"",p=n._screen.fontSize;let x=n._screen.labelColor;const v=p*1.7;let d=p*y.length*.7;if(d<v&&(d=v),S(g,e).attr("width",d).attr("height",v).attr("x",-d/2).attr("y",-v/2).attr("rx",p).attr("ry",p).style("fill",u),!x){const j=(l=$(G(u)?O(u,a.node()):u))===null||l===void 0?void 0:l.hex();x=N(j)>s.labelTextBrightnessRatio?"var(--vis-xy-label-text-color-dark)":"var(--vis-xy-label-text-color-light)"}c.html(y).attr("font-size",p),S(c,e).style("fill",x),g.style("cursor",n._screen.cursor)}),S(t,e).attr("transform",n=>`translate(${n._screen.x},${n._screen.y}) scale(1)`)}function oe(t,s){S(t,s).attr("transform",e=>`translate(${e._screen.x},${e._screen.y}) scale(0)`).remove()}function A(t,s,e){var n;switch(s){case b.DataSpace:return(n=e(t))!==null&&n!==void 0?n:0;case b.AbsolutePx:return t;case b.AbsolutePercentage:{const i=e.range();return i[0]+(i[1]-i[0])*t/100}}}function B(t,s,e,n,i){var o,r;const l=Array.isArray(t),a=l?(o=h(t,e.clusterFontSize))!==null&&o!==void 0?o:P("var(--vis-xy-label-cluster-font-size)",s):(r=h(t,e.labelFontSize))!==null&&r!==void 0?r:P("var(--vis-xy-label-font-size)",s),c=(l?f(t,e.clusterLabel):f(t,e.label))||"",g=a*1.7;let u=a*c.length*.7;u<g&&(u=g);const y=l?w(t,x=>x._screen.x):A(h(t,e.x),_(t,e.xPositioning),n),p=l?w(t,x=>x._screen.y):A(h(t,e.y),_(t,e.yPositioning),i);return{x:y,y:p,fontSize:a,labelText:c,labelColor:l?m(t,e.clusterLabelColor):m(t,e.color),backgroundColor:l?m(t,e.clusterBackgroundColor):m(t,e.backgroundColor),cursor:l?f(t,e.clusterCursor):f(t,e.cursor),width:u,height:g}}const ae=M`
  :root {
    --vis-xy-label-cursor: default;
    // Undefined by default to allow proper fallback to var(--vis-color-main)
    /* --vis-xy-label-fill-color */
    --vis-xy-label-stroke-color: none;
    --vis-xy-label-stroke-width: 0px;
    --vis-xy-label-fill-opacity: 1;
    --vis-xy-label-stroke-opacity: 1;
    --vis-xy-label-hover-stroke-width: 1px;
    --vis-xy-label-font-size: 12px;
    --vis-xy-label-cluster-font-size: 14px;

    --vis-xy-label-text-color-dark: #5b5f6d;
    --vis-xy-label-text-color-light: #fff;
    --vis-xy-label-text-font-weight: 500;
  }
`,ie=C`
  label: xy-labels-component;
`,F=C`
  label: label-g;

  > rect, text {
    cursor: var(--vis-xy-label-cursor);
    fill: var(--vis-xy-label-fill-color, var(--vis-color-main));
    fill-opacity: var(--vis-xy-label-fill-opacity);
    stroke-opacity: var(--vis-xy-label-stroke-opacity);
  }

  > text {
    font-weight: var(--vis-xy-label-text-font-weight);
    user-select: none;
  }

  > rect {
    stroke-width: var(--vis-xy-label-stroke-width);
    stroke: var(--vis-xy-label-stroke-color);

    &:hover {
        stroke-width: var(--vis-xy-label-hover-stroke-width);
    }
  }
`,D=C`
  label: cluster;
`,T=C`
  label: label;
`,ce=Object.freeze(Object.defineProperty({__proto__:null,cluster:D,globalStyles:ae,label:T,labelGroup:F,root:ie},Symbol.toStringTag,{value:"Module"}));class k extends U{constructor(s){super(),this.clippable=!1,this._defaultConfig=se,this.config=this._defaultConfig,this.events={[k.selectors.label]:{}},s&&this.setConfig(s)}_render(s){const{config:e}=this,n=V(s)?s:e.duration,i=this.g.selectAll(`.${F}`).data(this._getDataToRender()),o=i.exit();oe(o,n),i.enter().append("g").attr("class",F).call(ne).merge(i).classed(D,a=>!!a.records).classed(T,a=>!a.records).call(re,e,n)}_getDataToRender(){var s,e;const{config:n,datamodel:i}=this,o=this.xScale.range(),r=this.yScale.range(),l=(e=(s=i.data)===null||s===void 0?void 0:s.reduce((a,c)=>{const g=_(c,n.xPositioning),u=_(c,n.yPositioning),y=B(c,this.element,n,this.xScale,this.yScale);return(g!==b.DataSpace||z(y.x,o))&&(u!==b.DataSpace||z(y.y,r))&&a.push(Object.assign(Object.assign({},c),{_screen:y})),a},[]))!==null&&e!==void 0?e:[];return n.clustering?this._getClusteredLabels(l):l}_getClusteredLabels(s){const e=[...s],n=new Map;for(let o=0;o<e.length;o+=1){const r=e[o];for(let l=o+1;l<e.length;l+=1){const a=e[l];I(r._screen,a._screen)&&(n.has(r)||n.set(r,[r]),n.get(r).push(a),e.splice(l,1),l-=1)}n.has(r)&&(e.splice(o,1),o-=1)}const i=Array.from(n.values()).map(o=>({_screen:B(o,this.element,this.config,this.xScale,this.yScale),records:o}));return[...e,...i]}}k.selectors=ce;const ue={"data-vis-component":""},xe=Y({__name:"index",props:{color:{type:[Function,String,Array,null]},y:{type:[Function,Number,null]},xPositioning:{type:[Function,String,null]},yPositioning:{type:[Function,String,null]},labelFontSize:{type:[Function,Number,null]},label:{type:[Function,String,null]},backgroundColor:{type:[Function,String,Array,null]},cursor:{type:[Function,String,null]},labelTextBrightnessRatio:{},clustering:{type:Boolean},clusterLabel:{type:[Function,String,null]},clusterFontSize:{type:[Function,Number,null]},clusterBackgroundColor:{type:[Function,String,Array,null]},clusterCursor:{type:[Function,String,null]},clusterLabelColor:{type:[Function,String,Array,null]},x:{type:[Function,Number,null]},id:{type:Function},xScale:{type:[Object,Function]},yScale:{type:[Object,Function]},excludeFromDomainCalculation:{type:Boolean},duration:{},events:{},attributes:{},data:{}},setup(t,{expose:s}){const e=q(E),n=t,i=te(()=>e.data.value??n.data),o=H(n),r=le();return Q(()=>{Z(()=>{var l;r.value=new k(o.value),(l=r.value)==null||l.setData(i.value),e.update(r.value)})}),J(()=>{var l;(l=r.value)==null||l.destroy(),e.destroy()}),L(o,(l,a)=>{var c;W(l,a)||(c=r.value)==null||c.setConfig(o.value)}),L(i,()=>{var l;(l=r.value)==null||l.setData(i.value)}),s({component:r}),(l,a)=>(K(),ee("div",ue))}});export{xe as P};
