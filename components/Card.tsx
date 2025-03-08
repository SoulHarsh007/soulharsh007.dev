// Tremor Card [v0.0.2]

import {cx} from '@/lib/utils';
import {Slot} from '@radix-ui/react-slot';
import React from 'react';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({asChild, className, ...props}, forwardedRef) => {
    const Component = asChild ? Slot : 'div';
    return (
      <Component
        className={cx(
          // base
          'relative w-full rounded-lg border p-6 text-left shadow-xs',
          // background color
          'bg-white dark:bg-black',
          // border color
          'border-gray-200 dark:border-gray-200/20',
          className
        )}
        ref={forwardedRef}
        tremor-id="tremor-raw"
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export {Card, type CardProps};
