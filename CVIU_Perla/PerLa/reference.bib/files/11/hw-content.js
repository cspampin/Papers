/* jQuery javascript functions for content page */
var gIsFrameset = false;
var gIsOMContent;
var gAuthorAffilList = "div.article div.contributors p.affiliation-list-reveal a.view-more";
var gAuthorNotes = "div.article div.contributors p.author-notes-reveal a.view-more";
var gAuthorContributorList = "div.article div.contributors ol.contributor-list a[href^='#aff']";

$(document).ready(function() {

	var pgDiv = $("div#pageid-content");
	gIsOMContent = (pgDiv.length && pgDiv.hasClass("hwp-metaport-content"));
	
	if (!(getSiteOption("noAuthAffilCollapse") == true)) {
		handleAuthAffil(gAuthorAffilList,gAuthorNotes,gAuthorContributorList);
	}
	
	fixWackyReflinksMarkup();
	
	var defaultDockedNavRules = [
		'', '<div class="content-box" id="docked-cb"><div class="cb-contents"><h3>This Article</h3><div class="cb-section cb-slug"><ol id="docked-slug"><li></li></ol></div><div class="cb-section"><ol id="docked-nav-views"></ol></div></div></div>',
		'$(#col-2 #docked-nav-views)', '$(#article-cb-main .cb-section ol:has(li a[rel^="view-"]) > li)',
		'$(#col-2 #docked-nav #docked-slug li)', '$(#col-2 #slugline)',
		'', '$(#article-dyn-nav)'
	];

	if (!(getSiteOption("suppressDockedNav") == true)) {
		setupDockBlock(2, 'docked-nav', 'dockblock', defaultDockedNavRules);
	}
	
	if (!(getSiteOption("noPDFExtractExpand") == true)) {
		linkPDFExtImg();
	}
	
	var unloadedImgLookupRule = "div.article div.fig img";
	var numImagesToLoad = checkUnloadedImgs(unloadedImgLookupRule);

	/* ref rollover */
	if (!(getSiteOption("suppressRefPopups") == true)) {
		setTimeout("addRefPops()", 25);
	}
	
	/* fig-expansion in page */
	if (!(getSiteOption("noInlineFigExpand") == true) && (!gIsOMContent || (gIsOMContent && (getSiteOption("inlineFigExpandOMContent") == true)))) {
		setTimeout("figExpandInline()", 10);
	}
	
	/* if configured, open ref links in new windows */
	if (getSiteOption("refLinksNewWindow") == true) {
		setTimeout("refLinksNewWindowTarget()", 25);
	}

	/* 'new window' fig expansions */
	setTimeout("newWindowTargets()", 25);
	
	/* AJAX related article callbacks */
	setTimeout("getISIRelated()", 50);
	
	/* AJAX citing article callbacks */
	setTimeout("getHWCiting()", 50);
	setTimeout("getCiting('isi', gSiteOptions.isiLinkString, '', " + addISICiting + ",'rt=yes')", 50);
	setTimeout("getCiting('scopus','Loading Scopus citing article data...', 'callback/'," + addScopusCiting + ")", 50);
	
	/* AJAX Entrez Links callbacks */
	setTimeout("getEntrezLinks()", 50);
	
	/* Related content */
	setTimeout("getHWRelatedURLs()", 50);
	setTimeout("getPatientInformData()", 50);
	
	/* Fix col heights for images */
	setTimeout("fixHeightForImages(1" + "," + numImagesToLoad + ", '" + unloadedImgLookupRule + "')",1000);
	
	/* Social Bookmarking enhancement */
	setTimeout("updateSBLinks()", 100);
	

$('#content-block').prepend('<div id="print-slug" class="print-only"></div>');
var loc=location.hostname;
if (document.getElementsByName) {
  var metaArray = document.getElementsByName('citation_journal_title');
  for (var i=0; i<metaArray.length; i++) {
    $('<span class="jnl-title">'+ metaArray[i].content + '</span><span class="jnl-url">'+ loc + '</span>' ).appendTo('#print-slug');
  }
};


$('div#col-2  div.cb-slug').clone().appendTo('#print-slug');




	
});

