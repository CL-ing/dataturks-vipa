/*
 * @Author: Azhou
 * @Date: 2021-05-17 22:05:30
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-15 22:42:26
 */
import qs from 'qs'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const useQuery = () => {
  const { search } = useLocation()
  const [query, setQuery] = useState(null)

  useEffect(() => {
    if (!search) setQuery({})
    setQuery(qs.parse(search.replace(/^\?/, '')))
  }, [search])

  return query || {}
}

export default useQuery
