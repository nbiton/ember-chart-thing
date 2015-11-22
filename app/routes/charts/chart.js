import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('chart', params.chartId);
  },
  setupController(controller, model) {
    controller.set('model', model);
  }
});
