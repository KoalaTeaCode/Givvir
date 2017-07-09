function parseDate(input) {
  var parts = input.split('-');
  return new Date(parts[2], parts[1]-1, parts[0]);
}

function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
      if (a[i] === obj) {
          return true;
      }
  }
  return false;
}

phonecatApp.filter("dataRangeFilter", function() {
  return function(items, from, to) {
        var df = parseDate(from);
        var dt = parseDate(to);
        var result = [];

        if (!items) return;
        for (var i=0; i<items.length; i++){
            // var tf = new Date(items[i].date1 * 1000),
            //     tt = new Date(items[i].date2 * 1000);
            var date = new Date(items[i].date);
            if (date > df && date < dt)  {
                result.push(items[i]);
            }
        }
        return result;
  };
});

phonecatApp.filter("articleFilter", function() {
  return function(items, filters) {
    var itemsToReturn = [];
    var df = parseDate(filters.date1);
    var dt = parseDate(filters.date2);

    angular.forEach(items, function (value, key) {
      var item = value;
      var date = new Date(item.date);

      if ( (!filters.filterTerm) && (date > df && date < dt) ) {
        itemsToReturn.push(value);
      }

      if ( (date > df && date < dt) && (filters.filterTerm) ) {
        if (item[filters.filterTerm].length > 0){
          if ( contains(item[filters.filterTerm], filters[filters.filterTerm]) ) {
            itemsToReturn.push(value);
          }
        }
      }
    });
    return itemsToReturn;
  };
});
