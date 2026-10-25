const variables=await figma.variables.getLocalVariablesAsync();
const names=Object.fromEntries(variables.map(v=>[v.id,v.name]));
const board=await figma.getNodeByIdAsync('1:261');
const all=board.findAll(()=>true);
const frames=board.findAllWithCriteria({types:['INSTANCE']}).filter(n=>['Aura','Iris','Coastal'].some(t=>n.name.startsWith(t+' / ')));
const mismatches=[],contrastFailures=[],overflows=[],counts={},signatures={Home:[],Records:[]};let minimumContrast=100,checkedTextPairs=0;
function lum(c){return [c.r,c.g,c.b].map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
function solid(n){return 'fills'in n&&Array.isArray(n.fills)?n.fills.find(p=>p.type==='SOLID'&&p.visible!==false&&p.opacity!==0):null;}
for(const n of all)counts[n.type]=(counts[n.type]||0)+1;
for(const frame of frames){
 const parts=frame.name.split(' / '),theme=parts.slice(0,2).join('/');
 const texts=frame.findAllWithCriteria({types:['TEXT']});signatures[parts[2]].push(texts.map(t=>t.characters).join('|'));
 for(const n of frame.findAll(()=>true)){
  for(const field of ['fills','strokes'])if(field in n&&Array.isArray(n[field]))for(const p of n[field]){const name=names[p.boundVariables?.color?.id];if(name&&name.split('/').length===3&&!name.startsWith(theme+'/'))mismatches.push({frame:frame.name,node:n.name,variable:name});}
  if(n.type==='TEXT'){const f=solid(n);let p=n.parent,bg;while(p&&!bg){bg=solid(p);p=p.parent;}if(f&&bg){const a=lum(f.color),b=lum(bg.color),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);minimumContrast=Math.min(minimumContrast,ratio);checkedTextPairs++;if(ratio<4.5)contrastFailures.push({frame:frame.name,node:n.name,ratio});}}
  if('children'in n&&'layoutMode'in n&&n.layoutMode!=='NONE')for(const c of n.children)if(c.x+c.width>n.width+1||c.y+c.height>n.height+1)overflows.push({frame:frame.name,parent:n.name,child:c.name});
 }
}
return {screenCount:frames.length,screenDimensions:[...new Set(frames.map(f=>f.width+'×'+f.height))],descendantCount:all.length,counts,imageNodes:all.filter(n=>'fills'in n&&Array.isArray(n.fills)&&n.fills.some(p=>p.type==='IMAGE')).map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),fontFamilies:[...new Set(all.filter(n=>n.type==='TEXT').map(n=>n.fontName.family))],identicalContent:Object.fromEntries(Object.entries(signatures).map(([k,v])=>[k,new Set(v).size===1])),checkedTextPairs,minimumContrast,mismatches,contrastFailures,overflows};
