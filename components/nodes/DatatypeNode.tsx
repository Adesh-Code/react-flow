"use client";

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function DatatypeNode({ data } : {data: {label: string, entities: Record<string, string>}}) {
  return (
    <>
      <div className='bg-[#f4ffec] border border-1 border-[#525252] rounded'>
        <div className='text-[0.6rem] border-b border-[#382758] px-1 pt-1 text-center'>{data.label}</div>
        <div className='p-2'>
          {
            Object.entries(data.entities).map((entry) => {
              return (
                <div className='text-[0.5rem] ' key={entry[1]}> 
                  <span><b>{entry[0]}: </b></span>
                  <span>{entry[1]}</span>
                </div>
              );
            }) 
          }
        </div>
        
      </div>
      <Handle type='target' position={Position.Top} />
      <Handle type='source' position={Position.Bottom} />
    </>
  );
}

export default memo(DatatypeNode);
