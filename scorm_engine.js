/* ══ GENERIC SCORM MODULE ENGINE ══ */
var S = {
  lang:'en', page:0, visited:{},
  matchSel:{left:null,right:null}, matchPairs:[], matchDone:false,
  flashIdx:0, flashFlipped:false,
  dragOrder:[], dragChecked:false,
  quizAns:{}, quizSubmitted:false, quizScore:0,
};
function isRTL(){return S.lang==='ar'}
function getTitle(){return S.lang==='ar'?MOD_TITLE_AR:MOD_TITLE_EN}
function getSub(){return S.lang==='ar'?MOD_SUB_AR:MOD_SUB_EN}
function getAct(p){return MOD_ACTIVITIES[p-MOD_SLIDES]||null}
var L={
  en:{mod:'Module',next:'Next',prev:'Previous',of:'of',submit:'Submit',tryAgain:'Try Again',check:'Check Answers',score:'Score',pass:'Congratulations! You passed!',fail:'You need 80% to pass. Review and try again.',pt:'Pass: 80%',quiz:'Module Quiz',qd:'Answer all 5 questions. 80% required.',md:'All matched!',reset:'Reset',flip:'Tap to flip',co:'Check Order',ans:'answered',correct:'Correct!',tad:'Try Again'},
  ar:{mod:'\u0627\u0644\u0648\u062d\u062f\u0629',next:'\u0627\u0644\u062a\u0627\u0644\u064a',prev:'\u0627\u0644\u0633\u0627\u0628\u0642',of:'\u0645\u0646',submit:'\u0625\u0631\u0633\u0627\u0644',tryAgain:'\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649',check:'\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0625\u062c\u0627\u0628\u0627\u062a',score:'\u0627\u0644\u0646\u062a\u064a\u062c\u0629',pass:'\u062a\u0647\u0627\u0646\u064a\u0646\u0627! \u0644\u0642\u062f \u0646\u062c\u062d\u062a!',fail:'\u062a\u062d\u062a\u0627\u062c 80% \u0644\u0644\u0646\u062c\u0627\u062d. \u0631\u0627\u062c\u0639 \u0648\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.',pt:'\u062d\u062f \u0627\u0644\u0646\u062c\u0627\u062d: 80%',quiz:'\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0648\u062d\u062f\u0629',qd:'\u0623\u062c\u0628 \u0639\u0644\u0649 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629. \u062a\u062d\u062a\u0627\u062c 80%.',md:'\u062a\u0645 \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629!',reset:'\u0625\u0639\u0627\u062f\u0629',flip:'\u0627\u0636\u063a\u0637 \u0644\u0644\u0642\u0644\u0628',co:'\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062a\u0631\u062a\u064a\u0628',ans:'\u062a\u0645\u062a \u0627\u0644\u0625\u062c\u0627\u0628\u0629',correct:'\u0635\u062d\u064a\u062d!',tad:'\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649'}
};
function l(k){return L[S.lang][k]||k}

function slideContent(idx){
  var title=getTitle(),sub=getSub();
  if(idx===0){
    return '<div style="text-align:center"><div class="badge badge-cyan" style="margin-bottom:12px">\ud83d\udce6 '+l('mod')+' '+MOD_NUM+'</div><h2 class="slide-title">'+title+'</h2><p class="slide-subtitle">'+sub+'</p>'+(MOD_IMG?'<div style="max-width:400px;margin:16px auto"><img src="'+MOD_IMG+'" alt="Module"></div>':'')+'</div>';
  }
  var qs=S.lang==='ar'?MOD_QUIZ_AR:MOD_QUIZ_EN;
  if(idx<MOD_SLIDES-1){
    var qi=Math.min(idx-1,qs.length-1);
    if(qi>=0&&qi<qs.length){
      var q=qs[qi];
      return '<div class="info-box cyan"><h3 style="font-size:16px;font-weight:700;margin-bottom:8px">\ud83d\udcd6 '+(S.lang==='ar'?'\u0627\u0644\u0646\u0642\u0637\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 ':'Key Point ')+(idx+1)+'</h3><p style="font-size:14px;margin-bottom:8px"><strong>'+q.q+'</strong></p><div class="info-box emerald" style="margin-top:8px"><strong>\u2705 </strong>'+q.opts[q.correct]+'</div></div><div class="info-box slate" style="margin-top:12px"><p style="font-size:12px">'+(S.lang==='ar'?'\u062a\u0630\u0643\u0631 \u0647\u0630\u0627 \u0627\u0644\u0645\u0641\u0647\u0648\u0645 - \u0633\u064a\u0638\u0647\u0631 \u0641\u064a \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631!':'Remember this concept - it will appear in the quiz!')+'</p></div>';
    }
    return '<div class="info-box cyan"><h3 class="slide-title">'+title+'</h3><p class="slide-subtitle">'+sub+'</p></div>';
  }
  // Summary slide
  var h='<div style="text-align:center"><h2 class="slide-title">\ud83d\udccb '+(S.lang==='ar'?'\u0645\u0644\u062e\u0635 \u0627\u0644\u0648\u062d\u062f\u0629':'Module Summary')+'</h2><p class="slide-subtitle">'+(S.lang==='ar'?'\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u0642\u0628\u0644 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631':'Review key points before the quiz')+'</p><div style="text-align:left;max-width:600px;margin:16px auto">';
  for(var i=0;i<qs.length;i++){
    h+='<div class="info-box cyan" style="margin-bottom:8px"><strong>'+(i+1)+'. </strong>'+qs[i].q+'<br><span style="color:var(--emerald);font-weight:600">\u2705 '+qs[i].opts[qs[i].correct]+'</span></div>';
  }
  return h+'</div></div>';
}

