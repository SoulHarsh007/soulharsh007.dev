import {Card} from '@tremor/react';
import Link from 'next/link';

export default function Footer() {
  return (
    <Card className="flex flex-col justify-center rounded-lg h-[72px] shadow p-4 w-full dark:text-white text-gray-900">
      <div className="w-full mx-auto md:flex md:items-center md:justify-between">
        <div className="text-sm text-center">
          Built with 💖 by{' '}
          <Link
            className="underline decoration-dotted"
            href="https://github.com/SoulHarsh007"
          >
            SoulHarsh007
          </Link>
        </div>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0 justify-center">
          <li>
            <Link
              className="hover:underline me-4 md:me-6"
              href="https://github.com/SoulHarsh007"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className="hover:underline me-4 md:me-6"
              href="mailto:admin@soulharsh007.dev"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </Card>
  );
}
