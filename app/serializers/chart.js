import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalize(modelClass, resourceHash) {
    if (resourceHash.data) {
      resourceHash.chartData = resourceHash.data;
      delete resourceHash.data;
    }

    return this._super.apply(this, arguments);
  }
});
