// Google analytics javascript
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2369900-1']);

/*
 * Updated Profile Version: Not ready for live yet
 *
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-2369900-16']);
  _gaq.push(['_setDomainName', '.sciencemag.org']);
  _gaq.push(['_setAllowHash', false]);
  _gaq.push(['_addOrganic', 'scholar.google','q']);
  _gaq.push(['_addOrganic', 'images.google','q']);
 

 // specific to the main Science site
  var citation_taxonomy = document.getElementsByName("citation_taxonomy"),
      article_type     = document.getElementsByName("citation_article_type");

  if (typeof citation_taxonomy != "undefined") {
     _gaq.push(['_setCustomVar', 1, 'Taxonomy', citation_taxonomy[0].content, 3]);
  }
  if (typeof article_type != "undefined") {
     _gaq.push(['_setCustomVar', 1, 'Article Type', article_type[0].content, 3]);
  }
  delete citation_taxonomy;
  delete article_type;

*/

  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
