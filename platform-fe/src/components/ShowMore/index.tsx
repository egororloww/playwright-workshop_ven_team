import { PropsWithChildren, useEffect, useRef, useState } from 'react';

import classes from './index.module.scss';

export const ShowMore = ({ children }: PropsWithChildren): JSX.Element => {
  const [showAllItems, setShowAllItems] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const toggleItems = (): void => {
    setShowAllItems(!showAllItems);
  };

  useEffect(() => {
    setShowAllItems(false);
  }, [children]);

  return (
    <div>
      <div ref={contentRef} className={`${classes.expander} ${showAllItems ? classes.expanded : ''}`}>
        <div className={classes['expander-content']}>{children}</div>
      </div>
      <button onClick={toggleItems} className={classes.button}>
        {showAllItems ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};
