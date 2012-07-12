/* jQuery and other javascript functions */

var gPublisherVars = {
	pubName: 'aaas'
};

$(document).ready(function() {

	var allCits = $("li.cit");
	if (allCits.length) {
		allCits.each(
			function(i) {
				var $thisCit = allCits.eq(i);
				var contentID = $thisCit.find("div.cit-metadata span.cit-doi").eq(0).text();
				if (contentID.length && (contentID.length > 0)) {
					$thisCit.find("ul.cit-views").append('<li><span class="cit-sep">&#91;</span><a href="#" class="req-permissions-js" rel="permissions">Request permissions</a><span class="cit-sep">&#93;</span></li>');
					var newLink = $thisCit.find("a.req-permissions-js");
					if (newLink.length) {
						var title = $thisCit.find("div.cit-metadata h3");
						if (!(title.length)) {
							title = $thisCit.find("div.cit-metadata h4");
						}
						if (title.length) {
							title = title.eq(0).text().replace(/\s\s+/g," ");
						}
						else {
							title = '';
						}
						var date = $thisCit.find("div.cit-metadata span.cit-print-date").eq(0).text();
						var authList = $thisCit.find("div.cit-metadata .cit-auth-list .cit-auth");
						var authStr = '';
						if (authList.length) {
							var authListArray = new Array(authList.length);
							authList.each(
								function(i) {
									authListArray[i] = (authList.eq(i).text());
								}
							);
							authStr = authListArray.join(', ');
						}
						var startpage = $thisCit.find("div.cit-metadata span.cit-pages-fpage").eq(0).text();
						contentID = contentID.replace(/^\s*[Dd][Oo][Ii]:\s*/,'');
						newLink.click(
							function(e) {
								RightslinkPopUp(title, date, authStr, startpage, contentID);
								e.preventDefault();
							}
						);
					}
				}
			}
		);
	}

});



function RightslinkPopUp( title, date, author, startpage, contentID ) {
	var url = "https://s100.copyright.com/AppDispatchServlet";
	var location = url
		+ "?publisherName=" + encodeURIComponent(gPublisherVars.pubName)
		+ "&publication=" + encodeURIComponent(gJournalVars.jnlID)
		+ "&title=" + encodeURIComponent(title)
		+ "&publicationDate=" + encodeURIComponent(date)
		+ "&author=" + encodeURIComponent(author)
		+ "&contentID=" + encodeURIComponent(contentID);
	
	location = location
		+ "&volumeNum=" + encodeURIComponent('')
		+ "&issueNum=" + encodeURIComponent('')
		+ "&startPage=" + encodeURIComponent(startpage)
		+ "&endPage=" + encodeURIComponent('')
		+ "&section=" + encodeURIComponent('')
		+ "&copyright=" + encodeURIComponent(gJournalVars.copy)
		+ "&orderBeanReset=true";
		
	PopUp = window.open(
		location, 'Rightslink', 'location=no,toolbar=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=650,height=550'
	);
}


$(document).ready(function() {
	$("div.nonresearch-content.fig").each(function() {
		var figId = $(this).attr("id");
		var thisFigImgs = $("#" + figId + " img");
		if (thisFigImgs.length) {
			for (var i = 0; i < thisFigImgs.length; i++) {
				thisFigImgs.eq(i).css("width","auto");
			}
			setFigDivWidth(figId,1);
		}
	});
});
function setFigDivWidth(figId,count) {
	var thisFigDiv = $("#" + figId);
	var thisFigImgs = $("#" + figId + " img");
	if (thisFigImgs.length) {
		var unloadedCount = 0;
		var maxImgWidth = 0;
		thisFigImgs.each(
			function() {
				var imgWidth = this.offsetWidth;
				if (imgWidth<50) {
					unloadedCount++;
				}
				if ((imgWidth > 0) && (imgWidth > maxImgWidth)) {
					maxImgWidth = imgWidth;
				}
			}
		);
		if ((unloadedCount > 0) && (count < 10)) {
			setTimeout('setFigDivWidth("' + figId + '",'+ (count+1) +')', 2000);
		}
		else {
			if (maxImgWidth > 0) {
				thisFigDiv.css("width", "" + maxImgWidth + "px");
				var figparts = $("#" + figId + " div.fig-caption, #" + figId + " div.fig-inline");
				if (figparts.length) {
					figparts.each(
						function() {
							$(this).css("width","auto");
						}
					);
				}
			}
		}
	}
}

function figExpandInline() {
	var figlinks = $("div.fig-inline a[href*='expansion']");
	if (figlinks.length) {
		figlinks.each(
			function() {
				var $this = $(this);
				var classAttr = $this.attr("class");
				if (!(classAttr && ((classAttr == 'in-nw') || (classAttr == 'ppt-landing')))) {
					if ($this.text().indexOf('n this window') >= 0) {
						$this.text("In this page");
					}
					var parentDiv = $this.parents("div.fig-inline");
					var href = $this.attr("href");
					$(this).click(
						function(e) {
							swapFig(e, href, parentDiv);
							$(this).parents('div.nonresearch-content.fig').css("width","auto");

							
						}
					);
				}
			}
		);
	}
}

function addFig(xhtmlData, figWrapperEl) {
if (xhtmlData && !(xhtmlData.indexOf('<html') >= 0)) {
figWrapperEl.replaceWith(xhtmlData);
newWindowTargets();
var lookupRule = "div.article div.fig img";
var numImagesToLoad = checkUnloadedImgs(lookupRule);
setTimeout("fixHeightForImages(1" + "," + numImagesToLoad + ",'" + lookupRule + "')", 1000);
fixColHeights(1);
}
214 	} 