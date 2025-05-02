import React, { createContext, useContext, useState, useEffect } from "react";

const RecordContext = createContext();
export const useRecordContext = () => useContext(RecordContext);

export const RecordProvider = ({ children }) => {
  // ✅ Ensure every record from localStorage has a unique ID
  const [records, setRecords] = useState(() => {
    const stored = localStorage.getItem("records");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      // Add missing `id`s
      return parsed.map((record) => ({
        ...record,
        id: record.id ?? Date.now() + Math.random(), // Add unique ID if missing
      }));
    } catch {
      return [];
    }
  });

  // ✅ Add record and make sure it has an `id`
  const addRecord = (record) => {
    const recordWithId = {
      ...record,
      id: record.id ?? Date.now() + Math.random(), // Ensure id
      outletName: "Demo", // ✅ Add outlet name
      createdAt: new Date().toLocaleString(),
    };

    setRecords((prev) => {
      const updated = [...prev, recordWithId];
      localStorage.setItem("records", JSON.stringify(updated)); // Sync to localStorage
      return updated;
    });
  };

  // ✅ Optional: keep in sync if edits/removals are added later
  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  return (
    <RecordContext.Provider value={{ records, addRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
