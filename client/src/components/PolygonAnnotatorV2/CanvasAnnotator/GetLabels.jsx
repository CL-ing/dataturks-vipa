import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Icon } from 'semantic-ui-react'
import styles from './index.module.scss'
import { Checkbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import AddNote from './AddNote'

const GetLabels = ({ updateBoundingBoxMap }) => {
  const { boundingBoxMap, entityColorMap, entities, currentHit } = useSelector(
    // @ts-ignore
    state => state.project
  )
  const dispatch = useDispatch()

  const [openNoteIndex, setOpenNoteIndex] = useState(-1)

  const getOptions = index => {
    const { label, notes } = boundingBoxMap[index]

    const options = []
    for (let jindex = 0; jindex < entities.length; jindex++) {
      options.push({
        key: entities[jindex],
        text: (
          <Checkbox
            checked={label.includes(entities[jindex])}
            onChange={() => changeLabel(index, jindex)}
          >
            {entities[jindex]}
          </Checkbox>
        ),
      })
    }
    options.push({
      key: 'note',
      text: (
        <Button size="mini" onClick={() => setOpenNoteIndex(index)}>
          {notes.length ? 'Edit' : 'Add'} Note
        </Button>
      ),
    })
    return options
  }

  const changeLabel = (key, index) => {
    // key表示是第几个button，index表示选中的第几个checkbox
    const { label } = boundingBoxMap[key]

    const jindex = label.indexOf(entities[index])
    if (jindex !== -1) label.splice(jindex, 1)
    else label.push(entities[index])

    if (label.length === 0) {
      removeShape(key)
      return
    }
    boundingBoxMap[key].label = label
    updateBoundingBoxMap([])
  }

  const toggleEyeRectStatus = index => {
    boundingBoxMap[index].hide = !boundingBoxMap[index].hide
    updateBoundingBoxMap([])
  }

  const removeShape = deleteIndex => {
    const boxId = boundingBoxMap[deleteIndex].id
    boundingBoxMap.splice(deleteIndex, 1)
    dispatch({
      type: 'UPDATE_BOUNDING_BOX_MAP',
      payload: [...boundingBoxMap],
    })
    // 暂定为只有一个contributor的情况
    const deleteItemIndex = currentHit.hitResults[0]?.result?.findIndex(v => v.id === boxId)
    if (deleteItemIndex !== -1) {
      // 删除原有项目中的标记项
      currentHit.hitResults[0].result.splice(deleteItemIndex, 1)
      dispatch({
        type: 'UPDATE_CURRENT_HITS',
        payload: { ...currentHit },
      })
    }
  }

  const saveModal = inputValue => {
    boundingBoxMap[openNoteIndex].notes = inputValue
    updateBoundingBoxMap([])
    setOpenNoteIndex(-1)
  }

  return (
    <div className={styles.labelWrap}>
      {boundingBoxMap.map((box, index) => (
        <div
          key={index}
          className={styles.labelBtn}
          style={{
            boxShadow: box.mouseHover ? '2px 2px 2px 2px black' : '',
            backgroundColor: entityColorMap[box.label[0]],
          }}
        >
          <Icon
            name={box.hide ? 'low vision' : 'eye'}
            style={{ cursor: 'pointer' }}
            onClick={() => toggleEyeRectStatus(index)}
          />
          <Icon
            style={{ cursor: 'pointer' }}
            name="delete"
            id={index}
            onClick={() => removeShape(index)}
          />
          <Dropdown
            floating
            inline
            upward
            button
            compact
            className="icon"
            style={{
              fontSize: 'xx-small',
              backgroundColor: entityColorMap[box.label[0]],
            }}
            labeled
            text={box.label.join(',')}
            scrolling
            options={getOptions(index)}
          />
        </div>
      ))}
      {openNoteIndex !== -1 && (
        <AddNote
          closeModal={() => setOpenNoteIndex(-1)}
          value={boundingBoxMap[openNoteIndex].notes}
          saveModal={saveModal}
        />
      )}
    </div>
  )
}

export default GetLabels
