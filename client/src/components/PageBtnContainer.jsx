import React from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useAllJobsContext } from '../pages/AllJobs';

const PageBtnContainer = () => {
    const { data } = useAllJobsContext();
    const { numOfPages, currentPage } = data;

    const pages = Array.from ({length: numOfPages}, (_,index) => index + 1);

    const {search, pathname} = useLocation();
    const navigate = useNavigate();

    const pageChangeHandler = (pageNumber) => {
        //console.log('page number: ', pageNumber);
        const searchParams = new URLSearchParams(search);
        searchParams.set('page', pageNumber);
        navigate(`${pathname}?${searchParams.toString()}`)
    };

    const addPageButton = ({pageNumber, activeClass}) => {
        return ( <button className={`btn page-btn ${activeClass && 'active'}`} key={pageNumber} onClick={() => pageChangeHandler(pageNumber)}>
            {pageNumber}
        </button> );
    };
    
    const renderPageButtons = () => {
        const pageButtons = [];
        //first button
        pageButtons.push(
            addPageButton({pageNumber: 1, activeClass: currentPage === 1})
        );

        //elipsis before 3 buttons
        if( currentPage > 3) {
            pageButtons.push(<span className="page-btn dots" key="dots-1">
                ...
            </span>
            );
        }

        //one before current
        if( currentPage !== 1 && currentPage !== 2) {
            pageButtons.push(
                addPageButton({pageNumber: currentPage - 1, activeClass: false})
            );
        }

        //current page but not first or last pages
        if( currentPage !== 1 && currentPage !== numOfPages) {
            pageButtons.push(
                addPageButton({pageNumber: currentPage, activeClass: true})
            );
        }

        //one after current
        if( currentPage !== numOfPages && currentPage !== numOfPages - 1) {
            pageButtons.push(
                addPageButton({pageNumber: currentPage + 1, activeClass: false})
            );
        }

        //elipsis after 3 buttons
        if( currentPage < numOfPages - 2) {
            pageButtons.push(<span className="page-btn dots" key="dots+1">
                ...
            </span>
            );
        }

        //last button
        pageButtons.push(
            addPageButton({pageNumber: numOfPages, activeClass: currentPage === numOfPages})
        );
        return pageButtons;
    };

    return (
        <Wrapper>
            <button className="btn prev-btn" onClick={() => {
                let prevPage = currentPage - 1;
                if (prevPage < 1) prevPage = numOfPages; //ie wrap around back to the last page
                pageChangeHandler(prevPage);
            }}>
                <HiChevronDoubleLeft />
                prev
            </button>
            <div className="btn-container">
                { renderPageButtons() }
            </div>
            <button className="btn next-btn" onClick={() => {
                let nextPage = currentPage + 1;
                if (nextPage > numOfPages) nextPage = 1; //ie wrap around back to the first page
                pageChangeHandler(nextPage);
            }}>
                <HiChevronDoubleRight />
                next
            </button>
        </Wrapper>
    )
}

export default PageBtnContainer

//Simple implementation of pagination
// const PageBtnContainer = () => {
//     const { data } = useAllJobsContext();
//     const { numOfPages, currentPage } = data;

//     const pages = Array.from ({length: numOfPages}, (_,index) => index + 1);

//     const {search, pathname} = useLocation();
//     const navigate = useNavigate();

//     const pageChangeHandler = (pageNumber) => {
//         //console.log('page number: ', pageNumber);
//         const searchParams = new URLSearchParams(search);
//         searchParams.set('page', pageNumber);
//         navigate(`${pathname}?${searchParams.toString()}`)
//     };

//     return (
//         <Wrapper>
//             <button className="btn prev-btn" onClick={() => {
//                 let prevPage = currentPage - 1;
//                 if (prevPage < 1) prevPage = numOfPages; //ie wrap around back to the last page
//                 pageChangeHandler(prevPage);
//             }}>
//                 <HiChevronDoubleLeft />
//                 prev
//             </button>
//             <div className="btn-container">
//                 {
//                     pages.map((pageNumber) => {
//                         return <button className={`btn page-btn ${pageNumber === currentPage && 'active'}`} key={pageNumber} onClick={() => pageChangeHandler(pageNumber)}>
//                             {pageNumber}
//                         </button>
//                     })
//                 }
//             </div>
//             <button className="btn next-btn" onClick={() => {
//                 let nextPage = currentPage + 1;
//                 if (nextPage > numOfPages) nextPage = 1; //ie wrap around back to the first page
//                 pageChangeHandler(nextPage);
//             }}>
//                 <HiChevronDoubleRight />
//                 next
//             </button>
//         </Wrapper>
//     )
// }