function handleAuthAffil(authorAffilList,authorNotes,authorContributorList) {
	var authAffilMatch = getSiteOption('authAffilMatch','div.article div.contributors ol.affiliation-list:has(li)');	
	var authAffil = (authAffilMatch != undefined) ? $(authAffilMatch) : '';
	var disableIfMultAffils = getSiteOption('authAffilDisableMultipleMatches',false);
	if (authAffil.length && ((authAffil.length <= 1) || (!disableIfMultAffils))) {
		var expandStr = getSiteOption('authExpandString', null);
		if (expandStr == null) {
			expandStr = getSiteOption('expandString', '+');
		}
		var contractStr = getSiteOption('authContractString', null);
		if (contractStr == null) {
			contractStr = getSiteOption('contractString', '-');
		}
		var newP = '<p class="affiliation-list-reveal"><a href="#" class="view-more">' + expandStr + '</a> Author Affiliations</p>';
		/* add auth affil show/hide p */
		var contribLists = $("div.article div.contributors ol.contributor-list:has(li)");
		if (contribLists.length) {
			contribLists.after(newP);
		}
		/* hide author affiliations until requested */
		if (authAffil.length) {
			authAffil.each(
				function (i) {
					modClass(authAffil.eq(i),'hideaffil','showaffil');
				}
			);
		}
		$(authorAffilList).click(
			function(e) {
					AuthClickOnAffilButton(authorAffilList,authAffilMatch,expandStr,contractStr,e);
			}
		);
		/* show author affiliations when affil link is selected */
		$(authorContributorList).click(
			function(e) {
					AuthClickOnContribAffilLink(authorAffilList,authAffilMatch,expandStr,contractStr,e);
			}
		);

	var authNotesMatch = getSiteOption('authNotesMatch','div.article div.contributors ul.author-notes:has(li)');	
	var authNotes = (authNotesMatch != undefined) ? $(authNotesMatch) : '';
	var disableIfMultNotes = getSiteOption('authNotesDisableMultipleMatches',false);
	if (authNotes.length && ((authNotes.length <= 1) || (!disableIfMultNotes))) {
		var expandStr = getSiteOption('authExpandString', null);
		if (expandStr == null) {
			expandStr = getSiteOption('expandString', '+');
		}
		var contractStr = getSiteOption('authContractString', null);
		if (contractStr == null) {
			contractStr = getSiteOption('contractString', '-');
		}
        var authAffilList = $("div.article div.contributors ol.affiliation-list:has(li):last"); //get the affiliate-list
        var newNotesP = '<p class="author-notes-reveal"><a href="#" class="view-more">' + expandStr + '</a> Author Notes</p>';
		/* add auth notes show/hide p, and move author-notes after it */
	    authAffilList.addClass("has-authnotes").after(authNotes).after(newNotesP);
		/* hide author notes until requested */
		authNotes.each( //already checked if authNotes present
			function (i) {
				modClass(authNotes.eq(i),'hidenotes','shownotes');
			}
		);
		$(authorNotes).click(
			function(e) {
					AuthClickOnNotesButton(authorNotes,authNotesMatch,expandStr,contractStr,e);
			}
		);
    }
        fixColHeights(1);
	}
}

function figExpandInline() {
	var figlinks = $("div.fig-inline:not(.video-inline) a[href*='expansion']");
	if (figlinks.length) {
		figlinks.each(
			function() {
				var $this = $(this);
				var classAttr = $this.attr("class");
				if (!(classAttr && ((classAttr == 'in-nw') || (classAttr == 'ppt-landing')))) {
                
                    $this.addClass("fig-inline-link");
                    
					if ($this.text().indexOf('n this window') >= 0) {
						$this.text("In this page");
					}
					var parentDiv = $this.parents("div.fig-inline");
					var href = $this.attr("href");
					$(this).click(
						function(e) {
							swapFig(e, href, parentDiv);
                            parentDiv.find('a.fig-inline-link, a.in-nw-vis').unbind('click');
						}
					);
				}
			}
		);
	}
}




