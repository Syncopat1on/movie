import React from 'react';

import './pagination.css';
import { Pagination } from 'antd';

function PaginationB({onChange, currentPage, totalPages}) {
  return (
    <div className='pagination-container'>
    <Pagination 
      align="center"
      defaultCurrent={1} 
      total={totalPages}
      onChange={onChange}
      current={currentPage}
      showSizeChanger={false}
      pageSize={1}
    />
    </div>
  );
}

export default PaginationB;