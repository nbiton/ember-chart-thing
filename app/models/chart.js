import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  chartData: DS.attr(),
  hiddenSets: DS.attr(),
  chartType: DS.attr('string')
});
