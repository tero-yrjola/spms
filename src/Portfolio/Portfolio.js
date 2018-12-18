import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PortfolioTable from "./PortfolioTable";
import AddStockDialog from "./AddStockDialog";
import PortfolioHeader from "./PortfolioHeader";
import PortfolioFooter from "./PortfolioFooter";
import styles from "./PortfolioStyles";
import {getUSDPriceFor} from "../Alphavantage";

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eurosSelected: true,
            totalValue: 0,
            checkedStock: [],
            deleteStockButtonEnabled: false,
            addStockDialogOpen: false,
            rows: [],
        };

        Portfolio.parseStockValueFromAAJSON = Portfolio.parseStockValueFromAAJSON.bind(this);
        this.checkMarkClick = this.checkMarkClick.bind(this);
        this.deleteCheckedStock = this.deleteCheckedStock.bind(this);
        this.addStock = this.addStock.bind(this);
        this.getTotalValue = this.getTotalValue.bind(this);
        this.changeCurrency = this.changeCurrency.bind(this);
        this.reCalculateValues = this.reCalculateValues.bind(this);
        this.calculateStockAndTotalValues = this.calculateStockAndTotalValues.bind(this);
        this.setRealTimeValueAndTotal = this.setRealTimeValueAndTotal.bind(this);
    }

    componentDidMount() {
        const {name} = this.props;
        this.setState({rows: JSON.parse(localStorage.getItem(name))}, () => {
            this.setState({totalValue: this.getTotalValue()});
        })
    }

    static parseStockValueFromAAJSON(alphaVantageJSON){
        const alphaVantageObject = JSON.parse(alphaVantageJSON);
        const latestTimeOfValue = Object.keys(alphaVantageObject["Time Series (5min)"])[0];
        return (
                    parseFloat(alphaVantageObject["Time Series (5min)"][latestTimeOfValue]["1. open"]) +
                    parseFloat(alphaVantageObject["Time Series (5min)"][latestTimeOfValue]["2. high"]) +
                    parseFloat(alphaVantageObject["Time Series (5min)"][latestTimeOfValue]["3. low"]) +
                    parseFloat(alphaVantageObject["Time Series (5min)"][latestTimeOfValue]["4. close"])
                ) / 4.0
    }

    getTotalValue() {
        if (this.state.rows.length === 0) return 0;
        return this.state.rows.map(stock => stock.total).reduce((a, b) => a + b);
    }

    /* For each row, fetch the 'currency to usd' -ratio from Alphavantage. If the API-limit (5 per 1 minute) is reached,
       we use a default value of 5 (just for demo-purposes). This ratio is the value of the stock in usd.
       Then after all rows are processed, in reCalculateValues() we calculate the total value for each row and totally.
       Then if we need the eur-total, we multiply it again by eurToUsdRatio. */
    calculateStockAndTotalValues() {
        const {rows} = this.state;
        let rowsProcessed = 0;
        rows.forEach(row => {
            this.setRealTimeValueAndTotal(row).then(() => {
                rowsProcessed++;
                if (rowsProcessed === rows.length) {
                    this.setState({totalValue: this.getTotalValue()});
                    this.reCalculateValues();
                }
            });
        });
    }

    setRealTimeValueAndTotal(stockRow) {
        return getUSDPriceFor(stockRow.name).then((response) => {
            const resp = JSON.parse(response);
            if (resp["Note"] || resp["Error Message"]) {
                alert("Price for " + stockRow.name + " not found or reached API-call-limit! Using a spoofed value of 10$.");
                stockRow.value = 10;
                stockRow.total = stockRow.value * stockRow.quantity
            } else {
                stockRow.value = Portfolio.parseStockValueFromAAJSON(response);
                stockRow.total = stockRow.value * stockRow.quantity
            }
        });
    }

    changeCurrency(event) {
        const {eurosSelected} = this.state;
        const selectedCurrency = event.currentTarget.value;
        if (selectedCurrency === "euro" && !eurosSelected)
            this.setState({eurosSelected: true}, () => {
                this.reCalculateValues();
            });
        else if (selectedCurrency === "dollar" && eurosSelected) {
            this.setState({eurosSelected: false}, () => {
                this.reCalculateValues();
            });
        }
    }

    reCalculateValues() {
        const {rows, eurosSelected} = this.state;
        const {eurToUsdRatio} = this.props;
        const multiplier = eurosSelected ? 1.0/ eurToUsdRatio : eurToUsdRatio;
        rows.forEach(row => {
            row.value = row.value * multiplier;
            row.total = row.value * row.quantity;
        });
        this.setState({totalValue: this.getTotalValue()});
    }

    checkMarkClick(key) {
        const {checkedStock} = this.state;
        //If the checked stock already contains the key, then delete it. Otherwise add it to the state.
        if (checkedStock.indexOf(key) > -1) this.setState({checkedStock: checkedStock.filter(s => s !== key)});
        else {
            checkedStock.push(key);
            this.setState({checkedStock: checkedStock})
        }
    }

    deleteCheckedStock() {
        const {checkedStock, rows} = this.state;
        const {name} = this.props;
        //Remove all stocks that are found in the checkedStock-list (e.g. remove all the selected rows)
        const newRows = rows.filter((stock) => !checkedStock.includes(stock.name));
        //Empty selected (since they are deleted) and callback the new total calculation since state-setting is async
        this.setState({rows: newRows, checkedStock: []},
            () => this.setState({totalValue: this.getTotalValue()}))
        localStorage.setItem(name, JSON.stringify(newRows))
    }

    addStock(name, amount) {
        const {rows} = this.state;
        const {name: portfolioName} = this.props;
        if (!rows.map(row => row.name).includes(name)) {
            const newRow = {name: name, quantity: amount};
            rows.push(newRow);
            this.setRealTimeValueAndTotal(newRow).then(() => {
                //Sort the rows by name
                rows.sort((a, b) => a.name.localeCompare(b.name) || a.name.localeCompare(b.name));
                this.setState({addStockDialogOpen: false, totalValue: this.getTotalValue()})
                localStorage.setItem(portfolioName, JSON.stringify(rows));
            });
        } else {
            alert("The stock " + name + " already exists!")
        }
    }

    render() {
        const {classes, name, deletePortfolio} = this.props;
        const {addStockDialogOpen, eurosSelected, totalValue} = this.state;
        return (
            <div className={classes.portfolio}>
                <div style={{textAlign: "right", height: "25px"}}>
                    <IconButton onClick={() => deletePortfolio(name)} className={classes.deleteButton} aria-label="Delete">
                        <DeleteIcon color="secondary"/>
                    </IconButton>
                </div>
                <Card className={classes.portfolioBase}>
                    <PortfolioHeader
                        classes={classes}
                        name={name}
                        eurosSelected={eurosSelected}
                        changeCurrency={this.changeCurrency}
                    />
                    <div className={classes.tableWrapper}>
                        <PortfolioTable
                            classes={classes}
                            stocks={this.state.rows}
                            checkMarkClick={this.checkMarkClick}
                            currencySymbol={eurosSelected ? "€" : "$"}
                        />
                    </div>
                    <PortfolioFooter
                        classes={classes}
                        totalValue={totalValue}
                        noCheckedStocks={!this.state.checkedStock.length > 0}
                        deleteCheckedStock={this.deleteCheckedStock}
                        addStock={() => this.setState({addStockDialogOpen: true})}
                        currencySymbol={eurosSelected ? "€" : "$"}
                    />
                </Card>
                <AddStockDialog
                    portfolioName={name}
                    isOpen={addStockDialogOpen}
                    closeDialog={() => this.setState({addStockDialogOpen: false})}
                    submitStock={this.addStock}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Portfolio);