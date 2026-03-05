/**
 * Toolbox tabbed layout: Daily | Your Battle | Church | Family | Deep
 * Each tab shows its drawer. No reloads.
 */
(function () {
  function init() {
    var content = document.getElementById('toolbox-content');
    var tabs = document.querySelectorAll('.toolbox-tab[data-drawer]');
    if (!content || !tabs.length) return;

    var active = (typeof localStorage !== 'undefined' && localStorage.getItem('tdb_toolbox_drawer')) || 'daily';
    content.setAttribute('data-active-drawer', active);
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-drawer') === active);
      t.setAttribute('aria-selected', t.getAttribute('data-drawer') === active ? 'true' : 'false');
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var drawer = tab.getAttribute('data-drawer');
        if (!drawer) return;
        content.setAttribute('data-active-drawer', drawer);
        tabs.forEach(function (t) {
          t.classList.toggle('active', t.getAttribute('data-drawer') === drawer);
          t.setAttribute('aria-selected', t.getAttribute('data-drawer') === drawer ? 'true' : 'false');
        });
        try { localStorage.setItem('tdb_toolbox_drawer', drawer); } catch (e) {}
      });
    });

    var familyArmor = document.getElementById('toolbox-family-armor');
    var addHousehold = document.getElementById('toolbox-add-household');
    if (familyArmor) familyArmor.addEventListener('click', function (e) { e.preventDefault(); var b = document.getElementById('family-armor-stories-btn'); if (b) b.click(); });
    if (addHousehold) addHousehold.addEventListener('click', function (e) { e.preventDefault(); var b = document.getElementById('add-family-btn'); if (b) b.click(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
