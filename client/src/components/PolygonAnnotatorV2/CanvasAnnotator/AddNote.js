/*
 * @Author: Azhou
 * @Date: 2021-06-21 16:08:15
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-21 16:08:15
 */
import React, { useState } from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import { Button, Icon } from 'semantic-ui-react'

// this.state.notes[this.state.noteIndex]
const AddNote = ({ closeModal, value, saveModal }) => {
  const [inputValue, setInputValue] = useState(value)
  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            Add a Note
            <Icon onClick={closeModal} className="pull-right" name="close" />
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            type="textarea"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            autoFocus
            className="form-control"
            id="note"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" positive onClick={() => saveModal(inputValue)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  )
}

export default AddNote
