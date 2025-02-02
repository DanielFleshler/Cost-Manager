import {useState} from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {Chart} from "react-google-charts";
import "./ReportsAndGraphs.css";
import ReportTable from "./ReportTable.jsx";

function ReportsAndGraphs({costsDB}) {
    // מצב עבור הכפתור (שנה תפריט)
    const [isAnnualReport, setIsAnnualReport] = useState(true);

    // מצב עבור השדות טקסט
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("01");
    const [data, setData] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null); // הודעות שגיאה
    const [dataFiltered,setDataFiltered]=useState([]);


    // פונקציה שמחליפה בין התפריט השנתי לחודשי
    const toggleReportType = () => {
        setIsAnnualReport((prevState) => !prevState);
        // מאפס את השדות כשהכפתור משתנה
        setYear("");
        setMonth("01");
        setData([]);
        setDataFiltered([]);
    };

    // עדכון השדה של השנה
    const handleYearChange = (event) => setYear(event.target.value);

    // עדכון השדה של החודש
    const handleMonthChange = (event) => setMonth(event.target.value);

    // רשימת החודשים
    const months = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
    };

    const handleShowReportButton = async () => {
        if (!year) {
            setAlertMessage("Please fill year field!");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        if (isAnnualReport) {
            const filteredYears = await handleFilterByYears();
            setDataFiltered((filteredYears));
            pieDataFunction(filteredYears);
        } else {
            const filteredMonths = await handleFilterByMonths();
            setDataFiltered((filteredMonths));
            pieDataFunction(filteredMonths);
        }
    };

    const handleFilterByYears = async () => {
        if (!costsDB) {
            console.error("Database is not initialized");
            return [];
        }
        const dataFilterByYear = await costsDB.getAllCosts();
        return dataFilterByYear.filter((cost) => cost.date.substring(0,4)===year); // Return the filtered data for immediate use
    };

    const handleFilterByMonths = async () => {
        const filteredYears = await handleFilterByYears();
        return filteredYears.filter((cost) => cost.date.substring(5, 7) === month);
    };

    const pieDataFunction = (filteredData) => {
        const aggregatedData = filteredData.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {category: item.category, sum: 0};
            }
            acc[item.category].sum += item.sum;
            return acc;
        }, {});
        const chartData = [["Category", "Sum"]].concat(
            Object.values(aggregatedData).map(({category, sum}) => [category, sum])
        );

       // console.log(chartData); // לבדיקה

        setData(chartData);
    };

    const chartOptions = {
        is3D: true,
    };
    return (
        <div className="reportsContainer">
            <div className="form">
                <div className="showReportbutton">
                    <Button color="primary" onClick={toggleReportType}>
                        {isAnnualReport ? "Switch To Monthly Report" : "Switch To Annual Report"}
                    </Button>
                </div>

                {/* הצגת השדות בהתאם למצב הכפתור */}
                <div className="inputFields">
                    <TextField
                        label="year"
                        variant="outlined"
                        value={year}
                        type="number"
                        onChange={handleYearChange}
                        fullWidth
                    />

                    {/* אם במצב "דוחות חודשיים" נוסיף שדה לבחור חודש */}
                    {!isAnnualReport && (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>month</InputLabel>
                            <Select
                                label="month"
                                value={month}
                                onChange={handleMonthChange}
                                labelId="month-select-label"
                                variant="outlined">
                                {Object.keys(months).map((monthName, index) => (
                                    <MenuItem key={index} value={months[monthName]}>
                                        {monthName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </div>
                <div>
                    <Button variant="contained" onClick={handleShowReportButton}>
                        show report
                    </Button>
                </div>
                <div>
                    {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
                </div>
            </div>
            {data.length>=1 && (
                <div className="chartContainer">
                    <Chart
                        chartType="PieChart"
                        data={data}
                        options={chartOptions}
                        width={"587px"}
                        height={"400px"}
                    />
                </div>
            )}
            <div className="reportTable">
                <ReportTable props={dataFiltered}/>
            </div>
        </div>
    );
}

export default ReportsAndGraphs;
