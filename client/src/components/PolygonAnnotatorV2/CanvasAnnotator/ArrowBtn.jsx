import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const ArrowBtn = ({ pan }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 'large',
      }}
    >
      <Button size="mini" icon onClick={() => pan(-5, 0)}>
        <Icon name="angle left" />
      </Button>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Button size="mini" icon onClick={() => pan(0, -5)}>
          <Icon name="angle up" />
        </Button>
        <Button size="mini" icon onClick={() => pan(0, 5)}>
          <Icon name="angle down" />
        </Button>
      </div>
      <Button size="mini" icon onClick={() => pan(5, 0)}>
        <Icon name="angle right" />
      </Button>
    </div>
  )
}

export default ArrowBtn
