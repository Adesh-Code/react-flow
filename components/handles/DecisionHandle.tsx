import React from 'react'
import { Handle, HandleProps } from 'reactflow'

export enum DecisionTypes {Yes, No};

function DecisionHandle( props: HandleProps & { decision:  DecisionTypes, className?: string | undefined}) {
  if (props.decision === DecisionTypes.Yes) {
    return (
      <Handle {...props} style={{background : 'green', width: '0.7rem', height: '0.7rem'}}/>
    )
  }
  return (
    <Handle {...props} style={{background : 'red', width: '0.7rem', height: '0.7rem'}}/>
  )
}

export default DecisionHandle