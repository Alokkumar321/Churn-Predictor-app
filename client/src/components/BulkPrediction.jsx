import React, { useState } from 'react';

const BulkPrediction = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch('http://127.0.0.1:5000/predict-bulk', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error === 'ColumnMismatch') {
          alert("⚠️ Column mismatch detected! Please download the sample CSV file for correct formatting.");
        } else {
          alert("❌ Upload failed: " + (result.message || "Please download the sample CSV file for correct formatting."));
        }
        return;
      }

      setPreview(result.preview);
      setDownloadUrl(result.download_url);
      setSortConfig({ key: null, direction: null });
      alert("✅ Bulk prediction successful!");
    } catch (err) {
      console.error(err);
      alert("❌ Error uploading file. Please try again.");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    window.open(`http://127.0.0.1:5000${downloadUrl}`, '_blank');
  };

  const handleSort = (column) => {
    let direction = 'ascending';
    if (sortConfig.key === column && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key: column, direction });

    const sorted = [...preview].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'ascending' ? aVal - bVal : bVal - aVal;
      } else {
        return direction === 'ascending'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      }
    });

    setPreview(sorted);
  };

  const renderTable = () => {
    if (preview.length === 0) return null;
    const headers = Object.keys(preview[0]);

    const getArrow = (header) => {
      if (sortConfig.key === header) {
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
      }
      return '';
    };

    return (
      <div className="mt-8 overflow-auto rounded-xl shadow-lg border border-gray-300 max-h-[500px] w-full">
        <table className="min-w-full text-sm text-left text-gray-800 bg-white border-separate border-spacing-0">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-5 py-3 font-semibold border-b border-gray-300 text-gray-700 whitespace-nowrap bg-gray-200 sticky top-0 cursor-pointer hover:bg-blue-100"
                >
                  {header.replace(/_/g, ' ')}{getArrow(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition duration-150`}
              >
                {headers.map((col) => (
                  <td
                    key={col}
                    className={`px-5 py-2 border-b border-gray-200 text-sm ${
                      col === 'Churn_Predicted'
                        ? row[col] === 'Yes'
                          ? 'text-red-600 font-semibold'
                          : 'text-green-600 font-semibold'
                        : ''
                    }`}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold mb-6">📊 Bulk Upload Churn Prediction</h2>

      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 w-full">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-3 py-2 w-64"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-64 sm:w-auto"
        >
          Upload and Predict
        </button>
        {downloadUrl && (
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-64 sm:w-auto"
          >
            ⬇ Download CSV
          </button>
        )}
        {/* ✅ Optional Sample CSV Download */}
        <a
          href="/sample.csv"
          download
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-64 sm:w-auto text-center"
        >
          📄 Download Sample CSV
        </a>
      </div>

      {preview.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl font-semibold mt-8 mb-2 text-left">🧾 Preview (Top 10 Rows)</h3>
          {renderTable()}
        </div>
      )}
    </div>
  );
};

export default BulkPrediction;
