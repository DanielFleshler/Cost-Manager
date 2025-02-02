# Expense Manager

## Overview
Expense Manager is a React-based web application that allows users to track and manage their expenses. The application utilizes IndexedDB for storing and retrieving data locally.

## Features
- **Add Expenses**: Users can add expenses by specifying category, description, amount, and date.
- **View Expenses**: A dynamic table displays all expenses with options for deletion.
- **Reports and Graphs**: Users can generate annual and monthly reports, with data visualization using Google Charts.
- **IndexedDB Storage**: All expense data is stored in the browser using IndexedDB.

## Technologies Used
- **Frontend**: React.js, Material-UI
- **Database**: IndexedDB (via `idb.js` and `idbVanilla.js`)
- **CSS**: Custom styles using CSS and Material-UI
- **Charting**: Google Charts

## File Structure
```
src/
├── components/
│   ├── AddItem.jsx (Component for adding expenses)
│   ├── AddItem.css (Styling for AddItem component)
│   ├── TableContents.jsx (Displays expense table)
│   ├── TableContents.css (Styling for table component)
│   ├── ReportsAndGraphs.jsx (Generates expense reports)
│   ├── ReportsAndGraphs.css (Styling for reports component)
│   ├── ReportTable.jsx (Handles detailed reports per category)
├── App.jsx (Main React component)
├── App.css (Main styling file)
├── idb.js (IndexedDB implementation)
├── idbVanilla.js (Alternative IndexedDB implementation)
├── index.css (Global styles)
├── main.jsx (Entry point of the app)
├── test.html (Test file for IndexedDB functions)
```

## Setup Instructions
### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/expense-manager.git
   cd expense-manager
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Deployment
To build the application for production:
```sh
npm run build
```

## Usage
1. Add expenses using the input form.
2. View added expenses in the table.
3. Generate reports using the reporting section.
4. Delete selected expenses if needed.

## License
This project is licensed under the MIT License.