function swapFig(e, href, figWrapperEl) {
	var host = document.location.protocol + "//" + document.location.host;
	var path = document.location.pathname;
	var pathseg = path.substring(0, path.lastIndexOf('/'));
	//var baseAjaxUrl = host + pathseg + '/' + href;
	var baseAjaxUrl;
	if (href.indexOf('http:' == 0)) {
		baseAjaxUrl = href;
	}
	else {
		baseAjaxUrl = host + pathseg + '/' + href;
	}
	var ajaxUrl = baseAjaxUrl + ((href.indexOf('?') >= 0) ? '&' : '?') + 'baseURI=' + ((baseAjaxUrl.indexOf('?') > 0) ? baseAjaxUrl.substring(0, baseAjaxUrl.indexOf('?')): baseAjaxUrl);
	//var ajaxUrl = baseAjaxUrl + ((href.indexOf('?') >= 0) ? '&' : '?') + 'baseURI=' + baseAjaxUrl;
	$.ajax({
		url: ajaxUrl,
		dataType: "html",
		type: "GET",
		error: ajaxErr,
		beforeSend: addFigHeaders,
		success: function(xhtml) {
			addFig(xhtml, figWrapperEl);
		},
		complete: ajaxComplete
	});
    
    
	e.preventDefault();
}
function addFigHeaders(req) {
	addCommonHeaders(req);
	addPartHeaders(req);
}

function addFig(xhtmlData, figWrapperEl) {
	if (xhtmlData && !(xhtmlData.indexOf('<html') >= 0)) {
        figWrapperEl.addClass("inline-expansion");
        
        // pick the replacement image out of the div we get back - there should be only one
        largerImage = $("img", xhtmlData).filter(":first");
        largerImage.addClass("replaced-figure");
        
        // get the current image, mark it and hide it
        previousImage = $("img", figWrapperEl).filter(":first");
        previousImage.addClass("previous-figure");
        previousImage.hide();
        
        // swap previous image out for larger image
        largerImage.appendTo(previousImage.parent());
        
        // Remove link to "display in this window" by looking for the link and hiding it's parent
        figWrapperEl.find(".callout .callout-links a.fig-inline-link").parent('li').hide();
        
		newWindowTargets();
		var lookupRule = "div.article div.fig img";
		var numImagesToLoad = checkUnloadedImgs(lookupRule);
		setTimeout("fixHeightForImages(1" + "," + numImagesToLoad + ",'" + lookupRule + "')", 1000);
		fixColHeights(1);
	}
}

function refLinksNewWindowTarget() {  
	$("div.ref-list div.cit-extra a").each(
		function(i) {
			var origTitle = $(this).attr("title");
			var newTitle = '';
			if ((origTitle == undefined) || (!origTitle)) {
				origTitle = '';
			}
			else {
				newTitle = origTitle + ' ';
			}
			newTitle += '[opens in a new window]';
			$(this).attr("target", "_blank").attr("title", newTitle);
		}
	);
}

function addRefPops() {
	var numMissed = 0;
	var maxToSkip = getSiteOption('refPopsMaxToSkip', 10);
	var i = 1;
	var idroot = "#xref-ref-";
	var el = $(idroot + i + '-1');
	/* not all refs appear in text; compensate */
	while (numMissed < maxToSkip) {
		if (el.length) {
			numMissed = 0;
		el.hover(dispRef, hideRef);
		if ((getSiteOption("isIosRefPops") == true)) {
 			//Also set the ios version of the function
			el.hover(iosdispRef, hideRef);
		}
		var j = 2;
		var el2 = $(idroot + i + "-" + j);
		while (el2.length) {
			el2.hover(dispRef, hideRef);
			if ((getSiteOption("isIosRefPops") == true)) {
 				//Also set the ios version of the function
				el2.hover(iosdispRef, hideRef);
			}
			j++;
			el2 = $(idroot + i + "-" + j);
		}
		}
		else {
			numMissed++;
		}
		i++;
		el = $(idroot + i + "-1");
	}
}

function dispRef(e) {
	var link = $(this).attr("href");
	if($("div#hovering-ref").length) {
		$("div#hovering-ref").remove();
		//alert("hovering-ref div removed on new hover!");
	}
	var linkEl = $(link);
	if (linkEl.length) {
		var citHtml = linkEl.next("div").children("div.cit-metadata");
		if (!(citHtml.length)) {
			citHtml = linkEl.parent().next("div").children("div.cit-metadata");
		}
		if (citHtml.length) {
			var newDiv = '<div id="hovering-ref">' + (citHtml.clone().html()) + '</div>';
			$("body").append(newDiv);
			var elH = getObjHeight($("div#hovering-ref"));
			if ((getSiteOption("isIosRefPops") == true)) {
				$("div#hovering-ref").css("left", 10).css("top", e.pageY-elH).css("position", "absolute");
			}
			else {
				$("div#hovering-ref").css("left", e.pageX+10).css("top", e.pageY-elH).css("position", "absolute");
			}
		}
	}
}

