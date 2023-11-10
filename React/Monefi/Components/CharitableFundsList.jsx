import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import CharityFundsCardTemplate from "./CharitableFundsCardTemplate";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./charitableFunds.css";
import charitabelFundsService from "services/charitableFundsService";
import locale from "rc-pagination/lib/locale/en_US";
import { Link } from "react-router-dom";

const _logger = debug.extend("CharitablefundsList");
function CharitableFundsList() {
  const [pageData, setPageData] = useState({
    arrayOfCharitableFunds: [],
    arrayOfCharityFundsComponents: [],
    current: 1,
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const mapCharityFunds = (aFund) => {
    _logger("CharitableFund:", aFund.id);
    return (
      <CharityFundsCardTemplate fund={aFund} key={"CharityCard:" + aFund.id} />
    );
  };

  useEffect(() => {
    charitabelFundsService
      .getAllCharitableFunds(pageData.pageIndex, pageData.pageSize)
      .then(onGetCharitySuccess)
      .catch(onGetCharityError);
  }, [pageData.pageIndex]);

  const onGetCharitySuccess = (data) => {
    _logger("Charity:", data);
    let newCharityArray = data.item.pagedItems;
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.totalCount = data.item.totalCount;
      newState.arrayOfCharitableFunds = newCharityArray;
      newState.arrayOfCharityFundsComponents =
        newCharityArray.map(mapCharityFunds);
      return newState;
    });
  };

  const onGetCharityError = (err) => {
    _logger(err, "Get Charity Error");
  };

  const onPageChange = (page) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.current = page;
      newState.pageIndex = page - 1;
      return newState;
    });
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-6">
          <h2 className="charitable_header">Charitable Funds</h2>
        </div>
        <div className="col-6">
          <Link
            className="submit-button charitable-add-Button"
            variant="primary"
            to="/charitablefunds/add"
            type="button"
          >
            Add Charitable Fund
          </Link>
        </div>
      </div>

      <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-sm-3">
        {pageData.arrayOfCharityFundsComponents}
      </div>
      <div className="pb-3 pt-3 text-center">
        <Pagination
          onChange={onPageChange}
          current={pageData.pageIndex + 1}
          total={pageData.totalCount}
          pagesize={pageData.pageSize}
          locale={locale}
          showTotal={(total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total}`
          }
        />
      </div>
    </React.Fragment>
  );
}

export default CharitableFundsList;
