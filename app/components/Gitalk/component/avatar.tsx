import { useState } from 'react';
import GithubSVG from '../assets/icon/github.svg';

const Avatar = ({ src, className, alt, defaultSrc = GithubSVG }) => {
  const [imgSrc, setImageSrc] = useState(src || defaultSrc);
  return (
    <div className={`gt-avatar ${className}`}>
      <img
        src={imgSrc}
        alt={`@${alt}`}
        width={50}
        height={50}
        onError={() => setImageSrc(defaultSrc)}
      />
    </div>
  );
};

export default Avatar;
