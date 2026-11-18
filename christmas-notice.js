/* Christmas delivery copy for the plush store. Local calendar date, no network calls. */
(function (root, factory) {
  var notice = factory();
  if (typeof module === 'object' && module.exports) module.exports = { christmasDeliveryNotice: notice };
  root.christmasDeliveryNotice = notice;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var LAST_ORDER = 'Last order date for Christmas delivery in Australia: 4 December 2026. Cushions ship from overseas and usually take 2 to 4 weeks.';
  var AFTER_CHRISTMAS = 'Orders placed now will arrive after Christmas. Cushions ship from overseas and usually take 2 to 4 weeks.';

  function christmasDeliveryNotice(now) {
    var date = now instanceof Date && !isNaN(now.getTime()) ? now : new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var afterCutoff = year > 2026 || (year === 2026 && month === 11 && day > 4);
    return afterCutoff ? AFTER_CHRISTMAS : LAST_ORDER;
  }

  return christmasDeliveryNotice;
});