function hideRef(e) {
	if($("div#hovering-ref").length) {
		$("div#hovering-ref").remove();
	}
}

function getHWCiting() {
	var citingA = $("#cb-hw-citing-articles");
	if (citingA.length) {
		var newA = '<a id="cb-loading-hw-cited" href="#">Loading citing article data...</a>';
		citingA.replaceWith(newA);
		var href = citingA.attr("href");
		var id = '';
		if (href && (href.indexOf('?') > 0)) {
			var args = href.substring(href.indexOf('?') + 1).split('&');
			for (var i = 0; i < args.length; i++) {
				if (args[i].toLowerCase().indexOf('legid=') == 0) {
					id = args[i].substring(args[i].indexOf('=') + 1);
					if (id.indexOf('#') > 0) {
						id = id.substring(0, id.indexOf('#'));
					}
				}
			}
			if (!(id == '')) {
				var host = document.location.protocol + "//" + document.location.host;
				var ajaxUrl = host + '/cited-by/' + id.replace(/;/,'/');
				$.ajax({
					url: ajaxUrl,
					dataType: "html",
					type: "GET",
					error: ajaxErr,
					success: addHWCiting,
					complete: ajaxCompleteCitedBy
				});

			}
		}
	}
}
function getHWRelatedURLs() {
	var relatedURLsA = $("#cb-related-urls");
	var relatedURLsMsg = getSiteOption('relatedWebPageLoadingText','Loading related web page data...');	
	if (relatedURLsA.length) {
		var newA = '<a id="cb-loading-related-urls" href="#">' + relatedURLsMsg + '</a>';
		relatedURLsA.replaceWith(newA);
		var href = relatedURLsA.attr("href");
		var id = '';
		if (href && (href.indexOf('?') > 0)) {
			var args = href.substring(href.indexOf('?') + 1).split('&');
			for (var i = 0; i < args.length; i++) {
				if (args[i].toLowerCase().indexOf('legid=') == 0) {
					id = args[i].substring(args[i].indexOf('=') + 1);
					if (id.indexOf('#') > 0) {
						id = id.substring(0, id.indexOf('#'));
					}
				}
			}
			if (!(id == '')) {
				var host = document.location.protocol + "//" + document.location.host;
				var ajaxUrl = host + '/related-web-pages/' + id.replace(/;/,'/');
				$.ajax({
					url: ajaxUrl,
					dataType: "html",
					type: "GET",
					error: ajaxErr,
					success: addRelatedURLs,
					complete: ajaxComplete
				});

			}
		}
	}
}
function getPatientInformData() {
	var pInformA = $("#cb-patientinform");
	if (pInformA.length) {
		var newA = '<a id="cb-loading-patientinform" href="#">Loading <em>patient</em>INFORMation...</a>';
		pInformA.replaceWith(newA);
		var href = pInformA.attr("href");
		var id = '';
		if (href && (href.indexOf('?') > 0)) {
			var args = href.substring(href.indexOf('?') + 1).split('&');
			for (var i = 0; i < args.length; i++) {
				if (args[i].toLowerCase().indexOf('legid=') == 0) {
					id = args[i].substring(args[i].indexOf('=') + 1);
					if (id.indexOf('#') > 0) {
						id = id.substring(0, id.indexOf('#'));
					}
				}
			}
			if (!(id == '')) {
				var host = document.location.protocol + "//" + document.location.host;
				var ajaxUrl = host + '/related-web-pages/patientinform/' + id.replace(/;/,'/');
				$.ajax({
					url: ajaxUrl,
					dataType: "html",
					type: "GET",
					error: ajaxErr,
					success: addPatientInform,
					complete: ajaxComplete
				});

			}
		}
	}
}
function getISIRelated() {
	var relatedA = $("#cb-isi-similar-articles");
	if (relatedA.length) {
		var newA = '<a id="cb-isi-similar-articles" href="#">Loading Web of Science article data...</a>';
		relatedA.replaceWith(newA);
		var href = relatedA.attr("href");
		var id = '';
		if (href) {
			var hrefDec = decodeURI(href);
			if ((hrefDec.indexOf('?') > 0)) {
				var args = hrefDec.substring(hrefDec.indexOf('?') + 1).split('&');
				for (var i = 0; i < args.length; i++) {
					var argDec = decodeURIComponent(args[i]);
					if (argDec.toLowerCase().indexOf('access_num=') == 0) {
						id = argDec.substring(argDec.indexOf('=') + 1);
						if (id.indexOf('#') > 0) {
							id = id.substring(0, id.indexOf('#'));
						}
					}
				}
				if (!(id == '')) {
					var host = document.location.protocol + "//" + document.location.host;
					var ajaxUrl = host + '/isi-links/has-related/' + id.replace(/;/,'/');
					$.ajax({
						url: ajaxUrl,
						dataType: "html",
						type: "GET",
						error: ajaxErr,
						success: addISIRelated,
						complete: ajaxComplete
					});
				}
			}
		}
	}
}
function getCiting(service, msg, pathseg, successFn, addlParamString) {
	if (typeof(addlParamString) == "undefined") {
		addlParamString = '';
	}
	var citingA = $("#cb-" + service + "-citing-articles");
	if (citingA.length) {
		var newA = '<a id="cb-loading-' + service + '-cited" href="#">' + msg + '</a>';
		citingA.replaceWith(newA);
		var href = citingA.attr("href");
		var id = '';
		if (href) {
			var hrefDec = decodeURI(href);
			if ((hrefDec.indexOf('?') > 0)) {
				var args = hrefDec.substring(hrefDec.indexOf('?') + 1).split('&');
				for (var i = 0; i < args.length; i++) {
					var argDec = decodeURIComponent(args[i]);
					if (argDec.toLowerCase().indexOf('access_num=') == 0) {
						id = argDec.substring(argDec.indexOf('=') + 1);
						if (id.indexOf('#') > 0) {
							id = id.substring(0, id.indexOf('#'));
						}
					}
				}
				if (!(id == '')) {
					var host = document.location.protocol + "//" + document.location.host;
					var ajaxUrl = host + '/' + service + '-links/' + pathseg + id.replace(/;/,'/') + (addlParamString != '' ? '?' + addlParamString : '');
					$.ajax({
						url: ajaxUrl,
						dataType: "html",
						type: "GET",
						error: ajaxErr,
						success: successFn,
						complete: ajaxComplete
					});
				}
			}
		}
	}
}

