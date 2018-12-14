/**
 * Get jQuery object properties of an element.
 *
 * @returns {{__proto__: null}}
 */
var page_getProperties = function() {
  var data = window.jQuery && $0 ? jQuery.data($0) : {};
  // Make a shallow copy with a null prototype, so that sidebar does not
  // expose prototype.
  var props = Object.getOwnPropertyNames(data);
  var copy = { __proto__: null };
  for (var i = 0; i < props.length; ++i)
    copy[props[i]] = data[props[i]];
  return copy;
};

/**
 * Create Side panel
 */
chrome.devtools.panels.elements.createSidebarPane(
  "Atk plugin Properties",
  function(sidebar) {
    function updateElementProperties() {
      sidebar.setExpression("(" + page_getProperties.toString() + ")()");
    }
    updateElementProperties();

    //add an select event listener to the element dev panel.
    //when selection changed, will get new jQuery object properties and display it in side panel.
    chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementProperties);
  });

/**
 * Create a new panel in developper tool window.
 */
chrome.devtools.panels.create("ATK",
  null,
  "atk-panel.html",
  function(panel){
  }
);



