/*
 * @Author: Azhou
 * @Date: 2021-05-17 22:05:30
 * @LastEditors: Azhou
<<<<<<< HEAD
 * @LastEditTime: 2021-06-15 22:42:26
 */
import qs from 'qs'
import { useEffect, useState } from 'react'
=======
 * @LastEditTime: 2021-07-08 14:39:43
 */
import qs from 'qs'
import { useMemo } from 'react'
>>>>>>> tmp
import { useLocation } from 'react-router-dom'

const useQuery = () => {
  const { search } = useLocation()
<<<<<<< HEAD
  const [query, setQuery] = useState(null)

  useEffect(() => {
    if (!search) setQuery({})
    setQuery(qs.parse(search.replace(/^\?/, '')))
  }, [search])

  return query || {}
=======
  return useMemo(() => {
    if (!search) return {}
    return qs.parse(search.replace(/^\?/, ''))
  }, [search])
>>>>>>> tmp
}

export default useQuery
