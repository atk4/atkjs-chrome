/*
 * Manage the ATK developper panel inside chrome developper window.
 *
 * This panel will listen for ajax request and display
 * request and response infotmation from the request.
 *
 */

/**
 * Main entry when dom is ready.
 */
jQuery(function(jQuery){
  setupPanel(jQuery);
});

// check and display atkui-js version when opening.
chrome.devtools.inspectedWindow.eval("atk.version()", function(result, error){
  document.getElementById('atk-version').innerHTML = ' ' + result + ' ';
});


chrome.devtools.network.onRequestFinished.addListener(function(request){
  if (isXhrRequest(request)) {
    setPanelRequest(request.request);
    request.getContent(function(content){
      //setResponseFromContent(content);
      setPanelResponse(getResponseFromContent(content));
    });
  } else {
    setPanelResponse({});
    setPanelRequest({});
  }

});

/**
 * Update panel section with callback request information.
 *
 * @param request
 */
function setPanelRequest(request) {
  var qString = '', pData = '';

  if (request.queryString && request.queryString.length > 0) {
    request.queryString.forEach(function(item){
      qString = qString + getTrForItemValue(item);
    });
  }

  if (request.postData && request.postData.params && request.postData.params.length > 0 ) {
    request.postData.params.forEach(function(item){
      pData = pData + getTrForItemValue(item);
    });
  }

  jQuery('#atk-request-url').html(request.url ? request.url.replace(/\?.*$/,"") : '');
  jQuery('#atk-header-query > tbody').html(qString);
  jQuery('#atk-header-data > tbody').html(pData);
}


/**
 * Return an html string table row.
 *
 * @param item
 * @returns {string}
 */
function getTrForItemValue(item) {
  return '<tr><td>'+ item.name +'</td><td>'+item.value+'</td></tr>';
}

/**
 * Update panel with callback response information.
 */
function setPanelResponse(response) {

  if (typeof response.success != 'undefined') {
    jQuery('#atk-response-status').html(jQuery('<span>').addClass('ui empty circular label').addClass(response.success ? 'green' : 'red'));
  }
 else {
    jQuery('#atk-response-status').html('');
  }

  jQuery('#atk-html').html(response.html ? response.html : '');
  jQuery('#atk-rawhtml').text(response.html ? formatFactory(response.html.trim()) : '');
  jQuery('#atk-atkjs').text(response.atkjs ? response.atkjs : '');
  jQuery('#atk-response-id').text(response.id ? response.id : '');

  jQuery('#atk-atkjs').parents('figure').toggle(response.atkjs ? true : false);
  jQuery('#atk-rawhtml').parents('figure').toggle(response.html ? true : false);

  jQuery('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  //Prism.highlightAll();
}

/**
 * Get response from callback received content.
 * Parse received json content and return proper object.
 *
 * @param content
 */
function getResponseFromContent(content) {
  try {
    var response;
    response = JSON.parse(content);
    response.atkjs = response.atkjs ? response.atkjs.replace(/<\/?script>/g, '') : '';
    return response;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Check if request is from ajax.
 *
 * @param req
 * @returns {boolean}
 */
function isXhrRequest(req) {
  return req.request.headers.filter(function(item){
    return (item.name === 'X-Requested-With') && (item.value === 'XMLHttpRequest');
  }).length > 0;
}


/**
 * Panel init.
 *
 * @param jQuery
 */
function setupPanel(jQuery) {
  jQuery('.menu .item').tab();
  setPanelResponse({});
}

/**
 * Pretty print html.
 *
 * @param html
 * @returns {String}
 */
function formatFactory(html) {
  function parse(html, tab = 2) {
    var tab;
    var html = jQuery.parseHTML(html);
    var formatHtml = new String();

    function setTabs () {
      var tabs = new String();

      for (i=0; i < tab; i++){
        tabs += ' ';
      }
      return tabs;
    };

    function trimIt(toTrim) {
      return toTrim ? toTrim.trim() : '';
    }

    jQuery.each( html, function( i, el ) {
      if (el.nodeName == '#text') {
        if (trimIt(jQuery(el).text())) {
          formatHtml += setTabs() + trimIt(jQuery(el).text()) + '\n';
        }
      } else {
        var innerHTML = trimIt(jQuery(el).html());
        jQuery(el).html(innerHTML.replace('\n', '').replace(/ +(?= )/g, ''));


        if (jQuery(el).children().length) {
          jQuery(el).html('\n' + parse(innerHTML, (tab + 1)) + setTabs());
          var outerHTML = trimIt(jQuery(el).prop('outerHTML'));
          formatHtml += setTabs() + outerHTML + '\n';

        } else {
          var outerHTML = trimIt(jQuery(el).prop('outerHTML'));
          formatHtml += setTabs() + outerHTML + '\n';
        }
      }
    });

    return formatHtml;
  };

  return parse(html.replace(/(\r\n|\n|\r)/gm," ").replace(/ +(?= )/g,''));
};
