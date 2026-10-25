// createVariableCollection pattern from the Figma library skill.
async function createVariableCollection(name, modeNames) {
  const collection = figma.variables.createVariableCollection(name);
  collection.renameMode(collection.modes[0].modeId, modeNames[0]);
  const modeIds = {[modeNames[0]]:collection.modes[0].modeId};
  for (const name of modeNames.slice(1)) modeIds[name] = collection.addMode(name);
  return {collection, modeIds};
}
await Promise.all(['Regular','Medium','Semi Bold','Bold'].map(style => figma.loadFontAsync({family:'Inter',style})));
const existing = await figma.variables.getLocalVariableCollectionsAsync();
if (existing.some(c => c.name === 'MedWillow / Color')) throw new Error('Foundations exist; inspect ledger before resuming.');
const prim = await createVariableCollection('MedWillow / Primitives',['Value']);
const color = await createVariableCollection('MedWillow / Color',['Theme sets']);
const space = await createVariableCollection('MedWillow / Geometry',['Value']);
const variables = {}, primitives = {};
function hex(h){return {r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255,a:1};}
for(const [theme, roles] of Object.entries(THEMES)){
  for(const [role,value] of Object.entries(roles)){
    if(!primitives[value]){
      const v=figma.variables.createVariable('hex/'+value.slice(1),prim.collection,'COLOR');
      v.scopes=[];v.setValueForMode(prim.modeIds.Value,hex(value));v.setVariableCodeSyntax('WEB','var(--palette-'+value.slice(1).toLowerCase()+')');primitives[value]=v;
    }
    const name=theme+'/'+role;
    const v=figma.variables.createVariable(name,color.collection,'COLOR');
    v.scopes=role==='border'?['STROKE_COLOR']:['text','muted','onPrimary','accentText','heroText','goodText','reviewText'].includes(role)?['TEXT_FILL','SHAPE_FILL','STROKE_COLOR']:['FRAME_FILL','SHAPE_FILL','STROKE_COLOR'];
    v.setValueForMode(color.modeIds['Theme sets'],{type:'VARIABLE_ALIAS',id:primitives[value].id});
    v.setVariableCodeSyntax('WEB','var(--'+name.toLowerCase().replaceAll('/','-')+')');variables[name]=v.id;
  }
}
for(const [prefix,values,scopes] of [['space',[0,4,8,12,16,20,24,32,48,64],['GAP']],['radius',[8,12,16,24,32,999],['CORNER_RADIUS']]]){
  for(const n of values){const v=figma.variables.createVariable(prefix+'/'+n,space.collection,'FLOAT');v.scopes=scopes;v.setValueForMode(space.modeIds.Value,n);v.setVariableCodeSyntax('WEB','var(--'+prefix+'-'+n+')');variables[prefix+'/'+n]=v.id;}
}
const styleIds={};
for(const [name,size,style,line] of [['Hero',32,'Semi Bold',40],['Title',24,'Semi Bold',32],['Section',18,'Semi Bold',24],['Label',16,'Semi Bold',24],['Body',16,'Regular',24],['Small',14,'Regular',20],['SmallStrong',14,'Semi Bold',20],['Nav',12,'Medium',16]]){
  const s=figma.createTextStyle();s.name='MedWillow/'+name;s.fontName={family:'Inter',style};s.fontSize=size;s.lineHeight={unit:'PIXELS',value:line};styleIds[name]=s.id;
}
figma.currentPage.name='01 · Theme comparison';
return {createdNodeIds:[],mutatedNodeIds:[figma.currentPage.id],collections:[prim.collection.id,color.collection.id,space.collection.id],variables,primitiveIds:Object.values(primitives).map(v=>v.id),styleIds,variableCount:Object.keys(variables).length+Object.keys(primitives).length,modeStrategy:'Explicit Light/Dark semantic token sets in one mode, compatible with Starter plan. System preference remains a prototype requirement.'};
