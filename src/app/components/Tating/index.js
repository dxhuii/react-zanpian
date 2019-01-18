import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { mark } from '@/store/actions/mark'

import './style.scss'

@withRouter
@connect(
  (state, props) => ({}),
  dispatch => ({
    mark: bindActionCreators(mark, dispatch)
  })
)
class Tating extends Component {
  static propTypes = {
    data: PropTypes.object,
    mark: PropTypes.func,
    score: PropTypes.func,
    id: PropTypes.number,
    sid: PropTypes.number,
    uid: PropTypes.number
  }

  static defaultProps = {
    data: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      starWith: 16,
      star: 0,
      starText: ['很差', '较差', '还行', '推荐', '力荐'],
      width0: 0,
      width1: 0,
      width2: 0,
      width3: 0,
      width4: 0
    }
  }

  async onStar(index) {
    this.setState({
      starWith: index * 16,
      star: index
    })
    const { mark, score, id, sid, uid } = this.props
    let [err, data] = await mark({ id, val: index })
    if (data.rcode === 1) {
      score({ id, sid, uid })
    }
  }

  starClass(pfnum) {
    var pfclass = ''
    if (pfnum >= 50) {
      pfclass = 'bigstar50'
    } else if (pfnum >= 45) {
      pfclass = 'bigstar45'
    } else if (pfnum >= 40) {
      pfclass = 'bigstar40'
    } else if (pfnum >= 35) {
      pfclass = 'bigstar35'
    } else if (pfnum >= 30) {
      pfclass = 'bigstar30'
    } else if (pfnum >= 35) {
      pfclass = 'bigstar35'
    } else if (pfnum >= 20) {
      pfclass = 'bigstar20'
    } else if (pfnum >= 15) {
      pfclass = 'bigstar15'
    } else if (pfnum >= 10) {
      pfclass = 'bigstar10'
    } else if (pfnum >= 5) {
      pfclass = 'bigstar5'
    } else if (pfnum >= 0) {
      pfclass = 'bigstar0'
    }
    return pfclass
  }

  engine = (number, type) => {
    let timer
    let that = this
    const step = 1
    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(function fn() {
      const w = that.state[`width${type}`]
      if (w < number) {
        that.setState({
          [`width${type}`]: w + step > number ? number : w + step
        })
        timer = requestAnimationFrame(fn)
      } else {
        cancelAnimationFrame(timer)
      }
    })
  }

  show(data, text) {
    const { a, b, c, d, e, pinfen, pinfenb } = data
    const total = a + b + c + d + e
    const calc = val => ((val / total) * 100).toFixed(2)
    const progressBar = (val, index) => {
      {
        this.engine(calc(val), index)
      }
      return <div styleName="progress-bar" style={{ width: this.state[`width${index}`] }} />
    }
    const scoreArr = [a, b, c, d, e]
    return (
      <Fragment>
        {pinfenb > 0 && total > 0 ? (
          <div styleName="rating" className="pr">
            <h4>评分</h4>
            <div styleName="rating-num">
              <strong>{pinfen === '10.0' ? 10 : pinfen}</strong>
              <span className={this.starClass(parseFloat(pinfen) * 5)} />
              <span styleName="people">
                <em>{total}</em>人评价
              </span>
            </div>
            <ul styleName="rating-show" className="clearfix">
              {scoreArr.map((item, index) => (
                <li key={index}>
                  <span>{text[scoreArr.length - (index + 1)]}</span>
                  <div styleName="progress" title={`${calc(item)}%`}>
                    {progressBar(item, index)}
                  </div>
                  <em>{item}人</em>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div styleName="noscore">还没有评分</div>
        )}
      </Fragment>
    )
  }

  move(index) {
    this.setState({
      star: index
    })
  }

  render() {
    const { starWith, starText, star } = this.state
    const { data } = this.props
    return (
      <Fragment>
        {this.show(data, starText)}
        <div styleName="starBox">
          <em>评分</em>
          <div styleName="starlist">
            {[1, 2, 3, 4, 5].map(item => (
              <a
                key={item}
                title={`${item}星`}
                styleName={`star_${item}`}
                onClick={() => this.onStar(item)}
                onMouseOver={() => this.move(item)}
              />
            ))}
          </div>
          <div styleName="star_current" style={{ width: starWith }} />
          <span>{starText[star - 1]}</span>
        </div>
      </Fragment>
    )
  }
}

export default Tating
