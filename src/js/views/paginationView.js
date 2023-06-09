import View from './View';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  // _wrapper = document.querySelector('.wrapper');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `${this._generateCurrentPage()}${this._generateMarkupButton(
        'next'
      )}`;
      //   return `<button class="btn--inline pagination__btn--next">
      //   <span>Page ${curPage + 1}</span>
      //   <svg class="search__icon">
      //     <use href="${icons}#icon-arrow-right"></use>
      //   </svg>
      // </button>`;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `${this._generateCurrentPage()}${this._generateMarkupButton(
        'prev'
      )}
        `;
    }
    // return ;
    // <button class="btn--inline pagination__btn--prev">
    //       <svg class="search__icon">
    //         <use href="${icons}#icon-arrow-left"></use>
    //       </svg>
    //       <span>Page ${curPage - 1}</span>
    //     </button>
    //     `;

    // Other page (basically, if current page is less than number of pages)
    if (curPage < numPages) {
      return `${this._generateCurrentPage()}${this._generateMarkupButton(
        'next'
      )}${this._generateMarkupButton('prev')}`;
      //   return `
      //   <button class="btn--inline pagination__btn--prev">
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-left"></use>
      //         </svg>
      //         <span>Page ${curPage - 1}</span>
      //       </button>

      //   <button class="btn--inline pagination__btn--next">
      //   <span>Page ${curPage + 1}</span>
      //   <svg class="search__icon">
      //     <use href="${icons}#icon-arrow-right"></use>
      //   </svg>
      // </button>
      //       `;
    }

    // Page 1, and there are NO other pages
    return '';
  }

  _generateMarkupButton(type) {
    let pNum = this._data.page;
    type.toLowerCase() === 'next' ? (pNum += 1) : (pNum -= 1);

    return `
    <button data-goto="${pNum}"class="btn--inline pagination__btn--${type}">\
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
          </svg>
          <span>Page ${pNum}</span>
        </button>
        `;
  }

  _generateCurrentPage() {
    let pNum = this._data.page;
    return `
    <div class="wrapper">
    <button class"btn--inline pagination__btn--mid">
    <span>Page ${pNum}</span>
    </button>
    </div>
    `;
  }

  // currentPageScroll() {
  //   _wrapper.addEventListener('click', function (e) {
  //     const btn = e.target.closest('.btn--inline');
  //     return window.scrollTo(0, 0);
  //   });
  // }
}

export default new PaginationView();
