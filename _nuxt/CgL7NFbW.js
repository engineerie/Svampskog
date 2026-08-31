import{c as g,q as z,ag as C,k as w,z as S,a3 as B,n as E,p as H}from"./DQS-DgH0.js";import{P as n}from"./z7MCSWeV.js";import{Z as D,bd as N,o as I,a6 as L,c as O,a5 as X,d as Y,e as A,r as U}from"./CPJaI1G0.js";function W(l){let t;for(;t=l.sourceEvent;)l=t;return l}function P(l,t){if(l=W(l),t===void 0&&(t=l.currentTarget),t){var o=t.ownerSVGElement||t;if(o.createSVGPoint){var e=o.createSVGPoint();return e.x=l.clientX,e.y=l.clientY,e=e.matrixTransform(t.getScreenCTM().inverse()),[e.x,e.y]}if(t.getBoundingClientRect){var i=t.getBoundingClientRect();return[l.clientX-i.left-t.clientLeft,l.clientY-i.top-t.clientTop]}}return[l.pageX,l.pageY]}const R={components:[],container:void 0,followCursor:!0,allowHover:!1,horizontalPlacement:n.Auto,horizontalShift:0,verticalPlacement:n.Top,verticalShift:0,attributes:{},triggers:{},className:void 0,showDelay:void 0,hideDelay:void 0},b=g`
  label: tooltip;
  display: inline-block;
  left: 0;
  bottom: 0;
  min-width: max-content;
  position: absolute;
  opacity: 0;
  transition: opacity;
  transition-duration: var(--vis-tooltip-transition-duration);
  z-index: 999999;
  padding: var(--vis-tooltip-padding);
  color: var(--vis-tooltip-text-color);
  border-radius: var(--vis-tooltip-border-radius);
  box-shadow: var(--vis-tooltip-box-shadow);
  border: solid 1px var(--vis-tooltip-border-color);
  background-color: var(--vis-tooltip-background-color);
  backdrop-filter: var(--vis-tooltip-backdrop-filter);
`,j=b,M=z`
  :root {
    --vis-tooltip-background-color: rgba(255, 255, 255, 0.95);
    --vis-tooltip-border-color: #e5e9f7;
    --vis-tooltip-text-color: #000;
    --vis-tooltip-shadow-color: rgba(172, 179, 184, 0.35);
    --vis-tooltip-backdrop-filter: none;
    --vis-tooltip-padding: 10px 15px;
    --vis-tooltip-border-radius: 5px;
    --vis-tooltip-transition-duration: 300ms;
    --vis-tooltip-box-shadow: none;

    --vis-dark-tooltip-background-color: rgba(30,30,30, 0.95);
    --vis-dark-tooltip-text-color: #e5e9f7;
    --vis-dark-tooltip-border-color: var(--vis-color-grey);
    --vis-dark-tooltip-shadow-color: rgba(0,0,0, 0.95);
  }

  body.theme-dark ${`.${b}`} {
    --vis-tooltip-background-color: var(--vis-dark-tooltip-background-color);
    --vis-tooltip-text-color: var(--vis-dark-tooltip-text-color);
    --vis-tooltip-border-color: var(--vis-dark-tooltip-border-color);
    --vis-tooltip-shadow-color: var(--vis-dark-tooltip-shadow-color);
  }

  body.theme-dark {
    --vis-tooltip-background-color: rgba(30,30,30, 0.95);
    --vis-tooltip-text-color: #e5e9f7;
    --vis-tooltip-border-color: var(--vis-color-grey);
    --vis-tooltip-shadow-color: rgba(0,0,0, 0.95);
  }
`,T=g`
  bottom: unset;
  position: fixed;
`,_=g`
  opacity: 1;
`,y=g`
  display: none;
`,x=g`
  label: non-interactive;
  pointer-events: none;
  user-select: none;
`,$=Object.freeze(Object.defineProperty({__proto__:null,hidden:y,nonInteractive:x,positionFixed:T,root:b,show:_,tooltip:j,variables:M},Symbol.toStringTag,{value:"Module"}));class k{constructor(t={}){this._defaultConfig=R,this.config=this._defaultConfig,this._setUpEventsThrottled=C(this._setUpEvents,500),this._setContainerPositionThrottled=C(this._setContainerPosition,500),this._isShown=!1,this.element=document.createElement("div"),this.div=w(this.element).attr("class",b).classed(_,!1).classed(y,!0),this.setConfig(t),this.components=this.config.components,this._mutationObserver=new MutationObserver(()=>{this._isShown&&(!this.config.followCursor&&this._hoveredElement?this.placeByElement(this._hoveredElement):this._position&&this.place({x:this._position[0],y:this._position[1]}))}),this._mutationObserver.observe(this.div.node(),{childList:!0,subtree:!0})}setConfig(t){var o;this.prevConfig=this.config,this.config=S(this._defaultConfig,t),this.prevConfig.horizontalPlacement!==this.config.horizontalPlacement&&this.overrideHorizontalPlacement(void 0),this.config.container&&this.config.container!==((o=this.prevConfig)===null||o===void 0?void 0:o.container)&&this.setContainer(this.config.container),this._setUpAttributes()}setContainer(t){var o;(o=this.element.parentNode)===null||o===void 0||o.removeChild(this.element),this._container=t,this._container.appendChild(this.element),this._setContainerPositionThrottled()}getContainer(){return this._container}hasContainer(){return!!this._container&&this._container.isConnected}setComponents(t){this.components=t}update(){this._container&&this._setUpEventsThrottled()}show(t,o){this.render(t),this.place(o)}_hide(){this.div.classed(_,!1).on("transitionend",()=>{this.div.classed(y,!this._isShown)}),this._isShown=!1}hide(){window.clearTimeout(this._showDelayTimeoutId),this.config.hideDelay?(window.clearTimeout(this._hideDelayTimeoutId),this._hideDelayTimeoutId=setTimeout(()=>this._hide(),this.config.hideDelay)):this._hide()}_display(){window.clearTimeout(this._hideDelayTimeoutId),this.div.classed(y,!1).classed(_,!0),this._isShown=!0}display(){this._isShown||(this.config.showDelay?(window.clearTimeout(this._showDelayTimeoutId),this._showDelayTimeoutId=setTimeout(()=>{this._display(),this.place({x:this._position[0],y:this._position[1]})},this.config.showDelay)):this._display())}place(t){if(this._position=[t.x,t.y],!this.hasContainer()){console.warn("Unovis | Tooltip: Container was not set or is not initialized yet");return}const{config:o}=this,e=this.element.offsetWidth,i=this.element.offsetHeight,s=this._overriddenHorizontalPlacement||(o.horizontalPlacement===n.Auto?n.Center:o.horizontalPlacement),c=o.verticalPlacement===n.Auto?t.y-i<0?n.Bottom:n.Top:o.verticalPlacement,r=5,a=s===n.Left?-e-r-o.horizontalShift:s===n.Center?-e/2:r+o.horizontalShift,h=c===n.Bottom?r+o.verticalShift:c===n.Center?-i/2:-r-o.verticalShift-i,[d,p]=this._constraintPosToContainer(t.x+a,t.y+h,e,i);this._applyPosition(d,p,i)}placeByElement(t){const{config:o}=this;this._hoveredElement=t;const e=5,i=this.element.offsetWidth,s=this.element.offsetHeight,c=this.isContainerBody(),r=c?window.innerWidth:this._container.scrollWidth,a=t.getBoundingClientRect(),h=c?[a.x,a.y]:P({clientX:a.x,clientY:a.y,pageX:a.x,pageY:a.y},this._container),d=this._overriddenHorizontalPlacement||(o.horizontalPlacement===n.Auto?h[0]-i<0?n.Right:h[0]+i>r?n.Left:n.Center:o.horizontalPlacement);let p=0;switch(d){case n.Left:p=-i-e-o.horizontalShift;break;case n.Right:p=a.width+e+o.horizontalShift;break;case n.Center:default:p=(-i+a.width)/2;break}const f=o.verticalPlacement===n.Auto?d!==n.Center?n.Center:h[1]-s<0?n.Bottom:n.Top:o.verticalPlacement;let v=-s;switch(f){case n.Center:v+=(s+a.height)/2;break;case n.Bottom:v+=s+a.height+e+o.verticalShift;break;case n.Top:default:v+=-e-o.verticalShift;break}const[u,m]=this._constraintPosToContainer(h[0]+p,h[1]+v,i,s);this._applyPosition(u,m,s)}isContainerBody(){return this._container===document.body}overrideHorizontalPlacement(t){this._overriddenHorizontalPlacement=t}render(t){var o;const{config:e,prevConfig:i}=this;t instanceof HTMLElement?this.div.select(":first-child").node()!==t&&this.div.html("").append(()=>t):t!==null&&this.div.html(t||""),this.div.classed((o=e.className)!==null&&o!==void 0?o:"",!!e.className).classed(x,!e.allowHover),i?.className&&i.className!==e.className&&this.div.classed(i.className,!1),this.display()}_applyPosition(t,o,e){const i=this.isContainerBody(),s=i?window.innerHeight:this._container.scrollHeight;this.div.classed(T,i).style("top",i?`${o}px`:"unset").style("bottom",i?"unset":`${s-o-e}px`).style("left",`${t}px`)}_constraintPosToContainer(t,o,e,i){const s=this.isContainerBody(),c=s?window.innerHeight:this._container.scrollHeight,r=s?window.innerWidth:this._container.scrollWidth,a=10,h=t>r-e-a,d=t<a,p=h?r-e-a:d?a:t,f=10,v=o>c-i-f,u=o<f,m=v?c-i-f:u?f:o;return[r<e?0:p,c<i?0:m]}_setContainerPosition(){var t;this._container!==document.body&&((t=getComputedStyle(this._container))===null||t===void 0?void 0:t.position)==="static"&&(this._container.style.position="relative")}_setUpEvents(){const{config:t}=this;this.components.forEach(o=>{const e=w(o.element);e.on("mousemove.tooltip",i=>{const{config:s}=this,c=i.composedPath&&i.composedPath()||i.path||[i.target];for(const r of Object.keys(s.triggers)){const a=s.triggers[r];if(!a)continue;const h=e.selectAll(`.${r}`).nodes();for(const d of c){if(d===e.node())break;if(d.classList.contains(r)){const p=h.indexOf(d),f=w(d).datum(),v=a(f,p,h),[u,m]=this.isContainerBody()?[i.clientX,i.clientY]:P(i,this._container);v===null?this.hide():(this.render(v),s.followCursor?this.place({x:u,y:m}):this.placeByElement(d)),i.stopPropagation();return}}}this._isShown&&this.hide()}).on("mouseleave.tooltip",i=>{i.stopPropagation(),this.hide()})}),t.allowHover?this.div.on("mouseenter.tooltip",this._display.bind(this)).on("mouseleave.tooltip",this.hide.bind(this)):this.div.on("mouseenter.tooltip",null).on("mouseleave.tooltip",null)}_setUpAttributes(){const t=this.config.attributes;t&&Object.keys(t).forEach(o=>{this.div.attr(o,t[o])})}destroy(){var t;this._mutationObserver.disconnect(),window.clearTimeout(this._hideDelayTimeoutId),window.clearTimeout(this._showDelayTimeoutId),(t=this.div)===null||t===void 0||t.remove()}}k.selectors=$;const G={"data-vis-tooltip":""},Z=D({__name:"index",props:{components:{},container:{},followCursor:{type:Boolean},allowHover:{type:Boolean},horizontalPlacement:{},horizontalShift:{},verticalPlacement:{},verticalShift:{},triggers:{},attributes:{},className:{},hideDelay:{},showDelay:{},data:{}},setup(l,{expose:t}){const o=N(B),e=E(l),i=U();return I(()=>{L(()=>{i.value=new k(e.value),o.update(i.value)})}),O(()=>{var s;(s=i.value)==null||s.destroy(),o.destroy()}),X(e,(s,c)=>{var r;H(s,c)||(r=i.value)==null||r.setConfig(e.value)}),t({component:i}),(s,c)=>(Y(),A("div",G))}});export{P as p,Z as z};
