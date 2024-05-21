"use client";

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function EndNode() {
  return (
    <>
      <Handle id='end' type='target' position={Position.Top}/>
      <div className='border border-1 border-[#000] rounded-full p-1'>
        <div className='bg-[#000] w-full h-full p-2 rounded-full'></div>
      </div>
    </>
  );
}

export default memo(EndNode);
