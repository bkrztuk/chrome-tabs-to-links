document.addEventListener('DOMContentLoaded', function() {
	
	const Setup = {
		FAVICON		: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAMklEQVR4AWMgEkT9R4INWBUgKX0Q1YBXQYQCkhKEMDILogSnAhhEV4AGRqoCTEhkPAMAbO9DU+cdCDkAAAAASUVORK5CYII=',
		TAB_TMPL	: '<li class="tab"><div class="tab__favicon"><img src="{{ favicon }}" onerror="this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAMklEQVR4AWMgEkT9R4INWBUgKX0Q1YBXQYQCkhKEMDILogSnAhhEV4AGRqoCTEhkPAMAbO9DU+cdCDkAAAAASUVORK5CYII=\';"/></div><div class="tab__title"><p>{{ title }}</p><p class="tab__subtitle">{{ url }}</p></div></li>',
		MASTER_KEY	: '⌘+⇧+k, ⌃+⇧+k'
	};

	chrome.tabs.query({
        currentWindow: true,
        pinned: false
    }, function(tabs) {
    	var tabsHtml = '';
    	
    	tabs.map(function(tab){
    		let tabTmpl = Setup.TAB_TMPL;
    		let faviconUrl = tab.favIconUrl || Config.DEFAULT_FAVICON;
    		tabTmpl = tabTmpl.replace('{{ favicon }}', faviconUrl);
    		tabTmpl = tabTmpl.replace('{{ title }}', tab.title);
    		tabTmpl = tabTmpl.replace('{{ url }}', tab.url);
    		tabsHtml += tabTmpl;
    	});
    	document.getElementById('tabslist').innerHTML = tabsHtml;
    });
  
}, false);


