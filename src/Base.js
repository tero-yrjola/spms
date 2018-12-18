import React, {Component} from 'react';
import './App.css';
import Portfolio from "./Portfolio/Portfolio";
import Button from "@material-ui/core/es/Button/Button";
import {getEurToUSD} from "./Alphavantage";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";

class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eurToUsdRatio: 1,
            newPortfolioName: "",
            newPortfolioDialogIsOpen: false,
            portfolios: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.deletePortfolio = this.deletePortfolio.bind(this);
        this.addPortfolioAndCloseDialog = this.addPortfolioAndCloseDialog.bind(this);
    }

    componentDidMount() {
        this.setState({portfolios: Object.keys({...localStorage})});
        getEurToUSD().then((response) => {
            //If the response doesn't have the expected property, an error has been thrown from Alphavantage
            if (JSON.parse(response)["Realtime Currency Exchange Rate"] != null) {
                const exchangeRate = JSON.parse(response)["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
                this.setState({eurToUsdRatio: exchangeRate});
            } else alert("Cannot get EUR-to-USD-ratio! " + JSON.parse(response)["Note"])
        }, (() => alert("Error connecting to Alphavantage!")));
    }

    deletePortfolio(portfolioName) {
        const {portfolios} = this.state;
        if (portfolios.includes(portfolioName)){
            portfolios.splice(portfolios.indexOf(portfolioName), 1);
            localStorage.removeItem(portfolioName);
            this.forceUpdate();
        }
    }

    addPortfolioAndCloseDialog() {
        const {portfolios, newPortfolioName} = this.state;
        if (portfolios.includes(newPortfolioName)) alert("Portfolio " + newPortfolioName + " already exists!");
        else {
            portfolios.push(newPortfolioName);
            localStorage.setItem(newPortfolioName, JSON.stringify([]));
            this.setState({newPortfolioName: "", newPortfolioDialogIsOpen: false});
        }
    }

    handleChange(e) {
        this.setState({newPortfolioName: e.target.value})
    }

    render() {
        const {portfolios, eurToUsdRatio, newPortfolioDialogIsOpen} = this.state;
        return (
            <div className="Base">
                <Button onClick={() => this.setState({newPortfolioDialogIsOpen: true})}>
                    Add new portfolio
                </Button>
                {portfolios.map(portfolio => {
                    return <Portfolio
                        deletePortfolio={(name) => this.deletePortfolio(name)}
                        key={portfolio}
                        name={portfolio}
                        eurToUsdRatio={eurToUsdRatio}
                    />
                })}
                <Dialog open={newPortfolioDialogIsOpen} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add new portfolio</DialogTitle>
                    <DialogContent>
                        <TextField
                            onChange={this.handleChange}
                            autoFocus
                            margin="dense"
                            label="Portfolio name"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({newPortfolioDialogIsOpen: false})} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" onClick={this.addPortfolioAndCloseDialog} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Base;