function getISICiting() {
	var citingA = $("#cb-isi-citing-articles");
	if (citingA.length) {
		var newA = '<a id="cb-loading-isi-cited" href="#">Loading Web of Science citing article data...</a>';
		citingA.replaceWith(newA);
		var href = citingA.attr("href");
		var id = '';
		if (href) {
			var hrefDec = decodeURI(href);
			if ((hrefDec.indexOf('?') > 0)) {
				var args = hrefDec.substring(hrefDec.indexOf('?') + 1).split('&');
				for (var i = 0; i < args.length; i++) {
					var argDec = decodeURIComponent(args[i]);
					if (argDec.toLowerCase().indexOf('access_num=') == 0) {
						id = argDec.substring(argDec.indexOf('=') + 1);
						if (id.indexOf('#') > 0) {
							id = id.substring(0, id.indexOf('#'));
						}
					}
				}
				if (!(id == '')) {
					var host = document.location.protocol + "//" + document.location.host;
					var ajaxUrl = host + '/isi-links/' + id.replace(/;/,'/');
					$.ajax({
						url: ajaxUrl,
						dataType: "html",
						type: "GET",
						error: ajaxErr,
						success: addISICiting,
						complete: ajaxComplete
					});
				}
			}
		}
	}
}
function getEntrezLinks() {
	var entrezDiv = $("#cb-entrez-links-placeholder");
	if (entrezDiv.length) {
		var entrezA = entrezDiv.children("a");
		if (entrezA) {
			var host = document.location.protocol + "//" + document.location.host;
			var ajaxUrl = host + entrezA.attr("href");
			$.ajax({
				url: ajaxUrl,
				dataType: "html",
				type: "GET",
				error: ajaxErr,
				success: addEntrezLinks,
				complete: ajaxComplete
			});
		}
	}
}

