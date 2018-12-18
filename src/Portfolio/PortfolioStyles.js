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

export default styles;