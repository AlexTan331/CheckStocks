import React, { Fragment } from "react";
import { fetchPageNumbers, LEFT_PAGE, RIGHT_PAGE } from "../lib/pagination";

export default function Pagination(props) {
  const {
    handleClick = () => {},
    handleMoveLeft = () => {},
    handleMoveRight = () => {},
    totalRecords = null,
    totalPages = null,
    currentPage = null,
  } = props;

  /**
   * Let's say we have 10 pages and we set pageNeighbours to 2
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */

  if (!totalRecords || totalPages === 1) return null;

  const pageBlocks = fetchPageNumbers({ totalPages, currentPage });

  return (
    <Fragment>
      <nav aria-label="Pagination">
        <ul className="pagination">
          {pageBlocks.map((page, index) => {
            if (page === LEFT_PAGE)
              return (
                <li key={index} className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    aria-label="Previous"
                    onClick={(e) => handleMoveLeft(e)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
              );

            if (page === RIGHT_PAGE)
              return (
                <li key={index} className="page-item">
                  <a
                    className="page-link"
                    href="#"
                    aria-label="Next"
                    onClick={(e) => handleMoveRight(e)}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              );

            return (
              <li
                key={index}
                className={`page-item${currentPage === page ? " active" : ""}`}
              >
                <a className="page-link" href="#" onClick={handleClick(page)}>
                  {page}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </Fragment>
  );
}