function ajaxErr(req, msg, e) {
}
function ajaxComplete(req, msg) {
}
function ajaxCompleteCitedBy(req, msg) {
}
function updateCBItem(cbItem, newHTML, hasData) {
	var parentItem = cbItem.parents("li").eq(0);
	cbItem.replaceWith(newHTML);
	if (!hasData) {
		// hide the parent li
		if (parentItem.length) {
			modClass(parentItem,"nodata","");
			// check if there are any siblings still being displayed
			var otherItems = parentItem.siblings();
			var allItemsEmpty;
			if (otherItems.length) {
				if (otherItems.length == otherItems.filter(".nodata").length) {
					allItemsEmpty = true
				}
				else {
					allItemsEmpty = false;
				}
			}
			else {
				allItemsEmpty = true;
			}
			if (allItemsEmpty) {
				var cbsection = parentItem.parents("div.cb-section").eq(0);
				if (cbsection.length) {
					modClass(cbsection,"nodata","");
				}
				// do we need to look further?
				if (parentItem.parents("div.cb-section").length > 1) {
					var cbSectionSibs =  cbsection.siblings("div.cb-section");
					if (cbSectionSibs.length) {
						if (cbSectionSibs.length == cbSectionSibs.filter(".nodata").length) {
							allItemsEmpty = true
						}
						else {
							allItemsEmpty = false;
						}
					}
					else {
						allItemsEmpty = true;
					}
					if (allItemsEmpty) {
						var cbgrandsection = parentItem.parents("div.cb-section").eq(1);
						if (cbgrandsection.length) {
							modClass(cbgrandsection,"nodata","");
						}
					}
				}
			}
		}
	}
	// in frameset fix targets on child links, forms
	fixFrameLinks(parentItem.find("a,form"));
	fixColHeights(2);
}
function fixFrameLinks(jqItems) {
	if ((gIsFrameset != null) && gIsFrameset) {
		jqItems.each(
			function(i) {
				var href = $(this).attr("href");
				var action = $(this).attr("action"); // if form
				if ((href != null) || (action != null)) {
					var inFrameAnchor = ((href != null) && (((/frameset=/.test(href)) && (/#/.test(href))) || (href.substring(0,1) == '#')));
					if ((!inFrameAnchor) || (action != null)) {
						if ((navigator.userAgent.indexOf("Firefox") >= 0) && ($(this).hasClass("pdf-direct-link"))) {
							$(this).attr("target", "_blank");
						} else if (getSiteOption("hasFrameLinkTargetFunction", false)) {
							$(this).attr("target", setFrameLinkTarget($(this)));
						} else {
							$(this).attr("target", "_top");
						}
					}
				}
			}
		);
	}
}
function addRelatedURLs(xhtmlData) {
	var cbA = $("#cb-loading-related-urls");
	if (gIsFrameset) {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-related-urls-none">Not available in this view</div>', false);
		}
	}
	else if (xhtmlData && !(xhtmlData.indexOf('<span') >= 0)) {
		$("#related-urls").replaceWith(xhtmlData);
		var relatedWebPagesLabel = getSiteOption('relatedWebPagesLabel', 'Related Web Pages');
		fixColHeights(1);
		if (cbA.length) {
			updateCBItem(cbA, '<a href="#related-urls">' + relatedWebPagesLabel + '</a>', true);
		}
	}
	else {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-related-urls-none">No related web pages</div>', false);
		}
	}
}
function addPatientInform(xhtmlData) {
	var cbA = $("#cb-loading-patientinform");
	if (gIsFrameset) {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-patientinform-none">Not available in this view</div>', false);
		}
	}
	else if (xhtmlData && !(xhtmlData.indexOf('<span') >= 0)) {
		$("#patientinform-links").replaceWith(xhtmlData);
		fixColHeights(1);
		if (cbA.length) {
			updateCBItem(cbA, '<a href="#patientinform-links"><em>patient</em>INFORMation</a>', true);
		}
	}
	else {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-patientinform-none">No <em>patient</em>INFORMation available for this article</div>', false);
		}
	}
}
function addHWCiting(xhtmlData) {
	var cbA = $("#cb-loading-hw-cited");
	if (gIsFrameset) {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-hw-cited-none">Not available in this view</div>', false);
		}
	}
	else if (xhtmlData) {
		$("#content-block").append(xhtmlData);
		var hwCitingLabel = getSiteOption('hwCitingLabel', 'View citing article information');
		fixColHeights(1);
		if (cbA.length) {
            if (!(getSiteOption("includeHWCitingTitle") == true)) {
                updateCBItem(cbA, '<a href="#cited-by">' + hwCitingLabel + '</a>', true);
            }
            else {
                updateCBItem(cbA, '<a href="#cited-by" title="HighWire Press-hosted articles citing this article">' + hwCitingLabel + '</a>', true);
            }
		}
	}
	else {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-hw-cited-none">No citing articles</div>', false);
		}
	}
}
function addISIRelated(xhtmlData) {
	var cbA = $("#cb-isi-similar-articles");
	if (xhtmlData && !(xhtmlData.indexOf('<span') >= 0)) {
		if (cbA.length) {
			updateCBItem(cbA, xhtmlData, true);
		}
	}
	else {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-isi-related-none">No Web of Science related articles</div>', false);
		}
	}
}
function addISICiting(xhtmlData) {
	var cbA = $("#cb-loading-isi-cited");
	if (xhtmlData && !(xhtmlData.indexOf('<span') >= 0)) {
		if (cbA.length) {
			updateCBItem(cbA, xhtmlData, true);
		}
	}
	else {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-isi-cited-none">No Web of Science citing articles</div>', false);
		}
	}
}
function addScopusCiting(xhtmlData) {
	var cbA = $("#cb-loading-scopus-cited");
	if (xhtmlData && (xhtmlData.indexOf('<a ') >= 0)) {
		if (cbA.length) {
			updateCBItem(cbA, xhtmlData, true);
		}
	}
	else {
		if (cbA.length) {
			updateCBItem(cbA, '<div id="cb-loaded-scopus-cited-none">No Scopus citing articles</div>', false);
		}
	}
}
function addEntrezLinks(xhtmlData) {
	var entrezDiv = $("#cb-entrez-links-placeholder");

	if (xhtmlData && (xhtmlData.indexOf('<a ') >= 0)) {
		if (entrezDiv.length) {
			updateCBItem(entrezDiv, xhtmlData, true);
		}
	}
	else {
		if (entrezDiv.length) {
			updateCBItem(entrezDiv, '<div id="cb-entrez-links-none">No NCBI links</div>', false);
		}
	}
}

