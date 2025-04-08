import "./Building.css";

const Building = () => {
  return (
    <div id="construction">
      <h1 className="zagolovki">Будівництво</h1>
      <form>
        <div className="form-group">
          <label htmlFor="construction-type">Виберіть об'єкт для побудови:</label>
          <select name="construction-type" id="construction-type">
            <option value="choice">Вибрати</option>
            <option value="house">Будинок</option>
            <option value="institution">Установа</option>
            <option value="road">Дорога</option>
          </select>
        </div>

        <div className="form-group">
          <label>Виберіть тип:</label>
          <div className="image-options">
            <label>
              <input type="radio" name="workers" value="type1" />
              <img src="/images/road1.png" alt="Тип 1" />
            </label>
            <label>
              <input type="radio" name="workers" value="type2" />
              <img src="/images/road2.png" alt="Тип 2" />
            </label>
            <label>
              <input type="radio" name="workers" value="type3" />
              <img src="/images/road3.png" alt="Тип 3" />
            </label>
            <label>
              <input type="radio" name="workers" value="type4" />
              <img src="/images/road4.png" alt="Тип 4" />
            </label>
            <label>
              <input type="radio" name="workers" value="type5" />
              <img src="/images/road5.png" alt="Тип 5" />
            </label>
            <label>
              <input type="radio" name="workers" value="type6" />
              <img src="/images/road6.png" alt="Тип 6" />
            </label>
            <label>
              <input type="radio" name="workers" value="type7" />
              <img src="/images/road7.png" alt="Тип 7" />
            </label>
            <label>
              <input type="radio" name="workers" value="type8" />
              <img src="/images/road8.png" alt="Тип 8" />
            </label>
            <label>
              <input type="radio" name="workers" value="type9" />
              <img src="/images/road9.png" alt="Тип 9" />
            </label>
            <label>
              <input type="radio" name="workers" value="type10" />
              <img src="/images/road10.png" alt="Тип 10" />
            </label>
            <label>
              <input type="radio" name="workers" value="type11" />
              <img src="/images/road11.png" alt="Тип 11" />
            </label>
            <label>
              <input type="radio" name="workers" value="type12" />
              <img src="/images/road12.png" alt="Тип 12" />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="needresources">Необхідні ресурси:</label>
          <textarea id="needresources" rows="5" readOnly placeholder="Перелік ресурсів"></textarea>
        </div>

        <button type="submit">Додати об'єкт</button>
      </form>
    </div>
  );
};

export default Building;
