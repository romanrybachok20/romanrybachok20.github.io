import React, { useEffect } from "react";
import { useCity } from '../../context/cityContext';
import "./Resources.css";

const Resources = () => {
  const { budget, materials, workers, updateResources } = useCity();

  return (
    <div className="resources">
      <h1 className="zagolovki">Ресурси міста</h1>
      <div id="resources">
        <div className="tables-container">
          <table className="info-table">
            <thead>
              <tr>
                <th>Бюджет міста</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {typeof budget === 'number'
                    ? budget.toLocaleString()
                    : "—"} грн
                </td>
              </tr>
            </tbody>
          </table>

          <table className="materials-table">
            <thead>
              <tr>
                <th>Матеріал</th>
                <th>Кількість (од.)</th>
              </tr>
            </thead>
            <tbody id="materials-table-body">
              {/* Виведення матеріалів, якщо це об'єкт */}
              {materials && Object.entries(materials).map(([name, amount], index) => (
                <tr key={index}>
                  <td>{name}</td>
                  <td>
                    {typeof amount === "number"
                      ? amount.toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="info-table">
            <thead>
              <tr>
                <th>Кількість будівельників</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {typeof workers === 'number'
                    ? workers.toLocaleString()
                    : "—"} осіб
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resources;
