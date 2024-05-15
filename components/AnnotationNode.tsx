"use client";

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function AnnotationNode({ data } : {data: {level: number, label: string}}) {
  return (
    <>
      <Handle type='source' position={Position.Top}/>
      <div style={{ padding: 10, display: 'flex' }}>
        <div style={{ marginRight: 4 }}>{data.level}.</div>
        <div>{data.label}</div>
      </div>
    </>
  );
}

export default memo(AnnotationNode);
