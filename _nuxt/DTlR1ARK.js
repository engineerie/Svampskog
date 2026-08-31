import{r as be,u as B,k,g as ye,v as xe,d as Te,x as Z,y as U,P as Be,c as g,q as G,z as De,s as $,o as Ae,n as J,p as K}from"./DQS-DgH0.js";import{X as ke,A as R,a as Se}from"./DZrcxwoD.js";import{Z as Q,bd as Ce,o as P,a6 as ee,c as te,a5 as le,d as ne,e as oe,r as j}from"./CPJaI1G0.js";import{t as _,s as f,p as N,a as S,c as ae}from"./D4v3zwAs.js";const ie={draw(e,l){const t=f(l/N);e.moveTo(t,0),e.arc(0,0,t,0,_)}},we={draw(e,l){const t=f(l/5)/2;e.moveTo(-3*t,-t),e.lineTo(-t,-t),e.lineTo(-t,-3*t),e.lineTo(t,-3*t),e.lineTo(t,-t),e.lineTo(3*t,-t),e.lineTo(3*t,t),e.lineTo(t,t),e.lineTo(t,3*t),e.lineTo(-t,3*t),e.lineTo(-t,t),e.lineTo(-3*t,t),e.closePath()}},se=f(1/3),_e=se*2,ze={draw(e,l){const t=f(l/_e),n=t*se;e.moveTo(0,-t),e.lineTo(n,0),e.lineTo(0,t),e.lineTo(-n,0),e.closePath()}},Ie={draw(e,l){const t=f(l),n=-t/2;e.rect(n,n,t,t)}},Oe=.8908130915292852,re=S(N/10)/S(7*N/10),$e=S(_/10)*re,Le=-ae(_/10)*re,Re={draw(e,l){const t=f(l*Oe),n=$e*t,a=Le*t;e.moveTo(0,-t),e.lineTo(n,a);for(let o=1;o<5;++o){const s=_*o/5,r=ae(s),d=S(s);e.lineTo(d*t,-r*t),e.lineTo(r*n-d*a,d*n+r*a)}e.closePath()}},L=f(3),je={draw(e,l){const t=-f(l/(L*3));e.moveTo(0,t*2),e.lineTo(-L*t,-t),e.lineTo(L*t,-t),e.closePath()}},m=-.5,u=f(3)/2,W=1/f(12),Ne=(W/2+1)*3,We={draw(e,l){const t=f(l/Ne),n=t/2,a=t*W,o=n,s=t*W+t,r=-o,d=s;e.moveTo(n,a),e.lineTo(o,s),e.lineTo(r,d),e.lineTo(m*n-u*a,u*n+m*a),e.lineTo(m*o-u*s,u*o+m*s),e.lineTo(m*r-u*d,u*r+m*d),e.lineTo(m*n+u*a,m*a-u*n),e.lineTo(m*o+u*s,m*s-u*o),e.lineTo(m*r+u*d,m*d-u*r),e.closePath()}};function Me(e,l){let t=null,n=be(a);e=typeof e=="function"?e:B(e||ie),l=typeof l=="function"?l:B(l===void 0?64:+l);function a(){let o;if(t||(t=o=n()),e.apply(this,arguments).draw(t,+l.apply(this,arguments)),o)return t=null,o+""||null}return a.type=function(o){return arguments.length?(e=typeof o=="function"?o:B(o),a):e},a.size=function(o){return arguments.length?(l=typeof o=="function"?o:B(+o),a):l},a.context=function(o){return arguments.length?(t=o??null,a):t},a}var p;(function(e){e.Circle="circle",e.Cross="cross",e.Diamond="diamond",e.Square="square",e.Star="star",e.Triangle="triangle",e.Wye="wye"})(p||(p={}));const Ee={[p.Circle]:ie,[p.Cross]:we,[p.Diamond]:ze,[p.Square]:Ie,[p.Star]:Re,[p.Triangle]:je,[p.Wye]:We},h=Object.assign(Object.assign({},p),{Line:"line"});var C;(function(e){e.Horizontal="horizontal",e.Vertical="vertical"})(C||(C={}));const Fe={items:[],labelClassName:"",onLegendItemClick:void 0,labelFontSize:null,labelMaxWidth:null,bulletSize:null,bulletSpacing:4,bulletShape:e=>{var l;return(l=e.shape)!==null&&l!==void 0?l:h.Circle},orientation:C.Horizontal,renderIntoProvidedDomNode:!1},D=Be*3,Ve={[h.Circle]:Math.PI/4,[h.Cross]:5/9,[h.Diamond]:Math.sqrt(3)/6,[h.Square]:1,[h.Star]:.3,[h.Triangle]:Math.sqrt(3)/4,[h.Wye]:5/11};function de(e,l,t){return l<1?0:e*l+t*(l-1)}function qe(e){e.each((l,t,n)=>{k(n[t]).append("svg").attr("width","100%").attr("height","100%").append("path")})}function Xe(e,l,t){e.each((n,a,o)=>{var s;const r=ye(n,l.bulletShape,a),d=xe((s=n.color)!==null&&s!==void 0?s:Te(n,t,a)),b=d.length,c=D,z=Z(l.bulletSize)||U("var(--vis-legend-bullet-size)",o[a]),y=l.bulletSpacing*(D/z),ge=de(c,b,y),v=r===h.Line?D/2.5:D,q=k(o[a]).select("svg").attr("viewBox",`0 0 ${ge} ${v}`);q.selectAll("path").remove();const X=n.inactive?"var(--vis-legend-bullet-inactive-opacity)":1;d.forEach((I,Y)=>{const H=q.append("path");if(r===h.Line){const x=Y*(c+y),O=x+c;H.attr("d",`M${x},${v/2} L${O},${v/2}`).attr("transform",null).style("opacity",X).style("stroke",I).style("stroke-width","3px").style("fill",null).style("fill-opacity",null).style("marker-start","none").style("marker-end","none")}else{const x=Me().type(Ee[r]).size(c*v*Ve[r]),O=(c-2)/c;let T=v/2;switch(r){case h.Triangle:T+=v/8;break;case h.Star:T+=v/16;break;case h.Wye:T-=v/16;break}const ve=Y*(c+y)+c/2;H.attr("d",x).attr("transform",`translate(${ve}, ${Math.round(T)}) scale(${O})`).style("stroke",I).style("stroke-width","1px").style("opacity",null).style("fill",I).style("fill-opacity",X)}})})}const V=g`
  label: bullet-legend-component;
`,Ye=G`
  :root {
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-legend-font-family: */

    --vis-legend-label-color: #6c778c;
    --vis-legend-label-max-width: 300px;
    --vis-legend-label-font-size: 12px;
    --vis-legend-bullet-size: 9px;
    --vis-legend-bullet-inactive-opacity: 0.15;
    --vis-legend-item-spacing: 20px;
    --vis-legend-vertical-item-spacing: 5px;
    --vis-legend-bullet-label-spacing: 8px;

    --vis-dark-legend-label-color: #eee;
  }

  body.theme-dark ${`.${V}`} {
    --vis-legend-label-color: var(--vis-dark-legend-label-color);
  }

  body.theme-patterns {
    --vis-legend-bullet-size: 14px;
  }
`,A=g`
  label: legendItem;
  display: inline-flex;
  align-items: center;
  font-family: var(--vis-legend-font-family, var(--vis-font-family));
  margin-right: var(--vis-legend-item-spacing);
  white-space: nowrap;
  cursor: default;
  user-select: none;
  max-width: min-content;
`,ce=g`
  label: legendItemVertical;
  display: flex;
  margin-top: var(--vis-legend-vertical-item-spacing);
`,he=g`
  cursor: pointer;
`,M=g`
  label: legendItemLabel;
  font-size: var(--vis-legend-label-font-size);
  display: inline-block;
  vertical-align: middle;
  color: var(--vis-legend-label-color);
  max-width: var(--vis-legend-label-max-width);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`,E=g`
  flex: 0 0 auto;
  label: legendItemBullet;
  margin-right: var(--vis-legend-bullet-label-spacing);
  height: var(--vis-legend-bullet-size);
  width: var(--vis-legend-bullet-size);

  svg {
    display: block;
  }
`,He=Object.freeze(Object.defineProperty({__proto__:null,bullet:E,clickable:he,item:A,itemVertical:ce,label:M,root:V,variables:Ye},Symbol.toStringTag,{value:"Module"}));class me{constructor(l,t){this._defaultConfig=Fe,this.config=this._defaultConfig,this._colorAccessor=n=>n.color,this._container=l,this.div=t?.renderIntoProvidedDomNode?k(this._container):k(this._container).append("div"),this.div.classed(V,!0),this.element=this.div.node(),t&&this.setConfig(t)}setConfig(l){this.prevConfig=this.config,this.config=De(this._defaultConfig,l),this.render()}update(l){this.setConfig(l)}render(){const{config:l}=this,t=this.div.selectAll(`.${A}`).data(l.items),n=t.enter().append("div").on("click",this._onItemClick.bind(this)),a=n.merge(t);a.attr("class",o=>{var s;return`${A} ${(s=o.className)!==null&&s!==void 0?s:""}`}).classed(ce,l.orientation===C.Vertical).classed(he,o=>!!l.onLegendItemClick&&this._isItemClickable(o)).attr("title",o=>o.name).style("display",o=>o.hidden?"none":null),n.append("span").attr("class",E).call(qe),a.select(`.${E}`).style("width",function(o){const r=(Array.isArray(o.color)?o.color:[o.color]).length,d=l.bulletSize?Z(l.bulletSize):U("var(--vis-legend-bullet-size)",this)||9,b=l.bulletSpacing;return`${de(d,r,b)}px`}).style("height",l.bulletSize).style("box-sizing","content-box").call(Xe,this.config,this._colorAccessor),n.append("span").attr("class",M).classed(l.labelClassName,!0).style("max-width",l.labelMaxWidth).style("font-size",l.labelFontSize),a.select(`.${M}`).text(o=>o.name),t.exit().remove()}_isItemClickable(l){return l.pointer===void 0?!0:l.pointer}_onItemClick(l,t){const{config:{onLegendItemClick:n}}=this,o=this.div.selectAll(`.${A}`).nodes().indexOf(l.currentTarget);n&&n(t,o)}destroy(){this.element!==this._container&&this.div.remove()}}me.selectors=He;var F;(function(e){e.Solid="solid",e.Dash="dash",e.DashDot="dashDot",e.Dot="dot",e.LongDash="longDash",e.LongDashDot="longDashDot",e.LongDashDotDot="longDashDotDot",e.ShortDash="shortDash",e.ShortDashDot="shortDashDot",e.ShortDashDotDot="shortDashDotDot",e.ShortDot="shortDot"})(F||(F={}));var i;(function(e){e.TopLeft="top-left",e.Top="top",e.TopRight="top-right",e.Right="right",e.BottomRight="bottom-right",e.Bottom="bottom",e.BottomLeft="bottom-left",e.Left="left"})(i||(i={}));var w;(function(e){e.Horizontal="horizontal",e.Vertical="vertical"})(w||(w={}));const Ze={solid:"none",shortDash:"6,2",shortDot:"2,2",shortDashDot:"6,2,2,2",shortDashDotDot:"6,2,2,2,2,2",dot:"2,6",dash:"8,6",longDash:"16,6",dashDot:"8,6,2,6",longDashDot:"16,6,2,6",longDashDotDot:"16,6,2,6,2,6"},Ue={[i.TopLeft]:({width:e,offsetX:l,offsetY:t})=>({x:e-l,y:t,textAnchor:"end",dominantBaseline:"text-before-edge"}),[i.Top]:({width:e,offsetY:l})=>({x:e,y:l,textAnchor:"middle",dominantBaseline:"text-before-edge"}),[i.TopRight]:({width:e,offsetX:l,offsetY:t})=>({x:e+l,y:t,textAnchor:"start",dominantBaseline:"text-before-edge"}),[i.Right]:({width:e,height:l,offsetX:t})=>({x:e+t,y:l/2,textAnchor:"start",dominantBaseline:"middle"}),[i.BottomRight]:({width:e,height:l,offsetX:t,offsetY:n})=>({x:e+t,y:l-n,textAnchor:"start",dominantBaseline:"text-after-edge"}),[i.Bottom]:({width:e,height:l,offsetY:t})=>({x:e,y:l-t,textAnchor:"middle",dominantBaseline:"text-after-edge"}),[i.BottomLeft]:({width:e,height:l,offsetX:t,offsetY:n})=>({x:e-t,y:l-n,textAnchor:"end",dominantBaseline:"text-after-edge"}),[i.Left]:({width:e,height:l,offsetX:t})=>({x:e-t,y:l/2,textAnchor:"end",dominantBaseline:"middle"})},Ge={[i.TopLeft]:({width:e,offsetX:l,offsetY:t})=>({x:e-l,y:t,textAnchor:"end",dominantBaseline:"text-after-edge"}),[i.Top]:({width:e,offsetY:l})=>({x:e,y:l,textAnchor:"end",dominantBaseline:"middle"}),[i.TopRight]:({width:e,offsetX:l,offsetY:t})=>({x:e+l,y:t,textAnchor:"end",dominantBaseline:"text-before-edge"}),[i.Right]:({width:e,height:l,offsetX:t})=>({x:e+t,y:l/2,textAnchor:"middle",dominantBaseline:"text-before-edge"}),[i.BottomRight]:({width:e,height:l,offsetX:t,offsetY:n})=>({x:e+t,y:l-n,textAnchor:"start",dominantBaseline:"text-before-edge"}),[i.Bottom]:({width:e,height:l,offsetY:t})=>({x:e,y:l-t,textAnchor:"start",dominantBaseline:"middle"}),[i.BottomLeft]:({width:e,height:l,offsetX:t,offsetY:n})=>({x:e-t,y:l-n,textAnchor:"start",dominantBaseline:"text-after-edge"}),[i.Left]:({width:e,height:l,offsetX:t})=>({x:e-t,y:l/2,textAnchor:"middle",dominantBaseline:"text-after-edge"})},Je={[i.TopLeft]:({offsetX:e,height:l,offsetY:t})=>({x:e,y:l-t,textAnchor:"start",dominantBaseline:"text-after-edge"}),[i.Top]:({width:e,height:l,offsetY:t})=>({x:e/2,y:l-t,textAnchor:"middle",dominantBaseline:"text-after-edge"}),[i.TopRight]:({width:e,offsetX:l,height:t,offsetY:n})=>({x:e-l,y:t-n,textAnchor:"end",dominantBaseline:"text-after-edge"}),[i.Right]:({width:e,offsetX:l,height:t})=>({x:e-l,y:t,textAnchor:"end",dominantBaseline:"middle"}),[i.BottomRight]:({width:e,offsetX:l,height:t,offsetY:n})=>({x:e-l,y:t+n,textAnchor:"end",dominantBaseline:"text-before-edge"}),[i.Bottom]:({width:e,height:l,offsetY:t})=>({x:e/2,y:l+t,textAnchor:"middle",dominantBaseline:"text-before-edge"}),[i.BottomLeft]:({offsetX:e,height:l,offsetY:t})=>({x:e,y:l+t,textAnchor:"start",dominantBaseline:"text-before-edge"}),[i.Left]:({offsetX:e,height:l})=>({x:e,y:l,textAnchor:"start",dominantBaseline:"middle"})},Ke={[i.TopLeft]:({offsetX:e,height:l,offsetY:t})=>({x:e,y:l-t,textAnchor:"start",dominantBaseline:"text-before-edge"}),[i.Top]:({width:e,height:l,offsetY:t})=>({x:e/2,y:l-t,textAnchor:"start",dominantBaseline:"central"}),[i.TopRight]:({width:e,offsetX:l,height:t,offsetY:n})=>({x:e-l,y:t-n,textAnchor:"start",dominantBaseline:"text-after-edge"}),[i.Right]:({width:e,offsetX:l,height:t})=>({x:e-l,y:t,textAnchor:"middle",dominantBaseline:"text-after-edge"}),[i.BottomRight]:({width:e,offsetX:l,height:t,offsetY:n})=>({x:e-l,y:t+n,textAnchor:"end",dominantBaseline:"text-after-edge"}),[i.Bottom]:({width:e,height:l,offsetY:t})=>({x:e/2,y:l+t,textAnchor:"end",dominantBaseline:"central"}),[i.BottomLeft]:({offsetX:e,height:l,offsetY:t})=>({x:e,y:l+t,textAnchor:"end",dominantBaseline:"text-before-edge"}),[i.Left]:({offsetX:e,height:l})=>({x:e,y:l,textAnchor:"middle",dominantBaseline:"text-before-edge"})},Qe=Object.assign(Object.assign({},ke),{lineWidth:2,axis:R.Y,value:0,duration:300,color:void 0,lineStyle:F.Solid,labelPosition:i.TopRight,labelOffsetX:14,labelOffsetY:14,labelOrientation:w.Horizontal}),Pe=G`
  :root {
    --vis-plotline-color: rgb(226, 32, 58);
    --vis-plotline-width: 2;
    --vis-plotline-dasharray: none;
    --vis-plotline-stroke-dashoffset: 0;
    --vis-plotline-label-font-size: 12px;
    --vis-plotline-label-color: #000;

    --vis-dark-plotline-label-color: #e5e9f7;
  }

  body.theme-dark {
    --vis-plotline-label-color: var(--vis-dark-tooltip-text-color);
  }
`,et=g`
  label: plotline-component;
`,ue=g`
  label: plotline;
  transition: opacity 200ms;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: var(--vis-plotline-color);
  stroke-width: var(--vis-plotline-width);
  stroke-dasharray: var(--vis-plotline-dasharray);
  stroke-dashoffset: var(--vis-plotline-stroke-dashoffset);
`,fe=g`
  label: plotline-label;
  text-anchor: middle;
  /* dominant-baseline: middle; */
  pointer-events: none;
  font-size: var(--vis-plotline-label-font-size);
  fill: var(--vis-plotline-label-color);
`,tt=Object.freeze(Object.defineProperty({__proto__:null,globalStyles:Pe,label:fe,plotline:ue,root:et},Symbol.toStringTag,{value:"Module"}));class pe extends Se{constructor(l){super(),this._defaultConfig=Qe,l&&this.setConfig(l),this.plotline=this.g.append("line").attr("class",ue),this.label=this.g.append("text").attr("class",fe)}_render(l){super._render(l);const{config:t}=this;this.value=t.value;let n;typeof t?.lineStyle=="string"?n=Ze[t.lineStyle]:Array.isArray(t.lineStyle)?n=t.lineStyle.join(","):n="none",this.value=t.value,this.plotline.attr("stroke-opacity",1).style("stroke-width",t.lineWidth).style("stroke-dasharray",n).style("stroke",t.color);let a=0,o=0,s=0,r=0;if(t.axis===R.Y?(s=this.yScale(this.value),r=this.yScale(this.value),a=0,o=this._width):(s=0,r=this._height,a=this.xScale(this.value),o=this.xScale(this.value)),$(this.plotline,t.duration).attr("x1",a).attr("x2",o).attr("y1",s).attr("y2",r),t.labelText){const d=this.computeLabel(t.axis,o,r,t.labelPosition,t.labelOffsetX,t.labelOffsetY,t.labelOrientation);this.label.text(t.labelText).attr("transform",d.transform).attr("dominant-baseline",d.dominantBaseline).style("fill",t.labelColor).style("text-anchor",d.textAnchor).style("font-size",t.labelSize?`${t.labelSize}px`:void 0),$(this.label,t.duration).attr("x",d.x).attr("y",d.y)}$(this.plotline.exit()).style("opacity",0).remove()}computeLabel(l,t,n,a,o,s,r){const d=r===w.Vertical,b=d?-90:0;let c;l===R.X?c=(d?Ge:Ue)[a]({width:t,height:n,offsetX:o,offsetY:s}):c=(d?Ke:Je)[a]({width:t,height:n,offsetX:o,offsetY:s});const z=b?`rotate(${b}, ${c.x}, ${c.y})`:"";return Object.assign(Object.assign({},c),{rotation:b,transform:z})}}pe.selectors=tt;const lt={"data-vis-component":""},st=Q({__name:"index",props:{color:{},lineWidth:{},axis:{},value:{},duration:{},lineStyle:{},labelText:{},labelPosition:{},labelOffsetX:{},labelOffsetY:{},labelOrientation:{},labelColor:{},labelSize:{},x:{type:[Function,Number,null]},y:{type:[Function,Number,null,Array]},id:{type:Function},xScale:{type:[Object,Function]},yScale:{type:[Object,Function]},excludeFromDomainCalculation:{type:Boolean},events:{},attributes:{},data:{}},setup(e,{expose:l}){const t=Ce(Ae),n=J(e),a=j();return P(()=>{ee(()=>{a.value=new pe(n.value),t.update(a.value)})}),te(()=>{var o;(o=a.value)==null||o.destroy(),t.destroy()}),le(n,(o,s)=>{var r;K(o,s)||(r=a.value)==null||r.setConfig(n.value)}),l({component:a}),(o,s)=>(ne(),oe("div",lt))}}),rt=Q({__name:"index",props:{items:{},labelClassName:{},onLegendItemClick:{type:Function},labelFontSize:{},labelMaxWidth:{},bulletSize:{},bulletSpacing:{},bulletShape:{type:[Function,null]},orientation:{},renderIntoProvidedDomNode:{type:Boolean},data:{}},setup(e,{expose:l}){const n=J(e),a=j(),o=j();return P(()=>{ee(()=>{o.value&&(a.value=new me(o.value,{...n.value,renderIntoProvidedDomNode:!0}))})}),te(()=>{var s;(s=a.value)==null||s.destroy()}),le(n,(s,r)=>{var d;K(s,r)||(d=a.value)==null||d.setConfig(n.value)}),l({component:a}),(s,r)=>(ne(),oe("div",{"data-vis-bullet-legend":"",ref_key:"elRef",ref:o},null,512))}});export{rt as C,st as w};
