import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'https://s3.amazonaws.com',
  namespace: 'sdk.streamrail.net/ember-example-app',

  // Safe override to secure the future behavior
  shouldBackgroundReloadRecord() {
    return true;
  },

  // Override to postfix the url with .json
  buildURL() {
    const url = this._super.apply(this, arguments);
    return url + '.json';
  }
});