function render(){
  var dir=isRTL()?'rtl':'ltr';
  document.documentElement.dir=dir;
  document.documentElement.lang=S.lang;
  var p=S.page,pType=PAGE_TYPES[p];
  S.visited[p]=true;
  var title=getTitle();
  var headerLabel='',headerColor='badge-cyan';
  if(pType==='slide'){headerLabel='\ud83d\udcd6 '+(S.lang==='ar'?'\u0627\u0644\u0634\u0631\u064a\u062d\u0629 ':'Slide ')+(p+1)}
  else if(pType.indexOf('activity')===0){var act=getAct(p);headerLabel=act?(S.lang==='ar'?act.title_ar:act.title_en):'Activity';headerColor='badge-amber'}
  else if(pType==='module-quiz'){headerLabel=l('quiz');headerColor='badge-emerald'}
  
  var prevBtn='<button class="btn btn-outline" '+(p===0?'disabled':'')+' onclick="goTo('+(p-1)+')">'+(isRTL()?'\u2192':'\u2190')+' '+l('prev')+'</button>';
  var nextBtn=p<TOTAL_PAGES-1?'<button class="btn btn-primary" onclick="goTo('+(p+1)+')">'+l('next')+' '+(isRTL()?'\u2190':'\u2192')+'</button>':'<button class="btn btn-success" disabled>\u2713 '+l('score')+'</button>';
  var dots='';
  for(var i=0;i<TOTAL_PAGES;i++){
    var cls='nav-dot';
    if(i===p)cls+=' active';else if(S.visited[i])cls+=' visited';
    if(PAGE_TYPES[i].indexOf('activity')===0)cls+=' section-activity';
    else if(PAGE_TYPES[i]==='module-quiz')cls+=' section-quiz';
    dots+='<button class="'+cls+'" onclick="goTo('+i+')" title="'+(i+1)+'/'+TOTAL_PAGES+'"></button>';
  }
  var bodyHTML='';
  if(pType==='slide')bodyHTML=slideContent(p);
  else if(pType==='activity-match')bodyHTML=renderMatch(p);
  else if(pType==='activity-flashcard')bodyHTML=renderFlash(p);
  else if(pType==='activity-dragdrop')bodyHTML=renderDrag(p);
  else if(pType==='module-quiz')bodyHTML=renderQuiz();
  
  document.getElementById('app').innerHTML=
    '<div class="toolbar"><h1>'+l('mod')+' '+MOD_NUM+': '+title+'</h1><button class="lang-btn" onclick="toggleLang()">'+(S.lang==='en'?'\u0627\u0644\u0639\u0631\u0628\u064a\u0629':'English')+'</button></div>'+
    '<div class="progress-bar"><div class="progress-fill" style="width:'+Math.round(((p+1)/TOTAL_PAGES)*100)+'%"></div></div>'+
    '<div class="nav-dots">'+dots+'</div>'+
    '<div class="card"><div class="card-header"><span class="badge '+headerColor+'">'+headerLabel+'</span><span style="font-size:11px;color:#94a3b8;font-weight:600">'+(p+1)+' '+l('of')+' '+TOTAL_PAGES+'</span></div>'+
    '<div class="card-body animate-in" id="pageBody">'+bodyHTML+'</div>'+
    '<div class="card-footer">'+prevBtn+'<span style="font-size:11px;color:#94a3b8">'+(p+1)+'/'+TOTAL_PAGES+'</span>'+nextBtn+'</div></div>';
}

