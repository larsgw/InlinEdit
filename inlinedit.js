function parseRichText(a) {
  var a=a
  //Inline
  .replace(/\*\*([^]*?)\*\*(?!\*)/g            , '<span>**</span><b>$1</b><span>**</span>')
  .replace(/__([^]*?)__(?!_)/g                 , '<span>__</span><u>$1</u><span>__</span>')
  .replace(/--([^]*?)--/g                      , '<span>--</span><s>$1</s><span>--</span>')
  .replace(/`([^]*?)`/g                        , '<span>`</span><code>$1</code><span>`</span>')
  .replace(/([^*]|^)\*([^* ]((\*\*|[^*])*[^*])?)\*(?=[^*]|$)/g,'$1<span>*</span><i>$2</i><span>*</span>')
  .replace(/([^_]|^)_([^_]((__|[^_])*[^_])?)_(?=[^_]|$)/g     ,'$1<span>_</span><sub>$2</sub><span>_</span>')
  .replace(/\^(.*?)\^/g                        , '<span>^</span><sup>$1</sup><span>^</span>')
  .replace(/\[\(c\)(?!<\/)([^]+?)\]\(c:(.+?)\)(?!<\/)/g, '<span>[(c)</span><abbr style="           color:$2">$1</abbr><span>](c:$2)</span>')
  .replace(/\[\(b\)(?!<\/)([^]+?)\]\(b:(.+?)\)(?!<\/)/g, '<span>[(b)</span><mark style="background-color:$2">$1</mark><span>](b:$2)</span>')
  .replace(/\[\(s\)(?!<\/)([^]+?)\]\(s:(.+?)\)(?!<\/)/g, '<span>[(s)</span><bdo  style="     font-size  :$2">$1</bdo ><span>](s:$2)</span>')
  .replace(/\[\(f\)(?!<\/)([^]+?)\]\(f:(.+?)\)(?!<\/)/g, '<span>[(f)</span><span style="     font-family:$2">$1</span><span>](f:$2)</span>')
  .replace(/\[(?!<\/)([^]+?)\]\((?![cbsf]:)(.+?)\)(?!<\/)/g, '<span>[</span><a href="$2">$1</a><span>]($2)</span>')
  // Lists
  .replace(/((?:\n|^)(?!(?:  )*\*).*\n)(?=\* .*(?:\n|$))/g      ,'$1<ul>' )  
  .replace(/((?:\n|^)(?!(?:  )*\d\.).*\n)(?=\d\. .*(?:\n|$))/g  ,'$1<ol>' )
  .replace(/((?:\n|^)(?:  )*\* .*?(?:\n|$))(?!(?:  )*\* )/g     ,'$1</ul>')
  .replace(/((?:\n|^)(?:  )*\d\. .*?(?:\n|$))(?!(?:  )*\d\. )/g ,'$1</ol>')
  .replace(/(\n|<[uo]l>|^)((?:  )*(?:\*|\d\.) )(.*?)(?=\n<\/[uo]l>|\n(?:  )*(?:\*|\d\.) |$)/g,'$1<li><span>$2</span>$3</li>')
  // Tables
  .replace(/(\n\n|^)(?!.*\n\n)[^|]*(\|[^|]*)+(\n---+[^|]*(\|[^|]*?)+)+(?=\n\n|$)/g,function(m,a){
    return a +
	   '<table><tr><td>' +
	   m.replace(/^\n\n/g   ,''                                      )
	    .replace(/\|/g      ,'<span>|</span></td><td>'               )
	    .replace(/\n---+\n/g,'<span>\n---\n</span></td></tr><tr><td>') +
	   '</td></tr></table>'
  })
  // Code blocks
  .replace(/(^|(^|\n)(?!    ).*?\n)(?=    )/g,'$1<pre><code>')
  .replace(/((\n|^)    (?:.*?\n|$))(?!    )/g,'$1</code></pre>')
  .replace(/<pre><code>[\s\S]*?<\/code><\/pre>/g,function(m){
    return m.replace(/(\n|<pre><code>)    /g,'$1<span>    </span>')
  })
  // Headers
  .replace(/(\n|^)# (.*?)(?=\n|$)/g ,'$1<h2><span># </span>$2</h2>')
  .replace(/(\n|^)## (.*?)(?=\n|$)/g,'$1<h3><span>## </span>$2</h3>')
  // Cleaning empty tags
  .replace(new RegExp('('+
    '<span>\\*\\*<\\/span><b><\\/b><span>\\*\\*<\\/span>|'+
    '<span>__<\\/span><u><\\/u><span>__<\\/span>|'+
    '<span>*<\\/span><i><\\/i><span>*<\\/span>|'+
    '<span>--<\\/span><s><\\/s><span>--<\\/span>|'+
    '<span>_<\\/span><sub><\\/sub><span>_<\\/span>|'+
    '<span>\\^<\\/span><sup><\\/sup><span>\\^<\\/span>|'+
    '<span>`<\\/span><code><\\/code><span>`<\\/span>|'+
    '<span>\\[(\\([cbsf]\\))?<\\/span>('+
      '<a     href=".*?"><\\/a   >|'+
      '<mark style=".*?"><\\/mark>|'+
      '<bdo  style=".*?"><\\/bdo >|'+
      '<abbr style=".*?"><\\/abbr>|'+
      '<span style=".*?"><\\/span>'+
    ')<span>\\]\\(.*?\\)<\\/span>|'+
  ')','g'), '');
  return a;
}

function hasClass(a,b) { return (" "+a.className+" ").replace(/[\n\t\r]/g," ").indexOf(" "+b+" ")>-1; }
function getSelectionIndex(context,sel,opt) {
  var sel = sel||getSelection(),
      opt = opt||{},
      iosa= sel.anchorOffset,
      iosb= sel.focusOffset;
      
  if (!hasClass(sel.anchorNode,context)&&(!hasClass(sel.anchorNode.parentElement,context)||sel.anchorNode.previousSibling!=null)) {
    var clea=!hasClass(sel.anchorNode.parentElement,context)?sel.anchorNode.parentElement:sel.anchorNode;
    for (var i=0;true;i++){
      if(i==(opt.timeout||1000)){console.warn('Something seems to have gone wrong...');break;}
      if(clea.previousSibling!=null){
	clea= clea.previousSibling;
	iosa+=(clea.innerText||clea.data||'').length;
      }else if(!hasClass(clea.parentElement,context)){
	clea= clea.parentElement.previousSibling;
	iosa+=(clea.innerText||clea.data||'').length;
      }else break;
    }
  }
  
  if (!hasClass(sel.focusNode,context)&&(!hasClass(sel.focusNode.parentElement,context)||sel.focusNode.previousSibling!=null)) {
    var cleb=!hasClass(sel.focusNode.parentElement,context)?sel.focusNode.parentElement:sel.focusNode;
    for (var i=0;true;i++){
      if(i==1000){console.warn('Something seems to have gone wrong...');break;}
      if(cleb.previousSibling!=null){
	cleb= cleb.previousSibling;
	iosb+=(cleb.innerText||cleb.data||'').length;
      }else if(!hasClass(cleb.parentElement,context)){
	cleb= cleb.parentElement.previousSibling;
	iosb+=(cleb.innerText||cleb.data||'').length;
      }else break;
    }
  }
  
  return iosa>=iosb?iosb:iosa;
}

RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

String.prototype.insert = function(a,b) { return this.slice(0,a)+b+this.slice(a); };
String.prototype.remove = function(a,b) { return this.slice(0,a)+this.slice(a+b); };
String.prototype.oddOccurence = function(a) {
  var rgx = new RegExp('(^|[^'+RegExp.escape(a.charAt(0))+'])'+RegExp.escape(a)+'($|[^'+RegExp.escape(a.charAt(a.length-1)||a.charAt(0))+'])','g'),
      mhl = (this.match(rgx)||[]).length;
  return mhl==0?0:Boolean(mhl%2);
};

jQuery.fn.getPreText   = function(){return this.contents().filter(function(){return this.nodeType==3;}).text()};
jQuery.fn.updateColour = function(){$(this).parent().css('color',$(this).val())};      
jQuery.fn.markdown     = function () {
  var s = '';
  $.each($.parseHTML(this.text()),function(i,v){if(v.nodeType==3)s+=v.textContent});
  this.html(parseRichText(s));
};

jQuery.fn.edit = function (f,o) {
  $(this).addClass('T-e').each(function(){
    var elm = $(this),
	txt = elm.wrapInner('<div class="T-et '+((o||{}).m===false?'S-hm':'')+'" contenteditable="true"></div>').children('.T-et')/*.blur(f)*/;
    
    elm.append(
      '<div class="T-es">'+
	'<div>'+
	  '<svg version="1.1" viewBox="0 0 16 16" width="24" height="24"><path d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg>'+
	  '<input class="B-es-a Ta-s" min="0" step="1" max="1" value="1" type="range"/>'+
	'</div>'+
	'<button class="B-es-b C-i">format_bold</button>'+
	'<button class="B-es-i C-i">format_italic</button>'+
	'<button class="B-es-u C-i">format_underlined</button>'+
	'<button class="B-es-s C-i">strikethrough_s</button>'+
	'<button class="B-es-c C-i">code</button>'+
	'<button class="B-es-t">x<sup>2</sup></button>'+
	'<button class="B-es-d">x<sub>2</sub></button>'+
	'<button class="B-es-e C-i">format_clear</button>'+
	'<button class="B-es-dc C-i">format_color_text<input type="color"/></button>'+
	'<button class="B-es-db C-i">format_color_fill<input type="color"/></button>'+
	'<button class="B-es-ds C-i">format_size<select>'+(function(){
	  var res='',arr=[6,7,8,9,10,11,12,14,16,18,21,24,28,32,36,40,44,48,54,60,66,72];
	  for(var i=0;i<arr.length;i++)
	    res+='<option value="'+arr[i]+'px"'+
		    (arr[i]==parseInt(getComputedStyle(document.getElementsByTagName('body')[0])['font-size'])?' selected':'')
		  +'>'+arr[i]+'</option>';
	  return res;
	})()+'</select></button>'+
	'<button class="B-es-df C-i">font_download<select>'+(function(){
	  var str='',arr=[],obj={
	    s:{
	      Georgia:'Georgia, serif',
	      "Palatino Linotype":'"Palatino Linotype", "Book Antiqua", Palatino, serif',
	      "Times New Roman":'"Times New Roman", Times, serif'
	    },
	    ss:{
	      Arial:'Arial, Helvetica, sans-serif',
	      "Arial Black":'"Arial Black", Gadget, sans-serif',
	      "Comic Sans MS":'"Comic Sans MS", cursive, sans-serif',
	      Impact:'Impact, Charcoal, sans-serif',
	      "Lucida Sans Unicode":'"Lucida Sans Unicode", "Lucida Grande", sans-serif',
	      Tahoma:'Tahoma, Geneva, sans-serif',
	      "Trebuchet MS":'"Trebuchet MS", Helvetica, sans-serif',
	      Verdana:'Verdana, Geneva, sans-serif'
	    },
	    ms:{
	      "Courier New":'"Courier New", Courier, monospace',
	      "Lucida Console":'"Lucida Console", Monaco, monospace'
	    }		  
	  };
	  for(var g in obj){
	    str+='<optgroup label="'+(g=='s'?'Serif':(g=='ss'?'Sans serif':'Monospace'))+'">'
	    for(var i in obj[g])
	      arr.push('<option value="'+obj[g][i].replace(/"/g,"'")+'"'+
			(i===getComputedStyle(document.getElementsByTagName('body')[0])['font-family']?' selected':'')
		      +'>'+i+'</option>');
	    str+=arr.join('')+'</optgroup>',arr=[];
	  }
	  return str;
	})()+'</select></button>'+
	'<button class="B-es-ul C-i B-es-ns">format_list_bulleted</button>'+
	'<button class="B-es-ol C-i B-es-ns">format_list_numbered</button>'+
	'<button class="B-es-h2 C-i B-es-ns">title</button>'+
      '</div>'
    );
    
    var ehf = function(e){
      e.preventDefault();
      var cls = ($(this).is('button')?$(this):$(this).parents('button')).attr('class').split(' ')[0],
	  sel = getSelection();
      if(!sel.isCollapsed){
	var bst = txt[0].innerText,
	    sst = sel.toString(),
	    isa, isb, caf, cbf, crx, res;
	
	var ios = getSelectionIndex('T-et',sel),
	    ioe = ios + sst.length;
	
	switch (cls) {
	  case 'B-es-b':isa='**',isb=isa;break;
	  case 'B-es-u':isa='__',isb=isa;break;
	  case 'B-es-s':isa='--',isb=isa;break;
	  case 'B-es-c':isa='`' ,isb=isa;break;
	  case 'B-es-t':isa='^' ,isb=isa;break;
	  case 'B-es-d':
	    isa='_' ,isb=isa,
	    caf='__',cbf='__';
	    break;
	  case 'B-es-i':
	    isa='*' ,isb=isa,
	    caf='**',cbf='**';
	    break;
	  case 'B-es-e':
	    isa='',isb=isa,
	    bst=bst.slice(0,ios  ).replace(/(__|--|\*\*|\[\([cbsf]\)|[*^_`[])+$/,'')+
		bst.slice(ios,ioe).replace(/\[\([cbsf]\)|[*_^[`]|--|]\(.*?\)/g,'')+
		bst.slice(ioe    ).replace(/^(__|--|\*\*|[*^_`]|]\(.*?\))+/,'');
	    elm.find('.B-es-dc  input').val('#000000').updateColour();
	    elm.find('.B-es-db  input').val('#000000').updateColour();
	    elm.find('.B-es-ds select').val(getComputedStyle(document.getElementsByTagName('body')[0])['font-size'  ]);
	    elm.find('.B-es-df select').val(getComputedStyle(document.getElementsByTagName('body')[0])['font-family']);
	    break;
	  default:isa='';isb='';break;
	}
	
	var caba= ( bst.slice(ios-isa.length,ios) == isa && (caf?bst.slice(ios-caf.length,ios)!=caf:true) ),
	    cabb=	( bst.slice(ios,ios+isa.length) == isa && (caf?bst.slice(ios,ios+caf.length)!=caf:true) ),
	    caea= ( bst.slice(ioe,ioe+isb.length) == isb && (cbf?bst.slice(ioe,ioe+cbf.length)!=cbf:true) ),
	    caeb=	( bst.slice(ioe-isb.length,ioe) == isb && (cbf?bst.slice(ioe-cbf.length,ioe)!=cbf:true) )
	    cab = caba || cabb, cae = caea || caeb;
	
	onob= isa==isb?bst.slice(0,ios).oddOccurence(isa):false,
	onos= isa==isb?sst.oddOccurence(isa):false;
	
	crx = new RegExp('((^|[^'+RegExp.escape(isa.charAt(0))+'])'+RegExp.escape(isa)+'($|[^'+RegExp.escape(isa.charAt(isa.length-1)||isa.charAt(0))+'])|(^|[^'+RegExp.escape(isb.charAt(0))+'])'+RegExp.escape(isb)+'($|[^'+RegExp.escape(isb.charAt(isb.length-1)||isb.charAt(0))+']))','g');
	var cbs = bst.slice(0,ios)+bst.slice(ios,ioe).replace(crx,'$2$3')+bst.slice(ioe);
	
	if (caba&&caea) {
	  res=cbs.remove(ios-isa.length,isa.length).remove((ioe-(bst.length-cbs.length))-isa.length,isb.length);
	} else if (cabb&&caeb) {
	  res=bst.remove(ios,isa.length).remove(ioe-isa.length-isb.length,isb.length);
	} else {
	  if(!onob){if(onos)isb='';}
	  else if(onob){if(onos===0){var str=isa;isa=isb,isb=str;}else{isa='';if(!onos)isb='';}}
	  res=cbs.insert(ios,isa).insert((ioe-(bst.length-cbs.length))+isa.length,isb);
	}
	
	txt.html(res);
      } txt.markdown();
    },
    efi = function(){
      var cls = ($(this).is('button')?$(this):$(this).parents('button')).attr('class').split(' ')[0],
	  sel = getSelection();
      if(!sel.isCollapsed){
	var bst = txt[0].innerText,
	    sst = sel.toString(),
	    clb = cls.charAt(cls.length-1),
	    lbla= clb!='a'?    clb+':':'',
	    lblb= clb!='a'?'('+clb+')':'',
	    isa ='['+lblb, isb =']('+lbla+$(this).val()+(clb=='s'&&$(this).val().match(/\d$/)?'px':'')+')',
	    lbla= lbla||'(?![sfcb]:)',
	    lblb= lblb||'(?!\\([sfcb]\\))',
	    caf, cbf, res;
	
	/*
	  Als dit niet gaat werken, moeten we het volgende proberen te doen: [c:<text>](c:<color>)
	  Of iets dergelijks. Natuurlijk blijft link [<text>](<url>)
	*/
	
	var ios = getSelectionIndex('T-et',sel),
	    ioe = ios + sst.length,
	    cab = bst.slice(0,ios).match(new RegExp('\\['+lblb+'$')),
	    cae = bst.slice(  ioe).match(new RegExp('^\\]\\('+lbla+'.*?\\)')),
	    onob=(bst.slice(0,ios).match(new RegExp('\\['+lblb,'g'))||[]).length!=(bst.slice(0,ios).match(new RegExp('\\]\\('+lbla+'.*?\\)','g'))||[]).length,
	    onos=    Boolean(((sst.match(new RegExp('\\['+lblb,'g'))||[]).length +(sst             .match(new RegExp('\\]\\('+lbla+'.*?\\)','g'))||[]).length)%2),
	    crx = [
		    new RegExp('^(.*?)(\\]\\('+lbla+'.*?\\))'),
		    new RegExp('(.*)(\\['+lblb+')(.*?)$'),
		    new RegExp('\\['+lblb+'|\\]\\('+lbla+'.*?\\)','g')
		  ],
	    cbsp= bst.slice(ios,ioe),cbs;
	
	if(onob)
	  isa =(crx[0].exec(cbsp)||[0,0,''])[2]+isa,cbsp=cbsp.replace(crx[0],'$1');
	if(onob&&!onos||!onob&&onos)
	  isb = isb+(crx[1].exec(cbsp)||[0,0,''])[2],cbsp=cbsp.replace(crx[1],'$1$3');
	  cbsp= cbsp.replace(/\[([sfbc]:)?\]\(.*?\)/g,'').replace(crx[2],'');
	cbs = bst.slice(0,ios)+cbsp+bst.slice(ioe),
	res = cbs.slice(0,ios).replace(/\[$/,'')+
	  isa+cbs.slice(  ios,ioe-(bst.length-cbs.length))+isb+
	      cbs.slice(      ioe-(bst.length-cbs.length)).replace(new RegExp('^\\]\\('+lbla+'.*?\\)'),'');
	txt.html(res);
      } txt.markdown();
    },
    ehn = function () {
      var cls = ($(this).is('button')?$(this):$(this).parents('button')).attr('class').split(' ')[0],
	  sel = getSelection();
      if(sel.isCollapsed){
	var bst = txt[0].innerText,
	    sst = sel.toString(),
	    clb = cls.slice(-2),
	    ios = getSelectionIndex('T-et',sel),
	    ins = ios?'\n':'';
	
	switch(clb){
	  case 'ul':
	    ins += '* Text';
	    break;
	  case 'ol':
	    ins += '1. Text';
	    break;
	  case 'h2':
	    ins += '# Text';
	    break;
	  case 'h3':
	    ins += '## Text';
	    break;
	}
	
	var res = bst.insert(ios,ins);
	
	txt.html(res);
      } txt.markdown();
    }
    
    elm.find('button').filter(':not(:has(input,select),.B-es-ns)').click(ehf).click(f);
    elm.find('button').find('input,select').change(efi).change(f);
    elm.find('button').filter('.B-es-ns').click(ehn).click(f);
    elm.find('.B-es-a').change(function(){elm.find('.T-et').toggleClass('S-hm')});
    elm.find('button.B-es-dc,button.B-es-db').find('input').change(function(){$(this).updateColour()});
    elm.find('.T-et').on('input',f);
  });
};