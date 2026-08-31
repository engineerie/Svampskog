import{u as k,a5 as rt,C as st,d as Y,s as B,B as it,c as R,q as ut,a as ct,b as U,i as dt,M as gt,w as ft,o as bt,n as vt,p as mt}from"./DQS-DgH0.js";import{S as ht}from"./DSQBZSgy.js";import{a as pt}from"./j6HGkDVd.js";import{t as D}from"./D4v3zwAs.js";import{Z as At,bd as yt,o as Lt,a6 as _t,c as xt,a5 as W,d as kt,e as Rt,Q as St,r as wt}from"./CPJaI1G0.js";function Et(r,o){return o<r?-1:o>r?1:o>=r?0:NaN}function Ot(r){return r}function Nt(){var r=Ot,o=Et,a=null,c=k(0),d=k(D),i=k(0);function l(t){var s,u=(t=rt(t)).length,g,h,v=0,p=new Array(u),f=new Array(u),A=+c.apply(this,arguments),e=Math.min(D,Math.max(-D,d.apply(this,arguments)-A)),S,L=Math.min(Math.abs(e)/u,i.apply(this,arguments)),w=L*(e<0?-1:1),b;for(s=0;s<u;++s)(b=f[p[s]=s]=+r(t[s],s,t))>0&&(v+=b);for(o!=null?p.sort(function(_,x){return o(f[_],f[x])}):a!=null&&p.sort(function(_,x){return a(t[_],t[x])}),s=0,h=v?(e-u*w)/v:0;s<u;++s,A=S)g=p[s],b=f[g],S=A+(b>0?b*h:0)+w,f[g]={data:t[g],index:s,value:b,startAngle:A,endAngle:S,padAngle:L};return f}return l.value=function(t){return arguments.length?(r=typeof t=="function"?t:k(+t),l):r},l.sortValues=function(t){return arguments.length?(o=t,a=null,l):o},l.sort=function(t){return arguments.length?(a=t,o=null,l):a},l.startAngle=function(t){return arguments.length?(c=typeof t=="function"?t:k(+t),l):c},l.endAngle=function(t){return arguments.length?(d=typeof t=="function"?t:k(+t),l):d},l.padAngle=function(t){return arguments.length?(i=typeof t=="function"?t:k(+t),l):i},l}const Gt=Object.assign(Object.assign({},st),{id:(r,o)=>{var a;return(a=r.id)!==null&&a!==void 0?a:o},value:void 0,angleRange:[0,2*Math.PI],padAngle:0,sortFunction:void 0,cornerRadius:0,color:void 0,radius:void 0,arcWidth:20,centralLabel:void 0,centralSubLabel:void 0,centralSubLabelWrap:!0,showEmptySegments:!1,emptySegmentAngle:.5*Math.PI/180,showBackground:!0,backgroundAngleRange:void 0,centralLabelOffsetX:void 0,centralLabelOffsetY:void 0});function Tt(r,o){r.style("fill",a=>Y(a.data,o.color,a.index)).style("opacity",0).each((a,c,d)=>{const i=d[c],l=(a.startAngle+a.endAngle)/2,t=(a.endAngle-a.startAngle)/2;i._animState={startAngle:l-t,endAngle:l+t,innerRadius:a.innerRadius,outerRadius:a.outerRadius,padAngle:a.padAngle}})}function Ct(r,o,a,c){r.style("transition",`fill ${c}ms`).style("fill",i=>Y(i.data,o.color,i.index));const d=i=>o.showEmptySegments||i.value?1:0;c?B(r,c).style("opacity",d).attrTween("d",(l,t,s)=>{const u=s[t],g={startAngle:l.startAngle,endAngle:l.endAngle,innerRadius:l.innerRadius,outerRadius:l.outerRadius,padAngle:l.padAngle},h=it(u._animState,g);return v=>(u._animState=h(v),a(u._animState))}):r.attr("d",a).style("opacity",d)}function Dt(r,o){B(r,o).style("opacity",0).remove()}const X=Array.from({length:4},(r,o)=>{const a=-Math.PI/2+o*Math.PI/2;return[a,a+Math.PI]}),[Ut,Wt,Yt,Xt]=X,V=R`
  label: donut-component;
`,Mt=ut`
  :root {
    --vis-donut-central-label-font-size: 16px;
    --vis-donut-central-label-text-color: #5b5f6d;
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-donut-central-label-font-family: */
    --vis-donut-central-label-font-weight: 600;

    --vis-donut-central-sub-label-font-size: 12px;
    --vis-donut-central-sub-label-text-color: #5b5f6d;
    // Undefined by default to allow proper fallback to var(--vis-font-family)
    /* --vis-donut-central-sub-label-font-family: */
    --vis-donut-central-sub-label-font-weight: 500;

    --vis-donut-background-color: #E7E9F3;
    --vis-donut-segment-stroke-width: 0;
    // The line segment color variable is not defined by default
    // to allow it to fallback to the donut background color
    /* --vis-donut-segment-stroke-color: none; */

    --vis-dark-donut-central-label-text-color: #C2BECE;
    --vis-dark-donut-central-sub-label-text-color: #C2BECE;
    --vis-dark-donut-background-color: #18160C;
  }

  body.theme-dark ${`.${V}`} {
    --vis-donut-central-label-text-color: var(--vis-dark-donut-central-label-text-color);
    --vis-donut-central-sub-label-text-color: var(--vis-dark-donut-central-sub-label-text-color);
    --vis-donut-background-color: var(--vis-dark-donut-background-color);
  }
`,q=R`
  label: background;
  fill: var(--vis-donut-background-color);
`,M=R`
  label: segment;
  stroke-width: var(--vis-donut-segment-stroke-width);
  stroke: var(--vis-donut-segment-stroke-color, var(--vis-donut-background-color));
`,Q=R`
  label: segment-exit;
`,Z=R`
  label: central-label;
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: var(--vis-donut-central-label-font-size);
  font-family: var(--vis-donut-central-label-font-family, var(--vis-font-family));
  font-weight: var(--vis-donut-central-label-font-weight);
  fill: var(--vis-donut-central-label-text-color);
`,J=R`
  label: central-label;
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: var(--vis-donut-central-sub-label-font-size);
  font-family: var(--vis-donut-central-sub-label-font-family, var(--vis-font-family));
  font-weight: var(--vis-donut-central-sub-label-font-weight);
  fill: var(--vis-donut-central-sub-label-text-color);
`,Bt=Object.freeze(Object.defineProperty({__proto__:null,background:q,centralLabel:Z,centralSubLabel:J,root:V,segment:M,segmentExit:Q,variables:Mt},Symbol.toStringTag,{value:"Module"}));class K extends ct{constructor(o){super(),this._defaultConfig=Gt,this.config=this._defaultConfig,this.datamodel=new ht,this.arcGen=pt(),this.events={},o&&this.setConfig(o),this.arcBackground=this.g.append("path"),this.arcGroup=this.g.append("g"),this.centralLabel=this.g.append("text").attr("class",Z),this.centralSubLabel=this.g.append("text").attr("class",J)}get bleed(){return{top:0,bottom:0,left:0,right:0}}_render(o){var a,c,d,i,l,t,s,u,g,h,v,p,f,A;const{config:e,datamodel:S,bleed:L}=this,w=S.data.map((n,m)=>({index:m,datum:n})).filter(n=>e.showEmptySegments||U(n.datum,e.value,n.index)),b=dt(o)?o:e.duration,[_,x,E,O]=X.map(n=>e.angleRange&&e.angleRange[0]===n[0]&&e.angleRange[1]===n[1]),F=_||E,tt=x||O,et=this._width*(tt?2:1),nt=this._height*(F?2:1),y=e.radius||Math.min(et-L.left-L.right,nt-L.top-L.bottom)/2,N=e.arcWidth===0?0:gt(y-e.arcWidth,0,y-1),G=this._height/2+(_?y/2:E?-y/2:0),H=this._width/2+(O?y/2:x?-y/2:0),j=`translate(${H},${G})`;this.arcGroup.attr("transform",j),this.arcGen.startAngle(n=>n.startAngle).endAngle(n=>n.endAngle).innerRadius(n=>n.innerRadius).outerRadius(n=>n.outerRadius).padAngle(n=>n.padAngle).cornerRadius(e.cornerRadius);const at=Nt().startAngle((c=(a=e.angleRange)===null||a===void 0?void 0:a[0])!==null&&c!==void 0?c:0).endAngle((i=(d=e.angleRange)===null||d===void 0?void 0:d[1])!==null&&i!==void 0?i:2*Math.PI).padAngle(e.padAngle).value(n=>U(n.datum,e.value,n.index)||0).sort((n,m)=>{var C;return(C=e.sortFunction)===null||C===void 0?void 0:C.call(e,n.datum,m.datum)})(w).map(n=>{const m=Object.assign(Object.assign({},n),{data:n.data.datum,index:n.data.index,innerRadius:N,outerRadius:y});return e.showEmptySegments&&n.endAngle-n.startAngle-n.padAngle<=Number.EPSILON&&(m.endAngle=n.startAngle+Math.max(e.emptySegmentAngle,e.padAngle),m.padAngle=n.padAngle/2),m}),T=this.arcGroup.selectAll(`.${M}`).data(at,n=>e.id(n.data,n.index)),lt=T.enter().append("path").attr("class",M).call(Tt,e),P=T.merge(lt);P.call(Ct,e,this.arcGen,b),P.sort((n,m)=>m.value-n.value),T.exit().attr("class",Q).call(Dt,b);const I=x?"start":O?"end":"middle";this.centralLabel.attr("dy",e.centralSubLabel?"-0.55em":null).style("text-anchor",I).text((l=e.centralLabel)!==null&&l!==void 0?l:null),this.centralSubLabel.attr("dy",e.centralLabel?"0.55em":null).style("text-anchor",I).text((t=e.centralSubLabel)!==null&&t!==void 0?t:null),e.centralSubLabelWrap&&ft(this.centralSubLabel,N*1.9);const ot=(e.centralLabelOffsetX||0)+H;let $=(e.centralLabelOffsetY||0)+G;F&&e.centralLabelOffsetX===void 0&&e.centralLabelOffsetY===void 0&&($=(_?-this.centralSubLabel.node().getBoundingClientRect().height:E?this.centralLabel.node().getBoundingClientRect().height:0)+G);const z=`translate(${ot},${$})`;this.centralLabel.attr("transform",z),this.centralSubLabel.attr("transform",z),this.arcBackground.attr("class",q).attr("visibility",e.showBackground?null:"hidden").attr("transform",j),B(this.arcBackground,b).attr("d",this.arcGen({startAngle:(h=(u=(s=e.backgroundAngleRange)===null||s===void 0?void 0:s[0])!==null&&u!==void 0?u:(g=e.angleRange)===null||g===void 0?void 0:g[0])!==null&&h!==void 0?h:0,endAngle:(A=(p=(v=e.backgroundAngleRange)===null||v===void 0?void 0:v[1])!==null&&p!==void 0?p:(f=e.angleRange)===null||f===void 0?void 0:f[1])!==null&&A!==void 0?A:2*Math.PI,innerRadius:N,outerRadius:y}))}}K.selectors=Bt;const Ft={"data-vis-component":""},Vt=At({__name:"index",props:{id:{type:Function},value:{type:[Function,Number,null]},angleRange:{},padAngle:{},sortFunction:{type:Function},cornerRadius:{},color:{type:[Function,String,Array,null]},radius:{},arcWidth:{},centralLabel:{},centralSubLabel:{},centralSubLabelWrap:{type:Boolean},showEmptySegments:{type:Boolean},emptySegmentAngle:{},showBackground:{type:Boolean},backgroundAngleRange:{},centralLabelOffsetX:{},centralLabelOffsetY:{},duration:{},events:{},attributes:{},data:{}},setup(r,{expose:o}){const a=yt(bt),c=r,d=St(()=>a.data.value??c.data),i=vt(c),l=wt();return Lt(()=>{_t(()=>{var t;l.value=new K(i.value),(t=l.value)==null||t.setData(d.value),a.update(l.value)})}),xt(()=>{var t;(t=l.value)==null||t.destroy(),a.destroy()}),W(i,(t,s)=>{var u;mt(t,s)||(u=l.value)==null||u.setConfig(i.value)}),W(d,()=>{var t;(t=l.value)==null||t.setData(d.value)}),o({component:l}),(t,s)=>(kt(),Rt("div",Ft))}});export{Vt as E};
