import React, {Component} from 'react';
import './App.css';
import Portfolio from "./Portfolio/Portfolio";
import {getEurToUSD} from "./Alphavantage";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Fab from '@material-ui/core/Fab';
import Button from "@material-ui/core/es/Button";

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
        this.cleanLocalStorageFromNonPortfolios = this.cleanLocalStorageFromNonPortfolios.bind(this);
    }

    componentDidMount() {
       this.cleanLocalStorageFromNonPortfolios();
        this.setState({portfolios: Object.keys({...localStorage})});
        getEurToUSD().then((response) => {
            //If the response doesn't have the expected property, an error has been thrown from Alphavantage
            if (JSON.parse(response)["Realtime Currency Exchange Rate"] != null) {
                const exchangeRate = JSON.parse(response)["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
                this.setState({eurToUsdRatio: exchangeRate});
            } else alert("Cannot get EUR-to-USD-ratio! " + JSON.parse(response)["Note"])
        }, (() => alert("Error connecting to Alphavantage!")));
    }

    cleanLocalStorageFromNonPortfolios(){
        const localStoragePortfolios = Object.keys({...localStorage});
        localStoragePortfolios.forEach(portfolioName => {
            const portfolio = JSON.parse(localStorage.getItem(portfolioName));
            if (typeof portfolio !== "object") {
                localStorage.removeItem(portfolioName);
            } else
                portfolio.forEach(stock => {
                    if (!(stock["value"]) || !(stock["total"])){
                        localStorage.removeItem(portfolioName);
                    }
                })
        });
    }

    deletePortfolio(portfolioName) {
        const {portfolios} = this.state;
        if (portfolios.includes(portfolioName)) {
            portfolios.splice(portfolios.indexOf(portfolioName), 1);
            localStorage.removeItem(portfolioName);
            this.forceUpdate();
        }
    }

    addPortfolioAndCloseDialog() {
        const {portfolios, newPortfolioName} = this.state;
        if (portfolios.length >= 10){
            alert("You already have 10 portfolios! Delete some in order to create new ones");
            return;
        }
        if(newPortfolioName.length < 1) return;
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
            <div style={{textAlign: "center"}}>
                <Fab
                    style={{margin: "20px"}}
                    color="primary"
                    aria-label="Add"
                    onClick={() => this.setState({newPortfolioDialogIsOpen: true})}
                    variant="extended"
                >
                    Add new portfolio
                    <AddIcon />
                </Fab>
                <div className="Base">
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
            </div>
        );
    }
}

export default Base;
