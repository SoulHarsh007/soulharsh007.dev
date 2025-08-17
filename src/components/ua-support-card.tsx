import {SquareArrowOutUpRight} from 'lucide-react';
import Link from 'next/link';

import {Card} from '@/components/ui/card';

export function UASupportCard() {
  return (
    <Card className="flex flex-row items-center gap-x-4 p-4 text-sm rounded-lg text-justify">
      <svg
        className="ml-3 size-8 shrink-0"
        viewBox="0 0 640 480"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fillRule="evenodd" strokeWidth="1pt">
          <path d="M0 0h640v480H0z" fill="gold" />
          <path d="M0 0h640v240H0z" fill="#0057b8" />
        </g>
      </svg>
      <div>
        <span className="font-bold">Stand with Ukraine</span> - In this critical
        time, we stand in solidarity with the people of Ukraine. Together, we
        can offer hope, support, and resilience. If {"you're "}
        able to help, consider donating to those in need.{' '}
        <span className="font-bold">Slava Ukraini! </span>
        <Link
          className="underline decoration-dotted inline-flex"
          href="https://u24.gov.ua/"
          target="_blank"
        >
          Show your support
          <SquareArrowOutUpRight className="size-3" />
        </Link>
      </div>
    </Card>
  );
}