function updateSBLinks() {

	var fbLink = $("a.sb-facebook");
	if (fbLink.length) {
		fbLink.click(
			function(e) {
				window.open(this.href, 'sharer', 'toolbar=0,status=0,width=626,height=436');
				e.preventDefault();
			}
		);
	}
    
    updateGPlus();
    
}

function updateGPlus() {

    var  gPlus = $("ul.social-bookmark-links li.social-bookmarking-item-googleplus");
    /*
                See instructions here if you want to see how to change this:
                http://www.google.com/webmasters/+1/button/
            */
    /*
    	running a test here to check for MSIE < v8, in the interest of avoiding odd display when code returned by google fails.
    */
    var suppressGPlus = false;
    if (($.browser.msie)&&(parseInt($.browser.version, 10)<8)) {
    	suppressGPlus = true;
    }
    if (suppressGPlus) {
    	$('.social-bookmarking-item-googleplus').hide();
    } else {
		if (gPlus.length) {
	        var gPlusSize         = getSiteOption("googlePlusSize", 'small');
	        var gPlusDisplayCount = getSiteOption("googlePlusDisplayCount", 'false');
	        var gPlusURL          = $('head meta[name=citation_public_url]').filter(':first').attr('content') || document.location;

	        //gPlus.prepend('<g:plusone size="' + gPlusSize + '" count="' + gPlusDisplayCount + '" href="' + gPlusURL +'" callback="gPlusCallback"></g:plusone>');
	        gPlus.prepend('<div class="g-plusone" data-size="' + gPlusSize + '" data-count="' + gPlusDisplayCount + '" data-href="' + gPlusURL +'" data-callback="gPlusCallback"></div>');
        
	        $('a', gPlus).hide();  // remove anchor tag, we'll need it later for clicktracking
        
	        $('body').append('<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>');
		};
	}
}

function gPlusCallback() {
    var gPlusLoggerURL = $("ul.social-bookmark-links li.social-bookmarking-item-googleplus a").filter(':first').attr('href');
   
   // silently log the successful click
   if (gPlusLoggerURL.length) {
    $.get(gPlusLoggerURL);
   }
    
}

function addDockedNav() {
	var slugEl = $("#col-2 #slugline");
	// get direct children li elements only
	var artViews = $("#article-cb-main .cb-section ol:has(li a[rel^='view-']) > li").clone();
	var newDiv = '<div id="docked-nav"></div>';
	$("#col-2").append(newDiv);
	$("#col-2 #docked-nav").hide();
	var newDivJQuery = $("#docked-nav");
	newDivJQuery.append('<div class="content-box"><div class="cb-contents"><h3>This Article</h3><div class="cb-section cb-slug"><ol id="docked-slug"><li></li></ol></div><div class="cb-section"><ol id="docked-nav-views"></ol></div></div></div>');
	$("#col-2 #docked-nav-views").append(artViews); /*.append(artSupp);*/
	$("#col-2 #docked-nav #docked-slug li").append(slugEl.clone());
	newDivJQuery.append($("#article-dyn-nav").clone());
	$("#col-2 #docked-nav").fadeIn(250);
}


