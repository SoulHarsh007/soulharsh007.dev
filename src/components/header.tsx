import Image from 'next/image';
import Link from 'next/link';

import {Card} from '@/components/ui/card';

export function Header() {
  return (
    <header className="flex w-full">
      <Card className="p-3 w-full items-center md:items-start">
        <div className="text-sm text-center">
          <Link className="text-2xl font-mono flex items-center" href="/">
            <Image
              alt="SoulHarsh007"
              className="inline-block dark:invert"
              height={48}
              priority
              quality={100}
              src="/logo.svg"
              width={48}
            />
            <p>SoulHarsh007</p>
          </Link>
        </div>
      </Card>
    </header>
  );
}
