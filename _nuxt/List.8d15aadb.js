import{d as r,a1 as l,J as u,O as n,a8 as p,k as _}from"./entry.874a287d.js";import{_ as f}from"./MDCSlot.65edde4c.js";import{u as m,f as d}from"./node.676c5e99.js";const y=()=>({unwrap:m,flatUnwrap:d}),h={primary:"heroicons-outline:check",info:"heroicons-outline:information-circle",success:"heroicons-outline:check-circle",warning:"heroicons-outline:exclamation",danger:"heroicons-outline:exclamation-circle"},g=r({props:{icon:{type:String,default:null},type:{type:String,default:"primary",validator:e=>["primary","info","success","warning","danger"].includes(e)}},setup(e){const a=l(),{flatUnwrap:o,unwrap:s}=y(),c=u(()=>e.icon||h[e.type]);return()=>{const i=o((a.default&&a.default())??[],["ul"]).map(t=>s(t,["li"]));return n("ul",i.map(t=>n("li",[n("span",{class:`list-icon ${e.type}`},n(p,{name:c.value,class:"icon"})),n("span",n(f,{use:()=>t}))])))}}});const k=_(g,[["__scopeId","data-v-d3fc0e8f"]]);export{k as default};
