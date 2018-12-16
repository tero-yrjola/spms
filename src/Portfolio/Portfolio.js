import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Card from '@material-ui/core/Card';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button"
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import PortfolioTable from "./PortfolioTable";
import AddStockDialog from "./AddStockDialog";

const styles = theme => ({
    deleteButton: {
        padding: 0,
    },
    portfolio: {
        width: "400px",
        height: "325px",    // Because the div containing the delete button is 25px and the portfolioBase is 300px
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    portfolioBase: {
        height: "300px",
    },
    portfolioHeader: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        marginBottom: "3px",
    },
    portfolioFooter: {
        padding: theme.spacing.unit,
    },
    tableWrapper: {
        height: "175px",
        overflowY: "scroll",
    },
    tableCell: {
        width: "20px",
        padding: "2px",
        textAlign: "center",
    },
    tableHead: {
        backgroundColor: "#fff",
        position: "sticky",
        top: 0
    },
    tableRow: {
        height: "50px",
    },
    checkbox: {
        padding: "8px",
    }
});

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
            totalValue: "",
            checkedStock: [],
            deleteStockButtonEnabled: false,
            addStockDialogOpen: false,
            rows: debugRows,
        };

        this.checkMarkClick = this.checkMarkClick.bind(this);
        this.deleteCheckedStock = this.deleteCheckedStock.bind(this);
        this.addStock = this.addStock.bind(this);
        this.getTotalValue = this.getTotalValue.bind(this);
        this.changeCurrency = this.changeCurrency.bind(this);
    }

    componentDidMount() {
        this.setState({totalValue: this.getTotalValue()})
    }

    getTotalValue() {
        return this.state.rows.map(stock => stock.total).reduce((a, b) => a + b);
    }

    changeCurrency(event) {
        const selectedCurrency = event.currentTarget.value;
        if (selectedCurrency === "euro")
            this.setState({eurosSelected: true});
        else if(selectedCurrency === "dollar"){
            this.setState({eurosSelected: false});
        }
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
            rows.push({name: name, value: 123, quantity: amount, total: amount * 123});
            this.setState({addStockDialogOpen: false, totalValue: this.getTotalValue()})
        } else {
            alert("The stock " + name + " already exists!")
        }
    }

    render() {
        const {classes, name} = this.props;
        const {addStockDialogOpen, eurosSelected} = this.state;
        return (
            <div className={classes.portfolio}>
                <div style={{textAlign: "right", height: "25px"}}>
                    <IconButton className={classes.deleteButton} aria-label="Delete">
                        <DeleteIcon color="secondary"/>
                    </IconButton>
                </div>
                <Card className={classes.portfolioBase}>
                    <Paper className={classes.portfolioHeader}>
                        <Grid container>
                            <Grid item xs={7}>
                                <Typography noWrap variant="h6">{name}</Typography>
                            </Grid>
                            <Grid item xs>
                                <Button
                                    onClick={this.changeCurrency}
                                    variant={eurosSelected ? "contained" : "outlined"}
                                    value="euro"
                                    color="primary">
                                    €
                                </Button>
                            </Grid>
                            <Grid item xs>
                                <Button
                                    onClick={this.changeCurrency}
                                    variant={eurosSelected ? "outlined" : "contained"}
                                    value="dollar"
                                    color="primary">

                                    $
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <div className={classes.tableWrapper}>
                        <PortfolioTable
                            classes={this.props.classes}
                            stocks={this.state.rows}
                            checkMarkClick={this.checkMarkClick}
                        />
                    </div>
                    <Paper className={classes.portfolioFooter}>
                        <Typography variant="caption">Total value of portfolio: {this.state.totalValue}</Typography>
                        <Grid container justify={"space-evenly"}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={() => this.setState({addStockDialogOpen: true})}>
                                    add stock
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained">perf. Graph</Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={!this.state.checkedStock.length > 0}
                                    variant="outlined" color="secondary"
                                    onClick={() => this.deleteCheckedStock()}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
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