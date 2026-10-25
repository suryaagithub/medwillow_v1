await Promise.all(['Regular','Medium','Semi Bold','Bold'].map(style=>figma.loadFontAsync({family:'Inter',style})));
const lib=await figma.getNodeByIdAsync('3:2');const set=await figma.getNodeByIdAsync('3:1369');
const vars={};for(const v of await figma.variables.getLocalVariablesAsync()) vars[v.name]=v;
const names=Object.fromEntries(Object.values(vars).map(v=>[v.id,v.name]));
const coll=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name==='MedWillow / Color');
const primitive=Object.values(vars).find(v=>v.name==='hex/172B46');
for(const theme of ['Aura','Iris','Coastal'])for(const mode of ['Light','Dark']){
 const n=theme+'/'+mode+'/accentInk';const v=figma.variables.createVariable(n,coll,'COLOR');v.scopes=['TEXT_FILL','SHAPE_FILL','STROKE_COLOR'];v.setValueForMode(coll.defaultModeId,{type:'VARIABLE_ALIAS',id:primitive.id});v.setVariableCodeSyntax('WEB','var(--'+n.toLowerCase().replaceAll('/','-')+')');vars[n]=v;names[v.id]=n;
}
function bind(n,field,v){n[field]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v)];}
function skin(root,theme){for(const n of [root,...root.findAll(()=>true)])for(const field of ['fills','strokes'])if(field in n&&Array.isArray(n[field])){n[field]=n[field].map(p=>{const name=names[p.boundVariables?.color?.id];if(p.type!=='SOLID'||!name||name.split('/').length!==3)return p;const role=name.split('/')[2];return vars[theme+'/'+role]?figma.variables.setBoundVariableForPaint(p,'color',vars[theme+'/'+role]):p;});}}
const baseIds=['3:5','3:7','3:9','3:13','3:27','3:35','3:59','3:15'];
const source=await Promise.all(baseIds.map(id=>figma.getNodeByIdAsync(id)));
const family=source.find(c=>c.id==='3:27');const av=family.findOne(n=>n.name==='Avatar');bind(av,'fills',vars['Aura/Light/mint']);for(const n of av.findAllWithCriteria({types:['TEXT']}))bind(n,'fills',vars['Aura/Light/accentInk']);
const maps={'Aura/Light':Object.fromEntries(source.map(c=>[c.id,c]))};const created=[];
for(const theme of ['Aura/Light','Aura/Dark','Iris/Light','Iris/Dark','Coastal/Light','Coastal/Dark']){
 if(theme==='Aura/Light')continue;const map={};maps[theme]=map;
 for(const base of source){const c=base.clone();lib.appendChild(c);c.name=base.name+' / '+theme;skin(c,theme);for(const inst of c.findAllWithCriteria({types:['INSTANCE']})){const replacement=map[inst.mainComponent.id];if(replacement)inst.swapComponent(replacement);}map[base.id]=c;created.push(c,...c.findAll(()=>true));}
}
const mutated=[family.id,av.id];
for(const s of set.children){const theme=s.name.match(/Theme=(\w+)/)[1]+'/'+s.name.match(/Appearance=(\w+)/)[1];const map=maps[theme];
 // Swap direct component instances first, then nested status overrides.
 const direct=s.findAllWithCriteria({types:['INSTANCE']}).filter(n=>!n.id.startsWith('I'));
 for(const i of direct){const baseId=i.mainComponent.id;if(map[baseId]&&map[baseId].id!==baseId)i.swapComponent(map[baseId]);mutated.push(i.id);}
 for(const i of s.findAllWithCriteria({types:['INSTANCE']})){const baseId=i.mainComponent.id;if(map[baseId]&&map[baseId].id!==baseId){i.swapComponent(map[baseId]);mutated.push(i.id);}}
 // A peach and mint accent add warmth without carrying clinical meaning.
 for(const [name,role] of [['Add\nmedicine','peach'],['Care\nplan','mint']]){const tile=s.findOne(n=>n.name===name);if(!tile)continue;bind(tile,'fills',vars[theme+'/'+role]);mutated.push(tile.id);for(const n of tile.findAll(()=>true)){if(n.type==='TEXT')bind(n,'fills',vars[theme+'/accentInk']);if('strokes' in n&&n.strokes.length)bind(n,'strokes',vars[theme+'/accentInk']);mutated.push(n.id);}}
 // Prepare button's nested label inherits from the primary component; use the soft variant.
 const prepare=s.findOne(n=>n.name==='Prepare doctor visit'&&n.type==='INSTANCE');if(prepare){prepare.swapComponent(map['3:7']);bind(prepare,'fills',vars[theme+'/soft']);mutated.push(prepare.id);}
}
const board=await figma.getNodeByIdAsync('1:261');
return {createdNodeIds:created.map(n=>n.id),mutatedNodeIds:mutated,themeComponentIds:Object.fromEntries(Object.entries(maps).map(([k,v])=>[k,Object.fromEntries(Object.entries(v).map(([b,n])=>[b,n.id]))])),boardId:board.id};
