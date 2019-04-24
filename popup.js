document.addEventListener('DOMContentLoaded', function() {
    function copyTextToClipboard(text) {
        var copyFrom = document.createElement("textarea");
        copyFrom.textContent = text;
        document.body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        copyFrom.blur();
        document.body.removeChild(copyFrom);
    }

    function exportTabs(format) {
        let urls = [];
        if (format === 'html') {
            urls.push('<ul>');
        }
        chrome.tabs.query({
            currentWindow: true,
            pinned: false
        }, function(tabs) {
            tabs.map(function(tab) {
                switch (format) {
                    case 'text':
                        urls.push(tab.title + ' → ' + tab.url);
                        break;
                    case 'html':
                        urls.push('\t<li><a href="' + tab.url + '">' + sanitizeHtml(tab.title) + '</a></li>');
                        break;
                    case 'markdown':
                        urls.push('[' + tab.title + '](' + tab.url + ')');
                        break;
                    default:
                        return;
                }
            });
            if (format === 'html') {
                urls.push('</ul>');
            }
            copyTextToClipboard(urls.join('\n\r'));
        });
        document.getElementById('exportLinks').textContent = 'Copied!';
        setTimeout(function() {
            document.getElementById('exportLinks').textContent = 'Copy to Clipboard';
        }, 3000);
    }
    const Setup = {
        FAVICON: 'assets/icons/tab.png',
        TAB_TMPL: '<li class="tab"><div class="tab__favicon"><img src="{{ favicon }}" onerror="this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAMklEQVR4AWMgEkT9R4INWBUgKX0Q1YBXQYQCkhKEMDILogSnAhhEV4AGRqoCTEhkPAMAbO9DU+cdCDkAAAAASUVORK5CYII=\';"/></div><div class="tab__title"><p>{{ title }}</p><p class="tab__subtitle">{{ url }}</p></div></li>',
        MASTER_KEY: '⌘+⇧+k, ⌃+⇧+k'
    };
    chrome.tabs.query({
        currentWindow: true,
        pinned: false
    }, function(tabs) {
        var tabsHtml = '';
        tabs.map(function(tab) {
            let tabTmpl = Setup.TAB_TMPL;
            let faviconUrl = tab.favIconUrl || Setup.FAVICON;
            tabTmpl = tabTmpl.replace('{{ favicon }}', faviconUrl);
            tabTmpl = tabTmpl.replace('{{ title }}', tab.title);
            tabTmpl = tabTmpl.replace('{{ url }}', tab.url);
            tabsHtml += tabTmpl;
        });
        document.getElementById('tabslist').innerHTML = tabsHtml;
    });
    document.getElementById('exportLinks').onclick = function(e) {
        exportTabs(document.getElementById('formatSelect').value);
    }
}, false);