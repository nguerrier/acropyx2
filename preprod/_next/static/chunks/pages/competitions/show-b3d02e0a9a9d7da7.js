(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[399],{6559:function(e,n,t){"use strict";var r=t(5318);n.Z=void 0;var s=r(t(4938)),i=t(5893),c=(0,s.default)((0,i.jsx)("path",{d:"M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"}),"Flight");n.Z=c},2643:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/competitions/show",function(){return t(6133)}])},6133:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return oe}});var r=t(8520),s=t.n(r),i=t(5893),c=t(7294),a=t(1163),o=t(4713),l=t(6886),d=t(5861),u=t(3321),h=t(666),x=t(2474),p=t(1458),j=t(7357),f=t(6242),Z=t(298),m=t(5050),v=t(5670),b=t(1496),g=t(44),y=t(1395),w=t(5071),k=t(1300),_=t(594),C=t(7440),P=t(3911),T=t(984),S=t(4229),R=t(5089),E=t(6559),N=t(2563),A=(t(4803),t(4117),t(7497),t(9780),t(5148)),O=t(9233),I=(t(1194),t(3521),t(7250)),X=t(3740),V=t(4451),H=t(3798),J=t(8321),L=t(4906),W=t(4267),z=t(295),F=t(3252),B=t(3816),D=t(3184),q=t(7906),M=t(2882),G=t(9755),K=t.n(G);t(6786);function Q(e,n,t,r,s,i,c){try{var a=e[i](c),o=a.value}catch(l){return void t(l)}a.done?n(o):Promise.resolve(o).then(r,s)}function U(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=[],r=!0,s=!1,i=void 0;try{for(var c,a=e[Symbol.iterator]();!(r=(c=a.next()).done)&&(t.push(c.value),!n||t.length!==n);r=!0);}catch(o){s=!0,i=o}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function Y(e){return function(e){if(Array.isArray(e)){for(var n=0,t=new Array(e.length);n<e.length;n++)t[n]=e[n];return t}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var $,ee=function(e){var n,t=e.code,r=U((0,A.z)(),4),a=(r[0],r[1],r[2],r[3]),o=(0,c.useState)(!1),u=o[0],h=o[1],x=(n=s().mark((function e(){var n,r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=U,e.next=3,(0,O.Xv)("/competitions/".concat(t,"/results"),{expect_json:!0});case 3:if(e.t1=e.sent,n=(0,e.t0)(e.t1,3),r=n[0],i=n[1],n[2],!r){e.next=12;break}return a("error while retrieving results for competition ".concat(t,": ").concat(r)),h(!1),e.abrupt("return");case 12:i.overall_results=i.overall_results.map((function(e,n){return e.rank=n+1,e})),h(i);case 14:case"end":return e.stop()}}),e)})),function(){var e=this,t=arguments;return new Promise((function(r,s){var i=n.apply(e,t);function c(e){Q(i,r,s,c,a,"next",e)}function a(e){Q(i,r,s,c,a,"throw",e)}c(void 0)}))});return(0,c.useEffect)((function(){x()}),[]),u?(window.onbeforeprint=function(e){K()(".hideToPrint").hide()},window.onafterprint=function(e){K()(".hideToPrint").show()},(0,i.jsxs)(W.Z,{children:[(0,i.jsx)(j.Z,{sx:{display:"flex",justifyContent:"center"},children:(0,i.jsxs)(d.Z,{variant:"h4",children:[(0,i.jsx)(R.Z,{fontSize:"large"}),u.final?"Final":"Intermediate"," Overall"]})}),(0,i.jsx)(l.ZP,{container:!0,spacing:7,children:(0,i.jsx)(l.ZP,{item:!0,xs:12,sm:12,children:(0,i.jsx)(M.Z,{children:(0,i.jsxs)(q.Z,{sx:{minWidth:750},children:[(0,i.jsx)(D.Z,{children:(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"Rank"}),(0,i.jsx)(F.Z,{children:"Pilot"}),(0,i.jsx)(F.Z,{children:"Run"}),(0,i.jsx)(F.Z,{children:"Score"}),(0,i.jsx)(F.Z,{children:"Rank"}),(0,i.jsx)(F.Z,{children:"Score"})]})}),(0,i.jsxs)(z.Z,{children:[u.overall_results.map((function(e,n){return(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:n+1}),(0,i.jsx)(F.Z,{children:e.pilot.name}),(0,i.jsx)(F.Z,{children:e.result_per_run.map((function(e,n){return"Run ".concat(n+1)})).reduce((function(e,n){return e?Y(e).concat([(0,i.jsx)("br",{}),n]):[n]}))}),(0,i.jsx)(F.Z,{children:e.result_per_run.map((function(e,n){return e.score.toFixed(3)})).reduce((function(e,n){return e?Y(e).concat([(0,i.jsx)("br",{}),n]):[n]}))}),(0,i.jsx)(F.Z,{children:e.result_per_run.map((function(e,n){return"".concat(e.rank)})).reduce((function(e,n){return e?Y(e).concat([(0,i.jsx)("br",{}),n]):[n]}))}),(0,i.jsx)(F.Z,{children:e.score.toFixed(3)})]},"result-".concat(n))})),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank1"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank2"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank3"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank4"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank5"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank6"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank7"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank8"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank9"),(0,i.jsxs)(B.Z,{children:[(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"}),(0,i.jsx)(F.Z,{children:"\xa0"})]},"blank10")]})]})})})})]})):"loading ..."},ne=t(1736);function te(e,n,t,r,s,i,c){try{var a=e[i](c),o=a.value}catch(l){return void t(l)}a.done?n(o):Promise.resolve(o).then(r,s)}function re(e){return function(){var n=this,t=arguments;return new Promise((function(r,s){var i=e.apply(n,t);function c(e){te(i,r,s,c,a,"next",e)}function a(e){te(i,r,s,c,a,"throw",e)}c(void 0)}))}}function se(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function ie(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=[],r=!0,s=!1,i=void 0;try{for(var c,a=e[Symbol.iterator]();!(r=(c=a.next()).done)&&(t.push(c.value),!n||t.length!==n);r=!0);}catch(o){s=!0,i=o}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var ce=(0,b.ZP)(g.Z)((function(e){var n=e.theme;return se($={},n.breakpoints.down("md"),{minWidth:100}),se($,n.breakpoints.down("sm"),{minWidth:67}),$})),ae=(0,b.ZP)("span")((function(e){var n=e.theme;return se({lineHeight:1.71,fontSize:"0.875rem",marginLeft:n.spacing(2.4)},n.breakpoints.down("md"),{display:"none"})})),oe=function(){var e=(0,a.useRouter)(),n=e.query,t=n.cid,r=(n.rid,ie((0,A.z)(),4)),b=r[0],g=(r[1],r[2],r[3]),W=(0,o.aF)(),z=(W.user,W.authError,W.authIisLoading,(0,c.useState)({})),F=z[0],B=z[1],D=(0,c.useState)({}),q=D[0],M=D[1],G=(0,c.useState)(!1),K=G[0],Q=G[1],U=(0,c.useState)("actions"),Y=U[0],$=U[1],te=ie((0,O.XH)(),1)[0],se=ie((0,O.y2)(),1)[0],oe=ie((0,O.Vf)(),1)[0],le=ie((0,O.Rs)(),1)[0],de=(0,c.useRef)(),ue=(0,c.useRef)(),he=(0,c.useRef)(),xe=(0,c.useRef)(),pe=(0,c.useRef)(),je=re(s().mark((function e(){var n,r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Q(!0),e.t0=ie,e.next=4,(0,O.Xv)("/competitions/".concat(t),{expect_json:!0});case 4:if(e.t1=e.sent,n=(0,e.t0)(e.t1,3),r=n[0],i=n[1],n[2],!r){e.next=14;break}return B(!1),M(!1),g("Error while retrieving competitions list: ".concat(r)),e.abrupt("return");case 14:i.delete="delete",i.update="update",i.id=i._id,B(i),M(Object.assign({},i)),Q(!1);case 20:case"end":return e.stop()}}),e)}))),fe=re(s().mark((function n(r){var i,c,a,o;return s().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r.preventDefault(),i="/competitions/".concat(t),"PATCH",204,c={name:q.name,code:q.code,start_date:q.start_date,end_date:q.end_date,location:q.location,published:q.published,type:q.type},n.t0=ie,n.next=8,(0,O.Xv)(i,{expected_status:204,method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});case 8:if(n.t1=n.sent,a=(0,n.t0)(n.t1,3),o=a[0],a[1],a[2],!o){n.next=16;break}return g("error while updating competition ".concat(t,": ").concat(o)),n.abrupt("return");case 16:if(q.code==F.code){n.next=18;break}return n.abrupt("return",e.push("/competitions/show?cid=".concat(q.code)));case 18:je();case 19:case"end":return n.stop()}}),n)}))),Ze=re(s().mark((function e(n){var r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=ie,e.next=3,(0,O.Xv)("/competitions/".concat(t,"/pilots"),{expected_status:204,method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n.map((function(e){return e.civlid})))});case 3:if(e.t1=e.sent,r=(0,e.t0)(e.t1,3),i=r[0],r[1],r[2],!i){e.next=11;break}return g("error while updating pilots list ".concat(t,": ").concat(i)),e.abrupt("return");case 11:je();case 12:case"end":return e.stop()}}),e)}))),me=re(s().mark((function e(n){var r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=ie,e.next=3,(0,O.Xv)("/competitions/".concat(t,"/teams"),{expected_status:204,method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n.map((function(e){return e.id})))});case 3:if(e.t1=e.sent,r=(0,e.t0)(e.t1,3),i=r[0],r[1],r[2],!i){e.next=11;break}return g("error while updating teams list ".concat(t,": ").concat(i)),e.abrupt("return");case 11:je();case 12:case"end":return e.stop()}}),e)}))),ve=re(s().mark((function e(n){var r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=ie,e.next=3,(0,O.Xv)("/competitions/".concat(t,"/judges"),{expected_status:204,method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n.map((function(e){return e.id})))});case 3:if(e.t1=e.sent,r=(0,e.t0)(e.t1,3),i=r[0],r[1],r[2],!i){e.next=11;break}return g("error while updating judges list ".concat(t,": ").concat(i)),e.abrupt("return");case 11:je();case 12:case"end":return e.stop()}}),e)}))),be=re(s().mark((function e(n){var r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=ie,e.next=3,(0,O.Xv)("/competitions/".concat(t,"/repeatable_tricks"),{expected_status:204,method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n.map((function(e){return e.id})))});case 3:if(e.t1=e.sent,r=(0,e.t0)(e.t1,3),i=r[0],r[1],r[2],!i){e.next=11;break}return g("error while updating repeatable tricks list ".concat(t,": ").concat(i)),e.abrupt("return");case 11:je();case 12:case"end":return e.stop()}}),e)}))),ge=re(s().mark((function e(n){var r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=ie,e.next=3,(0,O.Xv)("/competitions/".concat(t,"/config"),{expected_status:204,method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});case 3:if(e.t1=e.sent,r=(0,e.t0)(e.t1,3),i=r[0],r[1],r[2],!i){e.next=11;break}return g("error while updating config ".concat(t,": ").concat(i)),e.abrupt("return");case 11:je();case 12:case"end":return e.stop()}}),e)}))),ye=re(s().mark((function e(n){var r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(confirm("Are you sure to ".concat(n," this competition ?"))){e.next=2;break}return e.abrupt("return");case 2:return e.t0=ie,e.next=5,(0,O.Xv)("/competitions/".concat(t,"/").concat(n),{expected_status:204,method:"POST"});case 5:if(e.t1=e.sent,r=(0,e.t0)(e.t1,3),i=r[0],r[1],r[2],!i){e.next=13;break}return g("error while ".concat(n," competition ").concat(t,": ").concat(i)),e.abrupt("return");case 13:je();case 14:case"end":return e.stop()}}),e)})));re(s().mark((function e(n){var t,r,i;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return alert("No yet implemented! #TODO"),e.abrupt("return");case 5:return Q(!0),e.t0=ie,e.next=9,(0,O.Xv)("/competitions/".concat(t),{method:"DELETE",expected_status:204});case 9:e.t1=e.sent,r=(0,e.t0)(e.t1,3),i=r[0],r[1],r[2],i?g("Error while deleting Competition ".concat(t,": ").concat(i)):b("Competition ".concat(t," successfully deleted")),je();case 16:case"end":return e.stop()}}),e)})));return(0,c.useEffect)((function(){e.isReady&&je()}),[e.isReady]),K||!e.isReady?(0,i.jsxs)(j.Z,{sx:{width:"100%",textAlign:"center"},children:[(0,i.jsx)(p.Z,{}),"Loading"]}):F?(0,i.jsxs)(l.ZP,{container:!0,spacing:6,children:[(0,i.jsx)(l.ZP,{item:!0,xs:12,children:(0,i.jsxs)(d.Z,{variant:"h5",children:[F.name,(0,i.jsx)(h.Z,{className:"hideToPrint",onClick:je})]})}),(0,i.jsxs)(l.ZP,{item:!0,xs:12,md:6,sx:{paddingBottom:4},children:[(0,i.jsx)(d.Z,{children:(0,i.jsx)(I.Z,{text:q.name,title:"Name",onChange:fe,onCancel:function(e){M(F)},childRef:de,children:(0,i.jsx)(x.Z,{fullWidth:!0,name:"name",label:"Name",placeholder:"Name",defaultValue:q.name,inputProps:{ref:de},onChange:function(e){q.name=e.target.value,M(q)}})})}),(0,i.jsx)(d.Z,{children:(0,i.jsx)(I.Z,{text:q.code,title:"Code",onChange:fe,onCancel:function(e){M(F)},childRef:ue,children:(0,i.jsx)(x.Z,{fullWidth:!0,name:"code",label:"Code",placeholder:"Code",defaultValue:q.code,inputProps:{ref:ue},onChange:function(e){q.code=e.target.value,M(q)}})})}),(0,i.jsxs)(d.Z,{children:["Status: ",(0,i.jsx)("strong",{children:q.state}),"init"==F.state&&(0,i.jsx)(u.Z,{variant:"outlined",className:"hideToPrint",startIcon:(0,i.jsx)(k.Z,{}),onClick:function(){return ye("open")},children:"Open"}),"open"==F.state&&(0,i.jsx)(u.Z,{variant:"outlined",className:"hideToPrint",startIcon:(0,i.jsx)(_.Z,{}),onClick:function(){return ye("close")},children:"Close"}),"closed"==F.state&&(0,i.jsx)(u.Z,{variant:"outlined",className:"hideToPrint",startIcon:(0,i.jsx)(C.Z,{}),onClick:function(){return ye("reopen")},children:"Reopen"})]}),(0,i.jsxs)(d.Z,{children:["Type: ",(0,i.jsx)("strong",{children:q.type})]})]}),(0,i.jsxs)(l.ZP,{item:!0,xs:12,md:6,sx:{paddingBottom:4},children:[(0,i.jsx)(d.Z,{children:(0,i.jsx)(I.Z,{text:q.start_date,title:"Start date",onChange:fe,onCancel:function(e){M(F)},childRef:he,children:(0,i.jsx)(x.Z,{fullWidth:!0,name:"start_date",label:"Start date",placeholder:"Start date",defaultValue:q.start_date,inputProps:{ref:he},onChange:function(e){q.start_date=e.target.value,M(q)}})})}),(0,i.jsx)(d.Z,{children:(0,i.jsx)(I.Z,{text:q.end_date,title:"End date",onChange:fe,onCancel:function(e){M(F)},childRef:xe,children:(0,i.jsx)(x.Z,{fullWidth:!0,name:"end_date",label:"End date",placeholder:"End date",defaultValue:q.end_date,inputProps:{ref:xe},onChange:function(e){q.end_date=e.target.value,M(q)}})})}),(0,i.jsx)(d.Z,{children:(0,i.jsx)(I.Z,{text:q.location,title:"Location",onChange:fe,onCancel:function(e){M(F)},childRef:pe,children:(0,i.jsx)(x.Z,{fullWidth:!0,name:"location",label:"Location",placeholder:"Location",defaultValue:q.location,inputProps:{ref:pe},onChange:function(e){q.location=e.target.value,M(q)}})})}),(0,i.jsx)(d.Z,{children:(0,i.jsx)("section",{children:(0,i.jsx)("div",{children:(0,i.jsxs)("span",{children:["Published:",(0,i.jsx)(w.Z,{checked:q.published,onChange:function(e){confirm("Are you sure to ".concat(e.target.checked?"publish":"unpublish"," the competition ?"))?(q.published=e.target.checked,M(q),fe(e)):e.target.checked=!e.target.checked}})]})})})})]}),(0,i.jsx)(l.ZP,{item:!0,xs:12,children:(0,i.jsx)(f.Z,{children:(0,i.jsxs)(v.ZP,{value:Y,children:[(0,i.jsxs)(Z.Z,{className:"hideToPrint",onChange:function(e,n){$(n)},"aria-label":"account-settings tabs",sx:{borderBottom:function(e){return"1px solid ".concat(e.palette.divider)}},children:["solo"==F.type&&(0,i.jsx)(ce,{value:"pilots",label:(0,i.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(y.Z,{}),(0,i.jsx)(ae,{children:"Pilots"})]})}),"synchro"==F.type&&(0,i.jsx)(ce,{value:"teams",label:(0,i.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(N.Z,{}),(0,i.jsx)(ae,{children:"Teams"})]})}),(0,i.jsx)(ce,{value:"judges",label:(0,i.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(P.Z,{}),(0,i.jsx)(ae,{children:"Judges"})]})}),(0,i.jsx)(ce,{value:"repeatable_tricks",label:(0,i.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(T.Z,{}),(0,i.jsx)(ae,{children:"Repeatables tricks"})]})}),(0,i.jsx)(ce,{value:"settings",label:(0,i.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(S.Z,{}),(0,i.jsx)(ae,{children:"Competition Settings"})]})}),(0,i.jsx)(ce,{value:"runs",label:(0,i.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(E.Z,{}),(0,i.jsx)(ae,{children:"Runs"})]})}),(0,i.jsx)(ce,{value:"results",label:(0,i.jsxs)(j.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,i.jsx)(R.Z,{}),(0,i.jsx)(ae,{children:"Results"})]})})]}),(0,i.jsx)(m.Z,{sx:{p:0},value:"pilots",children:(0,i.jsx)(H.Z,{pilots:F.pilots,allPilots:te,update:function(e){return Ze(e)}})}),(0,i.jsx)(m.Z,{sx:{p:0},value:"teams",children:(0,i.jsx)(V.Z,{teams:F.teams,allTeams:se,update:function(e){return me(e)}})}),(0,i.jsx)(m.Z,{sx:{p:0},value:"judges",children:(0,i.jsx)(J.Z,{judges:F.judges,allJudges:oe,update:function(e){return ve(e)}})}),(0,i.jsx)(m.Z,{sx:{p:0},value:"repeatable_tricks",children:(0,i.jsx)(ne.Z,{tricks:F.repeatable_tricks,allTricks:le,update:function(e){return be(e)}})}),(0,i.jsx)(m.Z,{sx:{p:0},value:"settings",children:(0,i.jsx)(L.Z,{config:F.config,update:function(e){return ge(e)},type:F.type})}),(0,i.jsx)(m.Z,{sx:{p:0},value:"runs",children:(0,i.jsx)(X.Z,{comp:F,refresh:je})}),(0,i.jsx)(m.Z,{sx:{p:0},value:"results",children:(0,i.jsx)(ee,{code:t})})]})})})]}):(g("Empty or invalid data"),"")}}},function(e){e.O(0,[571,885,808,698,109,725,404,738,335,457,774,888,179],(function(){return n=2643,e(e.s=n);var n}));var n=e.O();_N_E=n}]);