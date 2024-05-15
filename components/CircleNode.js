"use client";

import React, { memo } from 'react';
import { Handle, useStore, Position } from 'reactflow';

// eslint-disable-next-line react/display-name
export default memo(({ id }) => {
  const label = useStore((s) => {
    const node = s.nodeInternals.get(id);

    if (!node) {
      return null;
    }

    return `position x:${parseInt(node.position.x)} y:${parseInt(
      node.position.y,
    )}`;
  });

  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">{label || 'no node connected'}</div>
      </div>
      <Handle type="target" position={Position.Left} />
    </>
  );
});