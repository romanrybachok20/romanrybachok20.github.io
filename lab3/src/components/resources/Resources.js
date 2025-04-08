import "./Resources.css";

const Resources = () => {
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
                        <td><span id="budget"></span> грн</td>
                    </tr>
                </tbody>
            </table>
  
            <table className="materials-table">
                <thead>
                    <tr>
                        <th>Матеріал</th>
                        <th>Кількість (одиниць)</th>
                    </tr>
                </thead>
                <tbody id="materials-table-body">
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
                        <td><span id="workers-count"></span> осіб</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
  );
};

export default Resources;