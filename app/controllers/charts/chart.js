import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['hidden', 'type'],
  hidden: null,
  type: null,

  actions: {
    persistHidden(hiddenSets) {
      this.set('model.hiddenSets', hiddenSets);
      this.set('hidden', hiddenSets.length ? hiddenSets.join(',') : null);
    },

    persistType(type) {
      this.set('model.chartType', type);
      this.set('type', type === 'scatter' ? type : null);
    }
  },

  onTypeChanged: Ember.observer('type', 'model', function () {
    const model = this.get('model'),
      type = this.get('type');
    if (model) {
      model.set('chartType', type === 'scatter' ? type : 'line');
    }
  }),

  onHiddenChanged: Ember.observer('hidden', 'model', function () {
    const model = this.get('model'),
      hidden = this.get('hidden');
    if (model) {
      model.set('hiddenSets', hidden ? hidden.split(',') : []);
    }
  })
});
