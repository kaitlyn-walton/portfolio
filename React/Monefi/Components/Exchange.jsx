import React, { memo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Row, Card, Table, Container } from "react-bootstrap";
import transferWiseService from "services/transferWiseService";
import logger from "sabio-debug";
import cc from "currency-codes/data";
import "currency-flags/dist/currency-flags.min.css";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link } from "react-router-dom";
import "../transferwise.css";

function Exchange() {
  const _logger = logger.extend("Exchange");

  const [currencyData, setCurrencyData] = useState({
    arrayOfStaticData: [],
    arrayOfCurrentRates: [],
    mappedCurrentCurrencies: [],
  });

  const [historicalCurrencyData, setHistoricalCurrencyData] = useState({
    arrayOfHistoricalRates: [],
    arrayOfAllData: [],
    mappedRates: [],
  });

  useEffect(() => {
    transferWiseService
      .getExchangeRates("EUR,JPY,GBP,AUD,CAD,CHF,HKD,NZD")
      .then(onGetExchangeRateSuccess)
      .catch(onGetExchangeRateError);
  }, []);

  useEffect(() => {
    transferWiseService
      .getHistoricalExchangeRates(
        setPreviousDate(),
        "EUR,JPY,GBP,AUD,CAD,CHF,HKD,NZD"
      )
      .then(onGetHistoricalRateSuccess)
      .catch(onGetHistoricalRateError);
  }, [currencyData]);

  const setPreviousDate = () => {
    let date = new Date();
    const yesterday = date.getDate() - 1;
    const DD = yesterday < 10 ? `0${yesterday}` : yesterday;
    const MM = date.getMonth() + 1;
    const YYYY = date.getFullYear();

    return `${YYYY}-${MM}-${DD}`;
  };

  const onGetExchangeRateSuccess = (response) => {
    let allRates = response.item.rates;

    const mappedRates = Object.keys(allRates).map((key) => {
      let newArray = {
        exchangeCode: key,
        exchangeValue: allRates[key],
      };
      return newArray;
    });

    setCurrencyData((prevState) => {
      const cd = { ...prevState };
      cd.arrayOfCurrentRates = mappedRates;
      cd.arrayOfStaticData = cc;

      if (mappedRates.length > cc.length) {
        cd.mappedCurrentCurrencies = cc.map((item) => {
          let findCommonCurrencies = mappedRates.find(
            (data) => data.exchangeCode === item.code
          );
          let mergedObj = {
            currencyData: item,
            currentExchangeRate: findCommonCurrencies,
          };
          return mergedObj;
        });
      } else {
        cd.mappedCurrentCurrencies = mappedRates.map((item) => {
          let findCommonCurrencies = cc.find(
            (data) => data.code === item.exchangeCode
          );
          let mergedObj = {
            currencyData: findCommonCurrencies,
            currentExchangeRate: item,
          };
          return mergedObj;
        });
      }
      _logger(cd, "new exchange data state");
      return cd;
    });
  };

  const onGetExchangeRateError = (error) => {
    _logger(error);
  };

  const onGetHistoricalRateSuccess = (response) => {
    let historicalRates = response.item.rates;

    let mappedHistoricalRates = Object.keys(historicalRates).map((key) => {
      let newArray = {
        historicalExchangeCode: key,
        historicalExchangeValue: historicalRates[key],
      };
      return newArray;
    });

    let allData = currencyData.mappedCurrentCurrencies.map((item) => {
      let common = mappedHistoricalRates.find(
        (data) => item.currencyData.code === data.historicalExchangeCode
      );

      const rateChange = () => {
        let current = item.currentExchangeRate.exchangeValue;
        let prev = common.historicalExchangeValue;
        let difference = ((current - prev) / prev) * 100;
        let roundedTotal = difference.toFixed(3);
        let convertTotal = Number(roundedTotal);
        return convertTotal;
      };

      let combined = {
        currencyData: item.currencyData,
        currentExchangeRate: item.currentExchangeRate.exchangeValue,
        previousDayExchangeRate: common.historicalExchangeValue,
        rateChangePercentage: rateChange(),
      };

      return combined;
    });

    setHistoricalCurrencyData((prevState) => {
      const ps = { ...prevState };
      ps.arrayOfHistoricalRates = mappedHistoricalRates;
      ps.arrayOfAllData = allData;
      ps.mappedRates = allData.map(mapAllInfo);
      _logger(ps, "new historical data state");
      return ps;
    });
  };

  const onGetHistoricalRateError = (error) => {
    _logger(error);
  };

  const mapAllInfo = (info) => {
    let currencyName = info.currencyData.currency;
    let currencyCode = info.currencyData.code;
    let roundedAmount = info.currentExchangeRate.toFixed(2);
    let symbol = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: `${currencyCode}`,
    }).format(roundedAmount);

    let sparklineData = [0, info.rateChangePercentage];
    let sparklineColor = info.rateChangePercentage > 0 ? "green" : "red";

    return (
      <tr key={currencyCode}>
        <td>
          <div className="row">
            <div
              className={`col-auto currency-flag currency-flag-xl currency-flag-${currencyCode.toLowerCase()}`}
            />
            <div className="col-auto">{currencyName}</div>
          </div>
        </td>
        <td>{symbol}</td>
        <td>{info.rateChangePercentage}%</td>
        <td>
          <Sparklines data={sparklineData} style={{ height: 40 }}>
            <SparklinesLine
              style={{
                stroke: sparklineColor,
                fill: "none",
              }}
            />
          </Sparklines>
        </td>
        <td>
          <div className="btn transferwise-gradient-button">
            <Link
              to="/transfers/quotes"
              state={info.currencyData}
              type="button"
              className="fw-semibold link-light"
            >
              Send
            </Link>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <React.Fragment>
        <Container>
          <Row>
            <Card className="table-responsive">
              <p className="fw-bold fs-1 monefi-text-color mb-6 text-center">
                MoneFi Live Exchange Rates
              </p>
              <Card.Body>
                <Table className="goal-table ">
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>Amounts</th>
                      <th>Change(24h)</th>
                      <th>Chart(24h)</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="row">
                          <div className="col-3 currency-flag currency-flag-xl currency-flag-usd" />
                          <div className="col-6">US Dollar</div>
                        </div>
                      </td>
                      <td>$1.00</td>
                      <td />
                      <td />
                      <td />
                    </tr>
                    {historicalCurrencyData.mappedRates}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </React.Fragment>
    </>
  );
}

export default memo(Exchange);
