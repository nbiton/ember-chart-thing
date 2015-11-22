import Ember from 'ember';
import d3 from 'npm:d3';
import nv from 'npm:nvd3';

// Gets a color by index
const getColor = (() => {
  const colors = [
    'FF0000',
    '00FF00',
    '0000FF',
    'FF00FF',
    '00FFFF',
    'FFFF00'
  ];
  return index => colors[index];
})();


export default Ember.Component.extend({

  // Used to initialize chart base
  didInsertElement () {

    // Creating the base svg element
    const elementId = this.get('elementId');
    const chartBaseEl = d3.select('#' + elementId)
      .select('.chart-vis-container')
      .append('svg');

    this.set('chartBaseEl', chartBaseEl);

    nv.addGraph(() => {
      const chart = nv.models.lineChart()
        .options({
          duration: 700,
          useInteractiveGuideline: true
        })
        .margin({left: 50, right: 50})
        .showLegend(true)
        .showYAxis(true)
        .showXAxis(true);

      //Update the chart when window resizes.
      nv.utils.windowResize(() => chart.update());

      this.set('nvd3Chart', chart);
      return chart;
    });
  },

  formattedData: Ember.computed('chartModel', 'chartModel.chartData', 'chartModel.hiddenSets',  function () {
    const chartData = this.get('chartModel.chartData'),
      model = this.get('chartModel');

    if (! model || ! chartData) {
      return null;
    }

    return chartData.slice(1).map((dataArr, index) => ({
      key: dataArr[0],
      values: dataArr.slice(1).map((value, ind) => ({x: ind, y: value})),
      color: '#' + getColor(index),
      checked: !isHidden(dataArr[0], model)
    }));
  }),

  xLabels: Ember.computed('chartModel.chartData', function () {
    const chartData = this.get('chartModel.chartData');
    if (! chartData) {
      return null;
    }
    return chartData[0].slice(1);
  }),

  // Inits the switch, and monitors its changes to notify
  isScatter: Ember.computed('chartModel.chartType', {
    get() {
      return this.get('chartModel.chartType') === 'scatter';
    },
    set(key, value) {
      const currType = value ? 'scatter' : 'line';
      this.sendAction('typeUpdated', currType);
      return value;
    }
  }),

  // Monitors the checkboxes and notifies the controller
  onChecked: Ember.observer('formattedData.@each.checked', function() {
    const formattedData = this.get('formattedData');

    if (! formattedData) {
      return;
    }
    const hidden = formattedData.reduce((all, curr) =>{
      if(! curr.checked) {
        all.push(curr.key);
      }
      return all;
    }, []);
    this.sendAction('hiddenUpdated', hidden);
  }),

  injectChartData: Ember.observer('xLabels', 'formattedData', 'chartModel.chartType', function () {
    const chartBaseEl = this.get('chartBaseEl'),
      nvd3Chart = this.get('nvd3Chart'),
      xLabels = this.get('xLabels'),
      formattedData =  this.get('formattedData'),
      model = this.get('chartModel');

    if (! xLabels || ! formattedData) {
      return;
    }

    // Set the x axis labels
    nvd3Chart.xAxis
      .axisLabel('Date')
      .tickFormat(d => xLabels[d]);

    // Inject the non-hidden data sets into the main chart element, and activate nvd3
    chartBaseEl
      .datum(formattedData.filter(d => ! isHidden(d.key, model)))
      .call(nvd3Chart);

    // Hide/show the chart line
    d3
      .selectAll('path.nv-line')
      .transition(750)
      .attr('opacity', model.get('chartType') === 'scatter' ? 0 : 1);

    nvd3Chart.update();
  })
});

function isHidden(setName, model) {
  const hiddenSets = model.get('hiddenSets');
  return hiddenSets ? hiddenSets.indexOf(setName) !== -1 : false;
}
