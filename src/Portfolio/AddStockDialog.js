import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from "@material-ui/core/Button"

class AddStockDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stockName: "",
            stockAmount: "",
        }
    }


    //Whenever the dialog closes, clear the state
    componentDidUpdate(prevProps) {
        const {isOpen} = this.props;
        if (isOpen === false && prevProps.isOpen === true) {
            this.clearState();
        }
    }

    nameChange = (event) => {
        this.setState({stockName: event.target.value})
    };

    amountChange = (event) => {
        this.setState({stockAmount: event.target.value})
    };

    clearState = () => {
        this.setState({stockName: "", stockAmount: ""})
    };

    render() {
        const {portfolioName, isOpen, closeDialog, submitStock} = this.props;
        const {stockName, stockAmount} = this.state;
        return (
            <Dialog
                open={isOpen}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Adding stock to portfolio: {portfolioName}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your new stock's name and quantity below:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Stock name"
                        value={stockName}
                        onChange={this.nameChange}
                    />
                    <TextField
                        margin="dense"
                        label="Amount of stock"
                        type="number"
                        value={stockAmount}
                        onChange={this.amountChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => submitStock(stockName, stockAmount)} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddStockDialog;