import {useEffect, useState} from "react";
import "./TableContents.css";
import {DataGrid} from "@mui/x-data-grid/DataGrid";
import {Paper} from "@mui/material";
import Button from "@mui/material/Button";

function TableContents({costsDB, refresh}) {
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (!costsDB) {
            return;
        }

        async function fetchData() {
            const getItems = await costsDB.getAllCosts();
            const rowsWithId = getItems.map((item) => ({...item,}));
            setRows(rowsWithId);
        }

        fetchData()
            .then(()=>console.log("Data Fetched Successfully"))
            .catch(()=>console.log("Data Fetch Failed"));
    }, [costsDB, refresh]);

    const columns = [
        {field: 'category', headerName: 'Category', width: 290},
        {field: 'description', headerName: 'Description', width: 290},
        {field: 'sum', headerName: 'Price', width: 200},
        {field: 'date', headerName: 'Purchase Date', width: 290}

    ];
    const paginationModel = {page: 0, pageSize: 5};

    const handleDeleteSelected = async () => {
        if (!costsDB) {
            console.error("Database not initialized");
            return;
        }

        try {
            // מחיקת פריטים מה-DB
            for (const id of selectedRows) {
                await costsDB.deleteCost(id);
            }

            // עדכון המצב של השורות (למנוע את השורות שנמחקו מהטבלה)
            const updatedRows = rows.filter(row => !selectedRows.includes(row.id));
            setRows(updatedRows);

            // מנקה את הרשימה של השורות שנבחרו
            setSelectedRows([]);
        } catch (error) {
            console.error("Error deleting items:", error);
        }
    };

    return (
        <div className="tableContainer">

            <Paper sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => {
                        setSelectedRows(newSelection);
                    }}
                    sx={{border: 0}}
                />
            </Paper>
            <Button
                variant="contained"
                color="error"
                onClick={handleDeleteSelected}
                disabled={selectedRows.length === 0}
            >
                delete marked fields
            </Button>

        </div>
    );
}

export default TableContents;

