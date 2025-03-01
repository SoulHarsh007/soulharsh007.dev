import {Card} from '@/components/Card';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <Card className="rounded-lg shadow p-3 w-full">
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
          <div className="mt-1 dark:text-white text-gray-900">SoulHarsh007</div>
        </Link>
      </div>
    </Card>
  );
}
