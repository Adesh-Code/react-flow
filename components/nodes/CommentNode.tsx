"use client";

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CommentNode({ data } : {data: {label: string}}) {
  return (
    <>
      <div className='bg-[#dfdb59] text-[0.4rem] border border-1 border-[#827e7e] rounded ' style={{ padding: 10, display: 'flex' }}>
        <span className='whitespace-pre-line'>{data.label}</span>
      </div>
    </>
  );
}

export default memo(CommentNode);