/* MATCH */
function renderMatch(pageIdx){
  var act=getAct(pageIdx);if(!act)return'';
  var pairs=S.lang==='ar'?act.pairs_ar:act.pairs_en;
  var title=S.lang==='ar'?act.title_ar:act.title_en;
  var desc=S.lang==='ar'?act.desc_ar:act.desc_en;
  var matched=S.matchPairs,done=S.matchDone;
  function isLM(i){for(var j=0;j<matched.length;j++)if(matched[j].left===i)return true;return false}
  function isRM(i){for(var j=0;j<matched.length;j++)if(matched[j].right===i)return true;return false}
  var rightShuffled=pairs.map(function(p,i){return{text:p[1],idx:i}}).sort(function(a,b){return(a.idx+3)%6-(b.idx+3)%6});
  var h='<div style="max-width:700px;margin:0 auto"><h2 class="slide-title">'+title+'</h2><p class="slide-subtitle">'+desc+'</p>';
  if(done)h+='<div class="info-box emerald" style="text-align:center;font-weight:700">\u2705 '+l('md')+'</div>';
  h+='<div class="grid-2"><div class="match-pool">';
  for(var i=0;i<pairs.length;i++){
    var m=isLM(i),sel=S.matchSel.left===i;
    h+='<button class="match-item left '+(m?'correct':'')+' '+(sel?'selected':'')+'" '+(m?'disabled':'')+' onclick="matchSel(\'left\','+i+')">'+pairs[i][0]+'</button>';
  }
  h+='</div><div class="match-pool">';
  for(var i=0;i<rightShuffled.length;i++){
    var item=rightShuffled[i],m=isRM(item.idx),sel=S.matchSel.right===item.idx;
    h+='<button class="match-item right '+(m?'correct':'')+' '+(sel?'selected':'')+'" '+(m?'disabled':'')+' onclick="matchSel(\'right\','+item.idx+')">'+item.text+'</button>';
  }
  h+='</div></div>';
  if(done)h+='<div style="text-align:center;margin-top:12px"><button class="btn btn-outline" onclick="resetMatch()">\ud83d\udd04 '+l('reset')+'</button></div>';
  return h+'</div>';
}

/* FLASHCARD */
function renderFlash(pageIdx){
  var act=getAct(pageIdx);if(!act)return'';
  var cards=S.lang==='ar'?act.cards_ar:act.cards_en;
  var title=S.lang==='ar'?act.title_ar:act.title_en;
  var desc=S.lang==='ar'?act.desc_ar:act.desc_en;
  var icons=act.icons||['\ud83d\udcd6','\ud83d\udcd6','\ud83d\udcd6','\ud83d\udcd6','\ud83d\udcd6'];
  var idx=S.flashIdx,fl=S.flashFlipped,card=cards[idx];
  return '<div style="max-width:500px;margin:0 auto;text-align:center"><h2 class="slide-title">'+title+'</h2><p class="slide-subtitle">'+desc+'</p>'+
    '<div class="flashcard-container"><div class="flashcard '+(fl?'flipped':'')+'" onclick="toggleFlash()">'+
    '<div class="flashcard-face flashcard-front"><div style="font-size:28px;margin-bottom:8px">'+(icons[idx]||'\ud83d\udcd6')+'</div>'+card[0]+'<div style="font-size:11px;margin-top:8px;opacity:.7">'+l('flip')+'</div></div>'+
    '<div class="flashcard-face flashcard-back">'+card[1]+'</div></div></div>'+
    '<div class="flashcard-nav"><button class="btn btn-outline" onclick="flashPrev()" '+(idx===0?'disabled':'')+'>'+(isRTL()?'\u2192':'\u2190')+'</button>'+
    '<span class="flashcard-counter">'+(idx+1)+' / '+cards.length+'</span>'+
    '<button class="btn btn-outline" onclick="flashNext()" '+(idx===cards.length-1?'disabled':'')+'>'+(isRTL()?'\u2190':'\u2192')+'</button></div></div>';
}

