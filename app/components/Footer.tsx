import BLOG from '#/blog.config';
import { forwardRef } from 'react';

const Footer = forwardRef(({ fullWidth }, ref) => {
  const d = new Date();
  const y = d.getFullYear();
  const from = +BLOG.since;

  return (
    <div
      ref={ref}
      className={`mt-6 shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all ${
        !fullWidth ? 'max-w-4xl px-4' : 'px-4 md:px-24'
      }`}
    >
      <hr className="border-gray-200 dark:border-gray-600" />
      <div className="my-4 text-sm leading-6">
        <div className="flex align-baseline justify-between flex-wrap">
          <p>
            ©{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://github.com/${BLOG.author}`}
            >
              {BLOG.author}
            </a>{' '}
            {from === y || !from ? y : `${from} - ${y}`}
          </p>
        </div>
      </div>
    </div>
  );
});

Footer.displayName = 'Footer';

export default Footer;
