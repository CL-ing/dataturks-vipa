import { Slider } from 'antd'
import React from 'react'

const ControlImageProp = ({ imageProp, changeImageProp }) => {
  const config = [
    {
      key: 'contrast',
      label: 'Contrast',
      step: 0.01,
      min: 0,
      max: 10,
    },
    {
      key: 'saturation',
      label: 'Saturation',
      step: 0.01,
      min: 0,
      max: 4,
    },
    {
      key: 'brightness',
      label: 'Brightness',
      step: 0.01,
      min: 0,
      max: 4,
    },
    {
      key: 'scale',
      label: 'Zoom',
      step: 0.01,
      min: 0.01,
      max: 10,
    },
    {
      key: 'opacity',
      label: 'Box Opacity',
      step: 0.01,
      min: 0,
      max: 1,
    },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 'xx-small' }}>
      {config.map(rangeItem => (
        <div style={{ display: 'flex', alignItems: 'center' }} key={rangeItem.key}>
          <span style={{ marginRight: '5px' }}>
            {rangeItem.label} : <b> {Math.round(imageProp[rangeItem.key] * 100)}%</b>
          </span>
          <Slider
            style={{ width: '100px' }}
            min={rangeItem.min}
            max={rangeItem.max}
            step={rangeItem.step}
            value={imageProp[rangeItem.key]}
            onChange={e => changeImageProp(rangeItem.key, e)}
          />
        </div>
      ))}
    </div>
  )
}

export default ControlImageProp
