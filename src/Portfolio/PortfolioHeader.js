import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

class PortfolioHeader extends Component {
    render() {
        const {classes, name, eurosSelected, changeCurrency} = this.props;

        return (
            <Paper className={classes.portfolioHeader}>
                <Grid container>
                    <Grid item xs={7}>
                        <Typography noWrap variant="h6">{name}</Typography>
                    </Grid>
                    <Grid item xs>
                        <Button
                            onClick={changeCurrency}
                            variant={eurosSelected ? "contained" : "outlined"}
                            value="euro"
                            color="primary">
                            €
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button
                            onClick={changeCurrency}
                            variant={eurosSelected ? "outlined" : "contained"}
                            value="dollar"
                            color="primary">

                            $
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

PortfolioHeader.propTypes = {};

export default PortfolioHeader;