function removeDockedNav() {
	var dockedNav = $("div#docked-nav");
	if(dockedNav.length) {
		dockedNav.fadeOut(250, function() { dockedNav.remove(); });
	}
}

function fixWackyReflinksMarkup() {
    // There's whitespace between the <li> tags, need to remove to avoid ugly spaces between words.


    $("div.ref-list ol.cit-auth-list,div.ref-list ol.cit-ed-list").each(
		function(i) {
			var original_html = $(this).html();
			var whitespace_stripped_html;

            //Multiple spaces into one, remove trailing spaces after </li>
            whitespace_stripped_html = original_html.replace(/\s+/g,' ');
            whitespace_stripped_html = whitespace_stripped_html.replace(/<\/li>\s+/gi,'</li>');
            whitespace_stripped_html = whitespace_stripped_html.replace(/<\/span>\s+<\/li>/gi,'</span></li>');
			$(this).html(whitespace_stripped_html);
		}
	);

}

function linkPDFExtImg() {
	var pdfExtImg = $("#content-block div.extract-view img.pdf-extract-img");
	if (pdfExtImg.length) {
		pdfExtImg.before(
			'<p class="pdf-extract-click-text">' +
			getSiteOption('pdfExtractExpandText','Click image below to view at full size.') +
			'<\/p>'
		);
		pdfExtImg.wrap('<a class="pdf-extract-click" href="#">');
		var clickA = $("#content-block div.extract-view a.pdf-extract-click");
		clickA.click(
			function(e) {
				var wasExpanded = $(this).hasClass("expanded");
				if (wasExpanded) {
					$(this).removeClass("expanded");
				}
				else {
					$(this).addClass("expanded");
				}
				$("#content-option-box #content-toggle a").trigger("click");
				$("#content-block div.extract-view p.pdf-extract-click-text").text(
					
					(wasExpanded ? getSiteOption('pdfExtractExpandText','Click image below to view at full size.') : getSiteOption('pdfExtractContractText','Click image below to return to normal size.'))
				);
				e.preventDefault();
			}
		);
	}
}
function AuthClickOnAffilButton(authorAffilList,authAffilMatch,expandStr,contractStr,e)
{
	var allViewMores = $(authorAffilList);
	var authAffils = $(authAffilMatch);
	if (($(authorAffilList).filter(':first')).text() == contractStr) {
		/* hide the affil list */
		allViewMores.empty().append(expandStr);
		authAffils.each(
			function(i) {
				modClass(authAffils.eq(i),'hideaffil','showaffil');
			}
		);
	}
	else {
		allViewMores.empty().append(contractStr);
		authAffils.each(
			function(i) {
				modClass(authAffils.eq(i),'showaffil','hideaffil');
			}
		);
	}
	fixColHeights(1);
	e.preventDefault();
}

function AuthClickOnNotesButton(authorNotes,authNotesMatch,expandStr,contractStr,e)
{
	var allViewMores = $(authorNotes);
	var authNotes = $(authNotesMatch);
	if (($(authorNotes).filter(':first')).text() == contractStr) {
		/* hide the affil list */
		allViewMores.empty().append(expandStr);
		authNotes.each(
			function(i) {
				modClass(authNotes.eq(i),'hidenotes','shownotes');
			}
		);
	}
	else {
		allViewMores.empty().append(contractStr);
		authNotes.each(
			function(i) {
				modClass(authNotes.eq(i),'shownotes','hidenotes');
			}
		);
	}
	fixColHeights(1);
	e.preventDefault();
}

function AuthClickOnContribAffilLink(authorAffilList,authAffilMatch,expandStr,contractStr,e)
{
	$(authorAffilList).each(
		function() {
			if ($(this).text() == expandStr) {
				$(this).empty().append(contractStr);
				var authAffils = $(authAffilMatch);
				if (authAffils.length) {
					authAffils.each(
						function(i) {
							modClass(authAffils.eq(i),'showaffil','hideaffil');
						}
					);
				}
				fixColHeights(1);
			}
		}
	);
}


