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

const rows = [
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
            name: props.name,
            totalValue: "",
            checkedStock: [],
            deleteStockButtonEnabled: false,
            rows: rows,
        };

        this.checkMarkClick = this.checkMarkClick.bind(this);
        this.deleteCheckedStock = this.deleteCheckedStock.bind(this);
        this.addStock = this.addStock.bind(this);
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

    deleteCheckedStock(){
        const {checkedStock, rows} = this.state;
        //Remove all stocks that are found in the checkedStock-list (e.g. remove all the selected rows)
        const newRows = rows.filter((stock) => !checkedStock.includes(stock.name));
        this.setState({rows: newRows, checkedStock: []})
    }

    addStock(){
        //TODO: Use material ui dialog to add stock
    }

    render() {
        const {classes} = this.props;
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
                                <Typography noWrap variant="h6">{this.state.name}</Typography>
                            </Grid>
                            <Grid item xs>
                                <Button variant="contained" color="primary">€</Button>
                            </Grid>
                            <Grid item xs>
                                <Button variant="outlined" color="primary">$</Button>
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
                                <Button variant="contained" onClick={() => this.addStock()}>add stock</Button>
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
            </div>
        );
    }
}

export default withStyles(styles)(Portfolio);