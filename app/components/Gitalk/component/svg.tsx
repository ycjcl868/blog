import ArrowDown from '../assets/icon/arrow_down.svg'
import Edit from '../assets/icon/edit.svg'
import Github from '../assets/icon/github.svg'
import Heart from '../assets/icon/heart.svg'
import HeartOn from '../assets/icon/heart_on.svg'
import Reply from '../assets/icon/reply.svg'
import Tip from '../assets/icon/tip.svg'

const map = {
  arrow_down: ArrowDown,
  edit: Edit,
  github: Github,
  heart: Heart,
  heart_on: HeartOn,
  reply: Reply,
  tip: Tip
}

const SVG = ({ className, text, name }) => {
  const Icon = map[name]
  return (
    <span className={`gt-ico ${className}`}>
      <Icon className='gt-svg' />
      {text && <span className='gt-ico-text'>{text}</span>}
    </span>
  )
}

export default SVG
