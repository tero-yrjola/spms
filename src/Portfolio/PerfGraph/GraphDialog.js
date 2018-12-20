import React, {Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import PerformanceGraph from "./PerformanceGraph";
import {getLast100PricesFor} from "../../Alphavantage";

class GraphDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stockNamesToDisplay: [],
            stockData: {},
        };
        this.filterButtonClick = this.filterButtonClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isOpen === false && this.props.isOpen === true) {
            const {stockNames} = this.props;
            const {stockData} = this.state;
            let stocksProcessed = 0;
            stockNames.forEach(stockName => {
                getLast100PricesFor(stockName).then(response => {
                    const stock = GraphDialog.parseStockValuesFromAVJSON(response);
                    stocksProcessed++;
                    stockData[stockName] = stock;
                   if(stocksProcessed === stockNames.length){
                       this.setState({stockData: stockData})
                    }
                });
            });
        }
    }

    static parseStockValuesFromAVJSON(alphaVantageJSON) {
        const alphaVantageObject = JSON.parse(alphaVantageJSON);
        const dates = alphaVantageObject["Time Series (Daily)"]
            ? Object.keys(alphaVantageObject["Time Series (Daily)"]) : [];
        return dates.map(date => {
            return {
                date: date,
                value: (
                    parseFloat(alphaVantageObject["Time Series (Daily)"][date]["1. open"]) +
                    parseFloat(alphaVantageObject["Time Series (Daily)"][date]["2. high"]) +
                    parseFloat(alphaVantageObject["Time Series (Daily)"][date]["3. low"]) +
                    parseFloat(alphaVantageObject["Time Series (Daily)"][date]["4. close"])
                    / 4.0).toFixed(2)
            }
        });

    }

    filterButtonClick(clickedStock) {
        const {stockNamesToDisplay} = this.state;
        if (stockNamesToDisplay.includes(clickedStock)) {
            stockNamesToDisplay.splice(stockNamesToDisplay.indexOf(clickedStock), 1);
            this.setState({stockNamesToDisplay});
        } else {
            stockNamesToDisplay.push(clickedStock);
        }
    }

    render() {
        const {portfolioName, isOpen, closeDialog} = this.props;
        const {stockData} = this.state;
        return (
            <Dialog
                open={isOpen}
                aria-labelledby="form-dialog-title"
                maxWidth="lg"
            >
                <DialogTitle id="form-dialog-title">Performance graph of {portfolioName}</DialogTitle>
                <DialogContent>
                    <PerformanceGraph stockData={stockData}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default GraphDialog;