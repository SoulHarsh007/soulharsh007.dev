import {BrickWallShield} from 'lucide-react';

import {Card} from '@/components/ui/card';
import {prettyKnownDDosDates} from '@/lib/ignored-dates';

export function ExcludedDataCard() {
  return (
    <Card className="flex flex-row items-center gap-x-4 p-4 text-sm text-justify">
      <BrickWallShield className="size-8 shrink-0" />
      <div className="text-justify">
        Data from known DDoS attacks on the infrastructure has been excluded
        from the metrics. This is to ensure that the analytics reflect genuine
        traffic patterns and are not skewed by malicious activities. For
        transparency, the ignored dates are:
        <ul className="list-disc pl-6">
          {prettyKnownDDosDates.map(date => (
            <li className="font-bold" key={date}>
              {date}
            </li>
          ))}
        </ul>
        Please feel free to contact site administrator if you have any questions
        or concerns regarding this exclusion.
      </div>
    </Card>
  );
}
