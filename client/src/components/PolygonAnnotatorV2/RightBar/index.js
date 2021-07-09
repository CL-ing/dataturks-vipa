/*
 * @Author: Azhou
 * @Date: 2021-06-21 15:11:53
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-29 21:44:32
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon, Input, Label } from 'semantic-ui-react'
import { btnGroup, shapes } from './config'
import styles from '../index.module.scss'

const RightBar = ({
  space,
  clearPolygons,
  hideLabelsMap,
  toggleEyeStatus,
  getBackTopreviousRow,
  skipRow,
  saveTagAndNextRow,
  saveRow,
  toolName,
  setToolName,
  defaultClass,
  setDefaultClass,
}) => {
  const { projectDetails, currentIndex, projectHits, entityColorMap } = useSelector(
    // @ts-ignore
    state => state.project
  )

  const [searchQuery, setSearchQuery] = useState('')

  const defaultShape = useMemo(() => {
    const rules = JSON.parse(projectDetails.taskRules)
    return rules.defaultShape || 'polygon'
  }, [projectDetails])

  useEffect(() => {
    setToolName(defaultShape)
  }, [defaultShape])

  const getMenuItems = () => {
    const arrs = []
    let index1 = 0
    let jindex = 0
    for (const key in entityColorMap) {
      if (searchQuery.length === 0 || key.toUpperCase().includes(searchQuery.toUpperCase())) {
        arrs.push(
          <div
            className={styles.entityItemWrap}
            onClick={() => {
              if (defaultClass !== key) setDefaultClass(key)
              else setDefaultClass('')
            }}
            tabIndex={jindex}
            key={key}
            id={key}
            style={{ backgroundColor: `${defaultClass === key ? 'grey' : 'white'}` }}
          >
            <div title={hideLabelsMap[key] ? 'Show Labels' : 'Hide Labels'}>
              <Button
                size="mini"
                icon
                style={{ backgroundColor: 'white', cursor: 'pointer' }}
                onClick={() => toggleEyeStatus(key)}
              >
                <Icon
                  name={hideLabelsMap[key] ? 'low vision' : 'eye'}
                  style={{ color: entityColorMap[key] }}
                />
              </Button>
            </div>
            <div style={{ cursor: 'pointer', overflow: 'initial', width: '50%' }}>
              <div>
                <Label
                  id={key}
                  size="mini"
                  style={{
                    whiteSpace: 'inherit',
                    boxShadow: '1px 1px 1px',
                    color: 'white',
                    backgroundColor: entityColorMap[key],
                  }}
                >
                  {key}
                </Label>
              </div>
            </div>
          </div>
        )
        jindex = jindex + 1
      }
      index1 = index1 + 1
    }
    return (
      <div
        style={{
          display: 'flex',
          backgroundColor: 'white',
          overflow: 'auto',
          flexDirection: 'column',
        }}
      >
        <div style={{ boxShadow: '4px 4px 4px rgba(85,85,85,0.1)' }}>
          <Input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search..."
          />
        </div>
        <div>{arrs}</div>
      </div>
    )
  }

  return (
    <div className={styles.rightBar}>
      {defaultShape !== 'rectangle' && (
        <div className={styles.chooseShape}>
          {shapes.map((shape, index) => (
            <div key={index} title={shape.title}>
              <Button
                size="mini"
                color={toolName === shape.value ? 'blue' : 'grey'}
                icon
                onClick={() => setToolName(shape.value)}
              >
                <Icon
                  // @ts-ignore
                  name={shape.icon}
                />
                <p style={{ fontSize: '0.4rem' }}>{shape.label}</p>
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.selectEntity}>
        <p style={{ padding: '5px' }}>Select Entity</p>
        {getMenuItems()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
        <div title="Clear All" style={{ margin: '10px auto' }}>
          <Button icon size="mini" secondary onClick={clearPolygons}>
            <Icon name="remove" />
          </Button>
        </div>
      </div>
      {space && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="marginTop"
            style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Button
              icon
              size="mini"
              color="grey"
              title="Previous"
              onClick={getBackTopreviousRow}
              disabled={currentIndex <= 0}
            >
              <Icon name="arrow left" />
            </Button>
            <Button
              icon
              size="mini"
              color="grey"
              title="Skip"
              onClick={skipRow}
              disabled={currentIndex < 0}
            >
              <Icon name="mail forward" />
            </Button>
            <Button
              icon
              size="mini"
              color="blue"
              title="Next"
              onClick={saveTagAndNextRow}
              disabled={currentIndex >= projectHits.length - 1}
            >
              <Icon name="arrow right" />
            </Button>
          </div>
          <div style={{ padding: '20px' }}>
            {btnGroup.map((btn, index) => (
              <Button
                key={index}
                style={{ marginBottom: '10px', width: '100%' }}
                size="mini"
                color="blue"
                title={btn.title}
                onClick={() => saveRow(btn.value)}
              >
                {btn.desc}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RightBar
