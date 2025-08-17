import {TrendingUpDown} from 'lucide-react';

import {Card} from '@/components/ui/card';
import {prettyKnownCFBugDates} from '@/lib/ignored-dates';

export function CFBugCard() {
  return (
    <Card className="flex flex-row items-center gap-x-4 p-4 text-sm text-justify">
      <TrendingUpDown className="size-8 shrink-0" />
      <div className="text-justify">
        Due to a Cloudflare analytics bug, the data for following dates was
        removed from the calculation as it returned values of 9.22 EB:
        <ul className='list-disc pl-6'>
          {prettyKnownCFBugDates.map(date => (
            <li className="font-bold" key={date}>
              {date}
            </li>
          ))}
        </ul>
        This bug was resolved with in 72 hours of reporting! A big thank you to
        Erisa (Community Champion), Rian (Data Team, Cloudflare), and the entire
        Cloudflare team for such a quick response!
      </div>
    </Card>
  );
}
