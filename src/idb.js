class CostsDB {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("costs")) {
                    const store = db.createObjectStore("costs", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    store.createIndex("itemID", store.keyPath, { unique: false });
                }
            };
        });
    }

    async addCost(costItem) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readwrite");
            const store = transaction.objectStore("costs");

            const request = store.add({
                sum: costItem.sum,
                category: costItem.category,
                description: costItem.description,
                date: costItem.date,
            });

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllCosts() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readonly");
            const store = transaction.objectStore("costs");
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // async getCostsByCategory(category) {
    //     return new Promise((resolve, reject) => {
    //         const transaction = this.db.transaction(["costs"], "readonly");
    //         const store = transaction.objectStore("costs");
    //         const index = store.index("category");
    //         const request = index.getAll(category);
    //
    //         request.onsuccess = () => resolve(request.result);
    //         request.onerror = () => reject(request.error);
    //     });
    // }

    async deleteCost(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readwrite");
            const store = transaction.objectStore("costs");

            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
}
export default CostsDB;



