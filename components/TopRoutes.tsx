import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';

const data = [
  {
    region: 'GLOBAL (Primary: SEA and US)',
    route: 'sea-usw-lb.soulharsh007.dev',
    service: 'CDN: RebornOS Mirror',
  },
  {
    region: 'EU-CENTRAL',
    route: 'at.soulharsh007.dev',
    service: 'Repository Mirror: CachyOS',
  },
  {
    region: 'GLOBAL',
    route: 'cdn.soulharsh007.dev',
    service: 'CDN: RebornOS ISOs and misc stuff',
  },
  {
    region: 'GLOBAL',
    route: 'labs.soulharsh007.dev',
    service: 'CDN: Sandbox / tests',
  },
  {
    region: 'APAC',
    route: 'archive.soulharsh007.dev',
    service: 'CDN: Misc content archive',
  },
  {
    region: 'EU-CENTRAL',
    route: 'tempfs.soulharsh007.dev',
    service: 'CDN: Sandbox / tests',
  },
];

export function TopRoutes() {
  return (
    <Card>
      <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold text-center">
        High Traffic Routes
      </h3>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Route</TableHeaderCell>
            <TableHeaderCell>Region</TableHeaderCell>
            <TableHeaderCell>Service</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.route}>
              <TableCell>{item.route}</TableCell>
              <TableCell>{item.region}</TableCell>
              <TableCell>{item.service}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
