gSiteOptions.suppressDockedNav=true;
gSiteOptions.noPDFExtractExpand=true;
gSiteOptions.collapsibleLabels=["h3 span","h3","h4 span","h4","span"];

gSiteOptions.openWindowDetails=new Object();
gSiteOptions.openWindowDetails['submit-sci-nw-link'] = { target: 'submitinit', config: 'width=800,height=600,scrollbars=1,resizable=1,channelmode=0,toolbar=0,location=0,directories=0,menubar=0' };

gSiteOptions.openWindowDetails['cb-rightslink-link'] = { target: 'rightslink', config: 'width=800,height=600,scrollbars=1,resizable=1,channelmode=0,toolbar=0,location=0,directories=0,menubar=0' };

gSiteOptions.relatedWebPagesLabel='Related Web Sites';
gSiteOptions.relatedWebPageLoadingText='Loading Related Web Sites...';
gSiteOptions.hwCitingLabel='HighWire Press';

$(document).ready(function() {
		if ($("#pageid-content").length) {
			var ems = $("h4.rel-which-jnl em");
			if (ems.length) {
				for (var i = 0; i < ems.length - 1; i++) {
					for (var j = i+1; j < ems.length; j++) {
						var t = ems.eq(i).text();
						if (ems.eq(j).text() == t) {
							ems.eq(j).parent("h4").hide();
						}
					}
				}
			}
		}

    $("#pageid-content li.compilation").prepend('<a href="#content-block" class="nav-top">Top of page</a>');
	$("#pageid-toc span.cit-ahead-of-print-date").before("<br />");
	$("#search-terms").focus(
	 function()
	 {
	  $(this).css("background-color","#fdf6e8");
	  $(this).css("border-color","#666");
	  $(this).css("color","#000");
	  // set to empty if it's the default
	  if(this.value == this.defaultValue)
	  {
	   this.value = "";
	  }
	 }
	)

	$("#search-terms").blur(
	 function()
	 {
	  $(this).css("background-color","#FFFFFF");
	  $(this).css("border-color","#d9d9d9");
	  $(this).css("color","#ccc");
	  // reset to default if it's empty
	  if(this.value == "")
	  {
	   this.value = this.defaultValue;
	  }
	 }
	)

		$("#keyword").focus(
	 function()
	 {
	  $(this).css("color","#000");
	  // set to empty if it's the default
	  if(this.value == this.defaultValue)
	  {
	   this.value = "";
	  }
	 }
	)

	$("#keyword").blur(
	 function()
	 {
	  $(this).css("color","#333333");
	  // reset to default if it's empty
	  if(this.value == "")
	  {
	   this.value = this.defaultValue;
	  }
	 }
	)
});


