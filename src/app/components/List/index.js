import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

// redux
import { useStore, useSelector } from 'react-redux'
import { listLoad } from '@/store/actions/list'
import { getList } from '@/store/reducers/list'

import Item from './Item'
import Loading from '@/components/Ui/Loading'

import './style.scss'

const isEmpty = (val, type) => {
  return val === undefined || val === '' || val === '-' ? (type ? 'addtime' : '') : val === '全部' ? '' : val
}

const type = {
  tv: 201,
  ova: 202,
  juchang: 203,
  tebie: 4,
  zhenren: 204,
  qita: 35
}

const List = ({ id, mcid, year, area, wd, letter, lz, order }) => {
  const reducerName =
    '' + id + isEmpty(mcid) + isEmpty(year) + isEmpty(area) + isEmpty(wd) + isEmpty(letter) + isEmpty(lz) + isEmpty(order, 1)
  const info = useSelector(state => getList(state, reducerName))
  const store = useStore()

  // 显示记录
  const showlist = useCallback(() => {
    const getData = args => listLoad(args)(store.dispatch, store.getState)
    getData({
      id,
      mcid: isEmpty(mcid),
      year: isEmpty(year),
      area: isEmpty(area),
      wd: isEmpty(wd),
      letter: isEmpty(letter),
      lz: isEmpty(lz),
      order: isEmpty(order, 1)
    })
  }, [area, id, letter, lz, mcid, order, store.dispatch, store.getState, wd, year])

  useEffect(() => {
    if (!info.data) showlist()
    ArriveFooter.add(id, showlist)
    return () => {
      ArriveFooter.remove(id)
    }
  }, [id, info.data, showlist, store.dispatch, store.getState])

  const { data = [], loading } = info || {}

  return (
    <div styleName='main-list'>
      {loading ? <Loading /> : null}
      <div className='wp'>
        <Item data={data} />
      </div>
    </div>
  )
}

List.propTypes = {
  id: PropTypes.any,
  mcid: PropTypes.any,
  year: PropTypes.any,
  area: PropTypes.string,
  wd: PropTypes.string,
  letter: PropTypes.string,
  lz: PropTypes.any,
  order: PropTypes.string
}

List.loadDataOnServer = async ({ store, match, res, req, user }) => {
  const { name, mcid, year, area, wd = '', order, letter, lz } = match.params
  const id = type[name] || 3
  await listLoad({
    id,
    mcid: isEmpty(mcid),
    year: isEmpty(year),
    area: isEmpty(area),
    wd: isEmpty(wd),
    letter: isEmpty(letter),
    lz: isEmpty(lz),
    order: isEmpty(order, 1)
  })(store.dispatch, store.getState)
}

export default List
