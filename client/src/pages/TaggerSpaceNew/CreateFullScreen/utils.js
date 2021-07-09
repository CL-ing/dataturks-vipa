/*
 * @Author: Azhou
 * @Date: 2021-05-31 19:40:33
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-06 19:53:46
 */
import React from 'react'
import { Table } from 'semantic-ui-react'

export const showExtra = extra => {
  const arrs = []
  for (const k1 of Object.keys(extra)) {
    arrs.push(
      <Table.Row>
        <Table.Cell textAlign="left" className="h5 bold">
          {k1}
        </Table.Cell>
        <Table.Cell className="h6">{extra[k1]}</Table.Cell>
      </Table.Row>
    )
  }

  return (
    <Table celled color="blue" key="blue" size="small" compact="very" collapsing>
      <Table.Body>{arrs}</Table.Body>
    </Table>
  )
}
