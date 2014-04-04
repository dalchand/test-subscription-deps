Data = new Meteor.Collection("data");
if (Meteor.isClient) {

  var filters = {
    types: ["photo"]
  };
  var filtersDep = new Deps.Dependency;

  Template.hello.data = function () {
    return Data.find();
  };

  Template.hello.created = function() {
    Deps.autorun(function(){
      var filters = getFilters();
      Meteor.subscribe("data", filters);
    });
  }

  getFilters = function() {
    filtersDep.depend();
    return filters;
  }

  setTypes = function(t) {
    filters.types = t;
    filtersDep.changed();
  }
}

if (Meteor.isServer) {

  Meteor.publish("data", function(filters) {
    return Data.find({type: {$in : filters.types}});
  })

  Meteor.startup(function () {
    if(!Data.findOne()) {
      var types = ["photo", "video", "audio"];
      for(var i = 0; i < 100; i++) {
        var index = i % 3;
        Data.insert({type: types[index], name: "This is a " + types[index]});
      }
    }
  });
}
