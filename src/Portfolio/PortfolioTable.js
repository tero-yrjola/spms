import React, {Component} from 'react';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/es/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";

class PortfolioTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stocks: props.stocks,
        }
    }

    render() {
        const { classes, stocks, checkMarkClick, currencySymbol } = this.props;
        stocks.forEach(row => {
            if (!row.value){
                row.value = 0;
                row.total = 0;
            }
        });
        
        return (
            <Table>
                <colgroup>
                    <col width="10%"/>
                    <col width="15%"/>
                    <col width="25%"/>
                    <col width="25%"/>
                    <col width="25%"/>
                </colgroup>
                <TableHead>
                    <TableRow className={classes.tableHead}>
                        <TableCell className={classes.tableCell}>Select</TableCell>
                        <TableCell className={classes.tableCell}>Name</TableCell>
                        <TableCell className={classes.tableCell}>Unit value</TableCell>
                        <TableCell className={classes.tableCell}>Quantity</TableCell>
                        <TableCell className={classes.tableCell}>Total value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                    {stocks.map(row => {
                        return (
                            <TableRow className={classes.tableRow} key={row.name}>
                                <TableCell className={classes.tableCell}>
                                    <Checkbox className={classes.checkbox} onChange={() => checkMarkClick(row.name)}/>
                                </TableCell>
                                <TableCell className={classes.tableCell}>{row.name}</TableCell>
                                <TableCell className={classes.tableCell}>{parseFloat(row.value).toFixed(2)}{currencySymbol}</TableCell>
                                <TableCell className={classes.tableCell}>{row.quantity}</TableCell>
                                <TableCell className={classes.tableCell}>{row.total.toFixed(2)}{currencySymbol}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

export default PortfolioTable;