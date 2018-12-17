import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PortfolioTable from "./PortfolioTable";
import AddStockDialog from "./AddStockDialog";
import PortfolioHeader from "./PortfolioHeader";
import PortfolioFooter from "./PortfolioFooter";
import styles from "./PostfolioStyles";
import {getUSDToEur} from "../Alphavantage";

const debugRows = [
    {name: 'Eclair', value: 262, quantity: 16.0, total: 24},
    {name: 'Eclair2', value: 262, quantity: 16.0, total: 24},
    {name: 'Eclair3', value: 262, quantity: 16.0, total: 24},
    {name: 'Eclair4', value: 262, quantity: 16.0, total: 24},
    {name: 'Eclair5', value: 262, quantity: 16.0, total: 24},
    {name: 'Eclair6', value: 262, quantity: 16.0, total: 24},
];


class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eurosSelected: true,
            totalValue: 0,
            checkedStock: [],
            deleteStockButtonEnabled: false,
            addStockDialogOpen: false,
            rows: debugRows,
            usdToEurRatio: 0,
        };

        this.checkMarkClick = this.checkMarkClick.bind(this);
        this.deleteCheckedStock = this.deleteCheckedStock.bind(this);
        this.addStock = this.addStock.bind(this);
        this.getTotalValue = this.getTotalValue.bind(this);
        this.changeCurrency = this.changeCurrency.bind(this);
        this.reCalculateValues = this.reCalculateValues.bind(this);
    }

    componentDidMount() {
        getUSDToEur().then((response) =>{
            const exchangeRate = JSON.parse(response)["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
            this.setState({usdToEurRatio: exchangeRate}, ()=> {
                this.setState({totalValue: this.getTotalValue()});
                this.reCalculateValues();
            });
        });
    }

    getTotalValue() {
        return this.state.rows.map(stock => stock.total).reduce((a, b) => a + b);
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

    reCalculateValues(){
        const {rows, eurosSelected, usdToEurRatio} = this.state;
        const multiplier = eurosSelected ? usdToEurRatio : 1.0/usdToEurRatio;
        rows.forEach(row => {
            row.value = row.value*multiplier;
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
        //Remove all stocks that are found in the checkedStock-list (e.g. remove all the selected rows)
        const newRows = rows.filter((stock) => !checkedStock.includes(stock.name));
        //Empty selected (since they are deleted) and callback the new total calculation since state-setting is async
        this.setState({rows: newRows, checkedStock: []},
            () => this.setState({totalValue: this.getTotalValue()}))
    }

    addStock(name, amount) {
        const {rows} = this.state;
        if (!rows.map(row => row.name).includes(name)) {
            const newRow = {name: name, value: 5, quantity: amount, total: ""};
            newRow.total = newRow.value * amount;
            rows.push(newRow);
            //Sort the rows by name
            rows.sort((a, b) => a.name.localeCompare(b.name) || a.name.localeCompare(b.name));
            this.setState({addStockDialogOpen: false, totalValue: this.getTotalValue()})
        } else {
            alert("The stock " + name + " already exists!")
        }
    }

    render() {
        const {classes, name} = this.props;
        const {addStockDialogOpen, eurosSelected, totalValue} = this.state;
        return (
            <div className={classes.portfolio}>
                <div style={{textAlign: "right", height: "25px"}}>
                    <IconButton className={classes.deleteButton} aria-label="Delete">
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