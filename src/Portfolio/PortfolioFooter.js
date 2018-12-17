import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

class PortfolioFooter extends Component {
    render() {
        const {
            classes,
            totalValue,
            addStock,
            noCheckedStocks,
            deleteCheckedStock,
            currencySymbol,
        } = this.props;
        return (
            <Paper className={classes.portfolioFooter}>
                <Typography variant="caption">Total value of portfolio: {totalValue.toFixed(2)}{currencySymbol}</Typography>
                <Grid container justify={"space-evenly"}>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={addStock}>
                            add stock
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained">perf. Graph</Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={noCheckedStocks}
                            variant="outlined" color="secondary"
                            onClick={deleteCheckedStock}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default PortfolioFooter;