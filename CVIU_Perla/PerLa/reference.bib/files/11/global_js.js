$(function() { 
    // setup ul.tabs to work as tabs for each div directly under div.panes 
    $("ul.mini-tab-list").tabs("div.panes > div"); 
});

$(document).ready( function() { 
     $('a[rel$="pdf"]').click( function() { 
         _gaq.push(['_trackPageview', $(this).attr('href')] );
     } );



/* 20110714 cac track registration events
*/
$('a[href^="https://pubs.aaas.org/register"]').add('a[href^="http://promo.aaas.org/regsci"]').click(function() { 
    _gaq.push(['_trackEvent','Register for access', 'Content', document.location.pathname]); 
} );


});


/*
* Dynamically load additional style sheets to the current page
*
* @param resource
*     url of css file to load
*/
function loadCss(resource){
	var headID = document.getElementsByTagName('head')[0];         
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = resource;
	cssNode.media = 'screen';
	headID.appendChild(cssNode);
}

ua = navigator.userAgent.toLowerCase();
window.is_iphone = (/iphone|iPod/i).test(ua);
window.is_ipad = (/ipad/i).test(ua);
window.is_android = (/android/i).test(ua);
window.is_webkit = (/webkit/i).test(ua);
window.is_android_webkit = (is_android && is_webkit);

// Message to display on Android / Webkit
msg_android = 'Sorry, this feature is not supported in this browser. Please install <a href="http://www.mozilla.com/en-US/mobile/">Firefox</a> or <a href="m.opera.com">Opera</a> and try again.';

//Message to display in link-out page, asking whether to install CHROME Frame, or suggesting using a new browser.
msg_ie = '<div class="upbrowser">';
msg_ie += '<p>This content is optimized to operate in Internet Explorer 9+ (Windows 7 or Vista), Chrome, Firefox, Safari or Opera. To view it in your current browser, you need to install the FREE <em>ChromeFrame</em> plugin, from Google.</p>';
msg_ie += '<div class="col1of2">';
msg_ie += '<div><a href="http://google.com/chromeframe" class="cf"><span>Install ChromeFrame Plugin</span></a></div>';
msg_ie += '</div>';
msg_ie += '<div class="col1of2">';
msg_ie += '<div>Download:</div>';
msg_ie += '<ul>';
msg_ie += '<li><a class="get chrome" href="http://www.google.com/chrome/intl/en/make/download.html" class="getChrome"><span>Chrome</span></a></li>';
msg_ie += '<li><a class="get ff" href="http://www.mozilla.com/en-US/firefox/new/" class="getFF"><span>Firefox</span></a></li>';
msg_ie += '<li><a class="get opera" href="http://www.opera.com/download/" class="getOpera"><span>Opera</span></a></li>';
msg_ie += '<li><a class="get safari" href="http://www.apple.com/safari/download/" class="getSafari"><span>Safari</span></a></li>';
msg_ie += '<li><a class="get ie" href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie" class="getIE"><span>Internet Explorer</span></a></li>';
msg_ie += '</ul>';
msg_ie += '</div>';
msg_ie += '</div>';

//Message to Display in article pages telling viewers they will link out to a new page to see the content.
msg_ie_article = '<div class="fig pos-float odd"><div class="fig-caption" style="overflow: hidden;">';
msg_ie_article += '<img src="/site/icons_shared/new-win.png" class="Left" alt=""/>';
msg_ie_article += '<p>This content will open in a new browser window.<br />';
msg_ie_article += '(You may also be required to install a plug-in)</p>';
msg_ie_article += '<a href="[FILELINK]">Proceed to Content</a></div></div>';

$(function() {

    /* test version

    if ( $('meta[name="DC.Identifier"]').attr("content") === "10.1126/science.1192698xxx") {
        $.getScript('/site/apps/resources/1206964.pckg.js');
    }
    */

    if ( $(".sci-custom").length > 0 ) {
        var id = $('meta[name=citation_doi]').attr("content").substring(16);
        $.getScript('/site/apps/resources/' + id + '.pckg.js');
    }
});



function createCustomRegion(target, content, tabname) {

	var label1, label2;

	label1 = (tabname.label1 != "")? tabname.label1 : "Figure";
	label2 = (tabname.label2 != "")? tabname.label2 : "Interactive";

	$("#"+target).before('<ul id="preview-tabs" class="mini-tab-list"><li><a href="#"  class="sci-toggle current" rel="' + target + '">' + label1 + '</a></li><li class="hilight"><a href="#" class="sci-toggle" rel="' + target + '-i">' + label2 + '</a></li></ul>');
	$("#"+target).after('<div id="'+target+'-i">' + content + '</div>');
	$("#"+target+'-i').hide();
}

function initCustomRegions() {
	$('.sci-toggle').unbind('click').bind('click', function() {
		target = "#" + $(this).attr('rel');
        hidetarget = "#" + $('.current').attr('rel');
		if ($(target).is(':hidden')){            
			$(hidetarget).hide();
			$(target).show();
            $('.current').removeClass();
            $(this).addClass('current');
            return false;
		}

	});	
}
