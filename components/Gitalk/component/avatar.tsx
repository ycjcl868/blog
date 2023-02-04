import { useState } from 'react'
import Image from 'next/image'

const Avatar = ({
  src,
  className,
  alt,
  defaultSrc = '//cdn.jsdelivr.net/npm/gitalk@1/src/assets/icon/github.svg'
}) => {
  const [imgSrc, setImageSrc] = useState(src || defaultSrc)
  return (
    <div className={`gt-avatar ${className}`}>
      <Image
        src={imgSrc}
        alt={`@${alt}`}
        width={50}
        height={50}
        onError={() => setImageSrc(defaultSrc)}
      />
    </div>
  )
}

export default Avatar
