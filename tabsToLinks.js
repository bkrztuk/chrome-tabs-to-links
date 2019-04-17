'use strict';
(function() {
    var Config = {
        DEFAULT_FAVICON: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAMklEQVR4AWMgEkT9R4INWBUgKX0Q1YBXQYQCkhKEMDILogSnAhhEV4AGRqoCTEhkPAMAbO9DU+cdCDkAAAAASUVORK5CYII=',
        MAIN_TEMPLATE: '<div id="tabs2links" style="display: none;"><div class="tabs__actions">' + '<label>Output format</label><select id="formatSelect" class="md-select">' + '<option value="text" selected>Text</option>' + '<option value="markdown">Markdown</option>' + '<option value="html">HTML</option>' + '</select>' + '<button id="exportLinks">Copy to Clipboard</button><button id="closeLinks" onclick="document.getElementById(\'tabs2links\').style.display = \'none\'; return;">Close</button>' + '</div>' + '<ul class="tabs__list">' + '</ul>' + '</div>',
        TAB_TEMPLATE: '<li class="tab-item">' + '<span class="tabs__favicon">' + '<img src="{favicon}" onerror="this.src=\'{default_favicon}\';">' + '</span>' + '<span class="tabs__title">{title}<strong class="url">{url}</strong></span>' + '</li>',
        // References to DOM elements
        FAVICON_IMG: '.favicon-img img',
        TAB_SWITCHER: '.tabs__list',
        TAB_LIST: '.tabs__list .tabs-list',
        TAB_INPUT: '.tabs__list button',
        // Shortcut for activation
        MASTER_KEY: '⌘+⇧+e, ⌃+⇧+e',
        ESCAPE_KEY: 27
    };
    var BrowserTab = {
        allTabs: [],
        getAll: function(callback) {
            chrome.extension.sendMessage({
                type: 'getTabs'
            }, function(tabs) {
                if (!tabs) {
                    return false;
                }
                BrowserTab.allTabs = tabs;
                callback(tabs);
            });
        }
    };

    function TabsToLinks() {
        function populateTabs(tabs) {
            let tabsHtml = getTabsHtml(tabs);
            document.getElementsByClassName('tabs__list')[0].innerHTML = tabsHtml;
        }

        function getTabsHtml(tabs) {
            let tabsHtml = '';
            tabs.forEach(function(tab) {
                var tempTabTemplate = Config.TAB_TEMPLATE,
                    faviconUrl = tab.favIconUrl || Config.DEFAULT_FAVICON;
                tempTabTemplate = tempTabTemplate.replace('{favicon}', faviconUrl);
                tempTabTemplate = tempTabTemplate.replace('{default_favicon}', Config.DEFAULT_FAVICON);
                tempTabTemplate = tempTabTemplate.replace('{title}', tab.title);
                tempTabTemplate = tempTabTemplate.replace('{url}', tab.url);
                tabsHtml += tempTabTemplate;
            });
            return tabsHtml;
        }

        function exportTabs(format) {
            let urls = [];
            if (format === 'html') {
                urls.push('<ul>');
            }
            BrowserTab.allTabs.map(function(tab) {
                switch (format) {
                    case 'text':
                        urls.push(tab.title + ' → ' + tab.url);
                        break;
                    case 'html':
                        urls.push('\t<li><a href="' + tab.url + '">' + tab.title + '</a></li>');
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
            document.getElementById('exportLinks').textContent = 'Copied!';
            setTimeout(function() {
                document.getElementById('exportLinks').textContent = 'Copy to Clipboard';
            }, 3000);
            document.getElementById('tabs2links').focus();
        }

        function copyTextToClipboard(text) {
            var copyFrom = document.createElement("textarea");
            copyFrom.textContent = text;
            document.body.appendChild(copyFrom);
            copyFrom.select();
            document.execCommand('copy');
            copyFrom.blur();
            document.body.removeChild(copyFrom);
        }

        function appendTabSwitcherHtml($container) {
            $container = document.getElementsByTagName('body')[0];
            document.getElementsByTagName('body')[0].append(Config.MAIN_TEMPLATE);
            return $container;
        }

        function showTabSwitcher() {
            var $tabSwitcher = document.getElementById('tabs2links');
            if ($tabSwitcher.length === 0) {
                appendTabSwitcherHtml('body');
                $tabSwitcher = document.getElementById('tabs2links');
            }
            $tabSwitcher.style.display = 'block';
        }
        return {
            loadExtension: function() {
                let container = document.createElement('div');
                container.innerHTML = Config.MAIN_TEMPLATE;
                document.body.append(container);
                this.initWindow();
            },
            initWindow: function() {
                document.addEventListener("keydown", function(event) {
                    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.which === 69) {
                        showTabSwitcher();
                        BrowserTab.getAll(populateTabs);
                    }
                    if (event.which === 27) {
                        document.getElementById('tabs2links').style.display = 'none';
                    }
                });
                document.getElementById('exportLinks').onclick = function() {
                    exportTabs(document.getElementById('formatSelect').value);
                };
            }
        };
    }
    var tabsToLinks = new TabsToLinks();
    tabsToLinks.loadExtension();
}());