/* DRAG-DROP ORDER */
function renderDrag(pageIdx){
  var act=getAct(pageIdx);if(!act)return'';
  var items=S.lang==='ar'?act.items_ar:act.items_en;
  var title=S.lang==='ar'?act.title_ar:act.title_en;
  var desc=S.lang==='ar'?act.desc_ar:act.desc_en;
  if(S.dragOrder.length!==items.length){
    S.dragOrder=items.map(function(_,i){return i});
    for(var i=S.dragOrder.length-1;i>0;i--){var j=(i*3+2)%S.dragOrder.length;var tmp=S.dragOrder[i];S.dragOrder[i]=S.dragOrder[j];S.dragOrder[j]=tmp}
  }
  var h='<div style="max-width:600px;margin:0 auto"><h2 class="slide-title">'+title+'</h2><p class="slide-subtitle">'+desc+'</p><div class="drag-pool">';
  for(var pos=0;pos<S.dragOrder.length;pos++){
    var origIdx=S.dragOrder[pos];
    var cls='drag-item';
    if(S.dragChecked)cls+=origIdx===pos?' correct':' wrong';
    h+='<div class="'+cls+'" style="display:flex;justify-content:space-between;align-items:center"><span>'+(pos+1)+'. '+items[origIdx]+'</span>';
    if(!S.dragChecked){
      h+='<span style="display:flex;gap:4px">';
      if(pos>0)h+='<button class="btn btn-outline" style="padding:4px 8px;font-size:11px" onclick="dragMove('+pos+','+(pos-1)+')">\u2191</button>';
      if(pos<items.length-1)h+='<button class="btn btn-outline" style="padding:4px 8px;font-size:11px" onclick="dragMove('+pos+','+(pos+1)+')">\u2193</button>';
      h+='</span>';
    }else{h+=origIdx===pos?'\u2705':'\u274c'}
    h+='</div>';
  }
  h+='</div>';
  if(!S.dragChecked){
    h+='<div style="text-align:center;margin-top:12px"><button class="btn btn-primary" onclick="checkDrag()">'+l('co')+'</button></div>';
  }else{
    var cc=0;for(var i=0;i<S.dragOrder.length;i++)if(S.dragOrder[i]===i)cc++;
    var allC=cc===items.length;
    h+='<div class="info-box '+(allC?'emerald':'amber')+'" style="text-align:center;margin-top:12px;font-weight:700">'+(allC?'\u2705 '+l('correct'):cc+'/'+items.length+' '+l('correct'))+'</div>';
    h+='<div style="text-align:center;margin-top:8px"><button class="btn btn-outline" onclick="resetDrag()">\ud83d\udd04 '+l('tad')+'</button></div>';
  }
  return h+'</div>';
}

/* MODULE QUIZ */
function renderQuiz(){
  var qs=S.lang==='ar'?MOD_QUIZ_AR:MOD_QUIZ_EN;
  var ans=S.quizAns,submitted=S.quizSubmitted;
  var h='<div style="max-width:700px;margin:0 auto"><div style="text-align:center;margin-bottom:16px"><div class="badge badge-emerald" style="margin-bottom:8px">\ud83d\udcdd '+l('quiz')+'</div><h2 class="slide-title">'+getTitle()+'</h2><p class="slide-subtitle">'+l('qd')+'</p><div class="badge badge-amber">'+l('pt')+'</div></div>';
  for(var qi=0;qi<qs.length;qi++){
    var q=qs[qi];
    h+='<div style="margin-bottom:16px"><p style="font-size:13px;font-weight:600;margin-bottom:8px"><span style="color:#0891b2;font-weight:700">Q'+(qi+1)+'.</span> '+q.q+'</p><div style="padding-'+(isRTL()?'right':'left')+':20px">';
    for(var oi=0;oi<q.opts.length;oi++){
      var sel=ans[qi]===oi,isC=submitted&&q.correct===oi,isW=submitted&&sel&&q.correct!==oi;
      var cls='quiz-option';
      if(isC)cls+=' correct';else if(isW)cls+=' wrong';else if(sel&&!submitted)cls+=' selected';
      h+='<button class="'+cls+'" onclick="'+(submitted?'':'selQuiz('+qi+','+oi+')')+'" '+(submitted?'disabled':'')+'><div class="quiz-radio"></div>'+(submitted&&isC?'\u2713 ':'')+(submitted&&isW?'\u2717 ':'')+q.opts[oi]+'</button>';
    }
    h+='</div></div>';
  }
  var resultHTML='';
  if(submitted){var pct=S.quizScore,pass=pct>=80;resultHTML='<div class="quiz-result '+(pass?'pass':'fail')+'">'+(pass?'\u2705':'\u274c')+' '+l('score')+': '+pct+'%<br><span style="font-size:13px;font-weight:400">'+(pass?l('pass'):l('fail'))+'</span></div>'}
  var ac=0;for(var k in ans)ac++;
  h+='<div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">';
  if(submitted){h+='<span style="font-size:12px;color:#64748b">'+(S.quizScore>=80?'\u2713 ':'')+l('score')+': '+S.quizScore+'%</span><button class="btn btn-outline" onclick="resetQuiz()">\ud83d\udd04 '+l('tryAgain')+'</button>'}
  else{h+='<span style="font-size:11px;color:#94a3b8">'+ac+' '+l('of')+' '+qs.length+' '+l('ans')+'</span><button class="btn btn-primary" onclick="submitQuiz()" '+(ac===qs.length?'':'disabled')+'>'+l('check')+'</button>'}
  return h+'</div>'+resultHTML+'</div>';
}

