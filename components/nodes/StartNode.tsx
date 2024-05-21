"use client";

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function StartNode() {
  return (
    <div className='rounded-full p-3 flex bg-[#000]'>
      <Handle id='start' type='source' position={Position.Bottom}/>
    </div>
  );
}

export default memo(StartNode);
