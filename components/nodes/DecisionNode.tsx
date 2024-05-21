"use client";

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import DecisionHandle, { DecisionTypes } from './../handles/DecisionHandle';

function DecisionNode({ data }: { data: { label: string } }) {
  return (
    <>
      <div className='relative bg-[#59dddf] flex border border-1 border-[#827e7e] h-20 w-20 rotate-[45deg] justify-center items-center'>
          
        <Handle id='top' className='ms-[-50%]' type='target' position={Position.Top} />
        <DecisionHandle id='right' className='mt-[-50%]' type='source' position={Position.Right} decision={DecisionTypes.No} />
        {/* <Handle id='bottom' className='ms-[50%]' type='source' position={Position.Bottom} /> */}
        <DecisionHandle id='left' className='mt-[50%]' type='source' position={Position.Left} decision={DecisionTypes.Yes} />
        <center className='rotate-[-45deg] text-[0.6rem]'>{data.label}</center>
      </div>
    </>
  );
}

export default memo(DecisionNode);
