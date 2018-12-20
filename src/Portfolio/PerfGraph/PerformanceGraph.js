import React, {Component} from 'react';
import Plot from 'react-plotly.js';

const colors = ["green", "red","blue"];
class PerformanceGraph extends Component {

    render() {
        const {stockData} = this.props;
        const plotlyData = Object.keys(stockData).map((key, i)=> {
            return {
                x: stockData[key].map(dateValuePair => dateValuePair.date),
                y: stockData[key].map(dateValuePair => parseFloat(dateValuePair.value)),
                type: "scatter",
                mode: "lines+points",
                marker: {color: colors[i%3]},
                name: key,
            }
        });

        return (
            <Plot
                data={plotlyData}
                layout={ {width: "75%", height: "75%"} }
            />
        );
    }
}

export default PerformanceGraph;