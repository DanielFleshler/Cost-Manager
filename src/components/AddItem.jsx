import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import "./AddItem.css";

function AddItem({ costsDB, onItemAdded }) {
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const [date, setDate] = useState(today);
    const [alertMessage, setAlertMessage] = useState(null); // הודעות שגיאה
    const [successMessage, setSuccessMessage] = useState(null); // הודעת הצלחה

    const clearAlert = (setter) => {
        setTimeout(() => setter(null), 3000);
    };

    const validateInput = () => {
        const fields = { category, description, price };

        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                setAlertMessage(`Please fill in the ${key}`);
                clearAlert(setAlertMessage);
                throw new Error("Missing fields");
            }
        }
    };

    const handleAddItem = async () => {
        if (!costsDB) {
            console.error("Database is not initialized");
            return;
        }

        const costItem = {
            sum: parseFloat(price),
            category: category.toUpperCase(),
            description: description.toLowerCase(),
            date,
        };

        try {
            validateInput();
            await costsDB.addCost(costItem);

            // ניקוי השדות לאחר הוספה
            setCategory("");
            setDescription("");
            setPrice("");
            setDate(today);

            onItemAdded();

            // הצגת הודעת הצלחה
            setSuccessMessage("Item added successfully!");
            clearAlert(setSuccessMessage);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    return (
        <div className="addItemContainer">
            <div className="textField">
                <TextField
                    id="category"
                    label="Category:"
                    variant="outlined"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <TextField
                    id="description"
                    label="Product Description:"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    id="price"
                    label="Price:"
                    variant="outlined"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                    id="date"
                    type="date"
                    variant="outlined"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="buttonContainer">
                <Button variant="contained" endIcon={<AddIcon />} onClick={handleAddItem}>
                    Add Item
                </Button>
            </div>

            {/* הודעות התראה */}
            {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </div>
    );
}

export default AddItem;
