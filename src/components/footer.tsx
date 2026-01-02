import Link from 'next/link';

import {Card} from '@/components/ui/card';

export function Footer() {
  return (
    <footer className="flex w-full">
      <Card className="h-18 w-full p-4 justify-center">
        <div className="w-full md:flex md:items-center md:justify-between text-sm">
          <div className="text-center">
            Built with 💖 by{' '}
            <Link
              className="underline decoration-dotted"
              href="https://github.com/SoulHarsh007"
            >
              SoulHarsh007
            </Link>
          </div>
          <ul className="flex flex-wrap items-center mt-3 font-medium sm:mt-0 justify-center">
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
    </footer>
  );
}