/* HANDLERS */
function goTo(p){if(p<0||p>=TOTAL_PAGES)return;S.page=p;SCORM.setLocation(String(p));saveProg();render()}
function toggleLang(){S.lang=S.lang==='en'?'ar':'en';S.matchSel={left:null,right:null};S.matchPairs=[];S.matchDone=false;S.flashIdx=0;S.flashFlipped=false;S.dragOrder=[];S.dragChecked=false;render()}
function matchSel(side,idx){
  if(S.matchDone)return;S.matchSel[side]=idx;
  if(S.matchSel.left!==null&&S.matchSel.right!==null){
    var act=getAct(S.page),pairs=S.lang==='ar'?act.pairs_ar:act.pairs_en;
    var li=S.matchSel.left,ri=S.matchSel.right;
    if(pairs[li][1]===pairs[ri][1])S.matchPairs.push({left:li,right:ri});
    var uL={};for(var i=0;i<S.matchPairs.length;i++)uL[S.matchPairs[i].left]=true;
    if(Object.keys(uL).length===pairs.length)S.matchDone=true;
    S.matchSel={left:null,right:null};setTimeout(render,100);
  }else render();
}
function resetMatch(){S.matchSel={left:null,right:null};S.matchPairs=[];S.matchDone=false;render()}
function toggleFlash(){S.flashFlipped=!S.flashFlipped;render()}
function flashPrev(){if(S.flashIdx>0){S.flashIdx--;S.flashFlipped=false;render()}}
function flashNext(){var act=getAct(S.page),cards=S.lang==='ar'?act.cards_ar:act.cards_en;if(S.flashIdx<cards.length-1){S.flashIdx++;S.flashFlipped=false;render()}}
function dragMove(from,to){var tmp=S.dragOrder[from];S.dragOrder[from]=S.dragOrder[to];S.dragOrder[to]=tmp;render()}
function checkDrag(){S.dragChecked=true;render()}
function resetDrag(){S.dragOrder=[];S.dragChecked=false;render()}
function selQuiz(qi,oi){if(S.quizSubmitted)return;S.quizAns[qi]=oi;render()}
function submitQuiz(){
  var qs=S.lang==='ar'?MOD_QUIZ_AR:MOD_QUIZ_EN;var c=0;
  for(var i=0;i<qs.length;i++)if(S.quizAns[i]===qs[i].correct)c++;
  var pct=Math.round((c/qs.length)*100);
  S.quizScore=pct;S.quizSubmitted=true;
  SCORM.setScore(pct,100,0);SCORM.setStatus(pct>=80?'passed':'failed');
  saveProg();render();
}
function resetQuiz(){S.quizAns={};S.quizSubmitted=false;S.quizScore=0;render()}

function saveProg(){
  SCORM.setSuspendData({lang:S.lang,page:S.page,visited:S.visited,quizAns:S.quizAns,quizSubmitted:S.quizSubmitted,quizScore:S.quizScore});
}
function loadProg(){
  var d=SCORM.getSuspendData();
  if(d&&typeof d==='object'){
    if(d.lang)S.lang=d.lang;if(d.page!==undefined)S.page=d.page;
    if(d.visited)S.visited=d.visited;
    if(d.quizAns)S.quizAns=d.quizAns;
    if(d.quizSubmitted)S.quizSubmitted=d.quizSubmitted;
    if(d.quizScore)S.quizScore=d.quizScore;
  }else{var loc=SCORM.getLocation();if(loc)S.page=parseInt(loc)||0}
}

window.addEventListener('load',function(){
  SCORM.init();loadProg();
  if(!S.quizSubmitted)SCORM.setStatus('incomplete');
  render();
});
window.addEventListener('beforeunload',function(){saveProg();SCORM.finish()});
window.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();goTo(S.page+1)}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();goTo(S.page-1)}
});
