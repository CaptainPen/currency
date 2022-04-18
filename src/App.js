import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function App() {
  
  //Определяем какая вкладка открыта
  const [exchangeOpened, setExchangeOpened] = React.useState(true);
  const [converterOpened, setConverterOpened] = React.useState(false);
  //Устанавливаем дату с календаря
  const [valuenew, setValue] = React.useState();
  //Текущая дата календаря
  const [calendarValue, onChangeCalendar] = useState(new Date());

  let rates = {}; //Объект с курсами валютs

  async function GetCurrencies () {  //Функция получения курса валют
  try {
    const response = await fetch(`https://www.nbrb.by/api/exrates/rates?ondate=${getToday()}&periodicity=0`); 
    const result = await response.json();
    rates.USD = result.find(item => item.Cur_ID == 431);
    rates.EUR = result.find(item => item.Cur_ID == 451);
    rates.RUB = result.find(item => item.Cur_ID == 456);
    rates.UAH = result.find(item => item.Cur_ID == 449);
    rates.PLN = result.find(item => item.Cur_ID == 452);
    rates.BYN = {Cur_Abbreviation: "BYN", Cur_Scale: 1, Cur_Name: "Белорусский рубль", Cur_OfficialRate: 1} //Добавляем курс BYN
    console.log(result);
    ExchangeValue()
  } catch (error) {
  }
}

function ExchangeValue(){ //Функция вычисления и отображения курса валют
      const elementUSD = document.querySelector('[data-value="USD"]');
      const elementEUR = document.querySelector('[data-value="EUR"]');
      const elementRUB = document.querySelector('[data-value="RUB"]');
      const select = document.querySelector('#select');
      elementUSD.textContent = ((rates[select.value].Cur_OfficialRate / rates.USD.Cur_OfficialRate) * rates.USD.Cur_Scale).toFixed(2);
      elementEUR.textContent = ((rates[select.value].Cur_OfficialRate / rates.EUR.Cur_OfficialRate)* rates.EUR.Cur_Scale).toFixed(2);
      elementRUB.textContent = ((rates[select.value].Cur_OfficialRate / rates.RUB.Cur_OfficialRate) * rates.RUB.Cur_Scale).toFixed(2);
}

 function ConvertValue() { //Функция вычисления и отображения конвертации
       //Элементы формы, ввод суммы, выбор валюты, поле с результатом
       const input = document.querySelector('#input');
       const result = document.querySelector('#result');
       const selectPay = document.querySelector('#selectPay');
       const selectReceive = document.querySelector('#selectReceive'); 
       result.value = ((parseFloat(input.value) * (rates[selectPay.value].Cur_OfficialRate / rates[selectPay.value].Cur_Scale)) / (rates[selectReceive.value].Cur_OfficialRate / rates[selectReceive.value].Cur_Scale)).toFixed(4);
 }

 function Convertinput() { //Функция вычисления и отображения конвертации
      //Элементы формы, ввод суммы, выбор валюты, поле с результатом
      const input = document.querySelector('#input');
      const result = document.querySelector('#result');
      const selectPay = document.querySelector('#selectPay');
      const selectReceive = document.querySelector('#selectReceive'); 
      input.value = (parseFloat(result.value) * rates[selectReceive.value].Cur_OfficialRate / rates[selectReceive.value].Cur_Scale).toFixed(4);
 }
  
  function getToday() { //Функция смены месяца из строки в число, назначение даты для API 
    let arr = String(valuenew).split(' ');
    switch(arr[1]) {
      case 'Jan': 
      arr[1] = 1;
      break;
      case 'Feb': 
      arr[1] = 2;
      break;
      case 'Mar': 
      arr[1] = 3;
      break;
      case 'Apr': 
      arr[1] = 4;
      break;
      case 'May': 
      arr[1] = 5;
      break;
      case 'Jun': 
      arr[1] = 6;
      break;
      case 'Jul': 
      arr[1] = 7;
      break;
      case 'Aug': 
      arr[1] = 8;
      break;
      case 'Sep': 
      arr[1] = 9;
      break;
      case 'Oct': 
      arr[1] = 10;
      break;
      case 'Nov': 
      arr[1] = 11;
      break;
      case 'Dec': 
      arr[1] = 12;
      break;
    }
    return `${arr[3]}-${arr[1]}-${arr[2]}`;
  }

  Render();

  function Render() {
    useEffect(() => {
    GetCurrencies();  
    },);
    return null;
  }

  return (
    <div className="wrapper">
      <header className="header">
        <ul className="buttonNav">
          <li>
            <button
              className="button"
              onClick={() => (
                setExchangeOpened(true),
                setConverterOpened(false),
                GetCurrencies()
              )}
            >
              Курсы валют
            </button>
          </li>
          <li>
            <button
              className="button"
              onClick={() => (
                setConverterOpened(true), setExchangeOpened(false),
                GetCurrencies()
              )}
            >
              Конвентер валют
            </button>
          </li>
        </ul>
      </header>
      <div className="content">
        {converterOpened ? (
          <div className="convert">
            <h1>Конвертер валют на {getToday()}</h1>
            <div className="form">
              <div className="col">
                <label htmlFor="name">Отдаю:</label>
                <select
                  className="form-control"
                  id="selectPay"
                  disabled="disabled"
                  onInput={ConvertValue}
                >
                  <option value="BYN" defaultValue>
                    BYN - Белорусский рубль
                  </option>
                </select>
                <input
                  id="input"
                  type="number"
                  className="form-control"
                  autoFocus
                  onInput={ConvertValue}
                />
              </div>
              <div className="col">
                <label htmlFor="name">Получаю:</label>
                <select
                  id="selectReceive"
                  className="form-control"
                  onInput={ConvertValue}
                >
                  <option value="USD" defaultValue>
                    USD - Доллар США
                  </option>
                  <option value="BYN">BYN - Белорусский рубль</option>
                  <option value="EUR">EUR - Евро</option>
                  <option value="RUB">RUB - Рубль</option>
                  <option value="UAH">UAH - Гривен</option>
                  <option value="PLN">PLN - Злотых</option>
                </select>
                <input
                  id="result"
                  type="number"
                  className="form-control"
                  autoFocus
                  onInput={Convertinput}
                />
              </div>
            </div>

            <Calendar onClickDay={(value) => (setValue(value), getToday())} value={calendarValue} />
          </div>
        ) : null}

        {exchangeOpened ? (
          <div className="exchange">
            <h1>
              Курс валют
              <select
                id="select"
                className="form-control"
                onInput={ExchangeValue}
              >
                <option value="BYN">BYN - Белорусский рубль</option>
                <option value="EUR">EUR - Евро</option>
                <option value="RUB">RUB - Рубль</option>
                <option value="UAH">UAH - Гривен</option>
                <option value="PLN">PLN - Злотых</option>
              </select>
            </h1>

            <div className="blocks">
              <div className="courses">
                <div className="itemTitle">Курс USD</div>
                <div className="itemValue" data-value="USD">
                  --USD
                </div>
              </div>
              <div className="courses">
                <div className="itemTitle">Курс EUR</div>
                <div className="itemValue" data-value="EUR">
                  --EUR
                </div>
              </div>
              <div className="courses">
                <div className="itemTitle">Курс RUB</div>
                <div className="itemValue" data-value="RUB">
                  --RUB
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
