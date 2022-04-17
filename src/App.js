import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const rates = {}; //Объект с курсами валютs
//Полученная дата используется для подстановки в API
const getToday = () => { 
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
console.log(getToday());

 GetCurrencies()
 async function GetCurrencies() {
   //Функция получения курса валют
     const response = await fetch(
       `https://www.nbrb.by/api/exrates/rates?ondate=${getToday()}&periodicity=0`
     );
     const result = await response.json();
     const data = result;

     for(let i = 0; i < 27; ++i) {
       let name = data[i].Cur_Abbreviation
       rates[name] = data[i];
     } 
     return rates;
 }

function ExchangeValue() {
  const elementUSD = document.querySelector('[data-value="USD"]');
  const elementEUR = document.querySelector('[data-value="EUR"]');
  const elementRUB = document.querySelector('[data-value="RUB"]');
  const select = document.querySelector("#select");
   elementUSD.textContent = (
     (rates[select.value].Cur_OfficialRate / rates.USD.Cur_OfficialRate) *
     rates.USD.Cur_Scale
   ).toFixed(2);
   elementEUR.textContent = (
     (rates[select.value].Cur_OfficialRate / rates.EUR.Cur_OfficialRate) *
     rates.EUR.Cur_Scale
   ).toFixed(2);
   elementRUB.textContent = (
     (rates[select.value].Cur_OfficialRate / rates.RUB.Cur_OfficialRate) *
     rates.RUB.Cur_Scale
   ).toFixed(2);
}

ConvertValue();
 function ConvertValue() {
   //Функция вычисления и отображения конвертации
   //Элементы формы, ввод суммы, выбор валюты, поле с результатом
   const input = document.querySelector("#input");
   const result = document.querySelector("#result");
   const selectPay = document.querySelector("#selectPay");
   const selectReceive = document.querySelector("#selectReceive");
   const select = document.querySelector("#select");
  //  result.value = (
  //    (parseFloat(input.value) *
  //      (rates[selectPay.value].Cur_OfficialRate /
  //        rates[selectPay.value].Cur_Scale)) /
  //    (rates[selectReceive.value].Cur_OfficialRate /
  //      rates[selectReceive.value].Cur_Scale)
  //  ).toFixed(2);
  result.value = parseFloat(result.value);
  
 }

function App() {
  //Определяем какая вкладка открыта
  const [exchangeOpened, setExchangeOpened] = React.useState(true);
  const [converterOpened, setConverterOpened] = React.useState(false);
  const [calendarValue, onChangeCalendar] = useState(new Date());
  

  return (
    <div className="wrapper">
      <header className="header">
        <ul className="buttonNav">
          <li>
          <button
              className="button"
              onClick={() => (
                setExchangeOpened(true),
                setConverterOpened(false)
                // ,GetCurrencies()
              )}
            >
              Курсы валют
            </button>
          </li>
          <li>
          <button
              className="button"
              onClick={() => (
                setConverterOpened(true),
                setExchangeOpened(false)
                // GetCurrencies()
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
                onInput={ConvertValue}
              />
            </div>
            
          </div>
          <Calendar onChange={onChangeCalendar} value={calendarValue} />
        </div>
      ) : null}

      {exchangeOpened ? (
        <div className="exchange">
          <h1>Курс валют
            <select
              id="select"
              className="form-control"
              disabled="disabled"
              // onInput={ExchangeValue}
            >
             <option value="BYN" defaultValue>
                BYN - Белорусский рубль
              </option>
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
