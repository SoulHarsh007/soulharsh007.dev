// Tremor AreaChart [v0.3.1]

'use client';

import {
  AvailableChartColors,
  AvailableChartColorsKeys,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
} from '@/lib/chartUtils';
import {useOnWindowResize} from '@/lib/hooks';
import {cx} from '@/lib/utils';
import {RiArrowLeftSLine, RiArrowRightSLine} from '@remixicon/react';
import React from 'react';
import {
  Area,
  CartesianGrid,
  Dot,
  Label,
  Line,
  AreaChart as RechartsAreaChart,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {AxisDomain} from 'recharts/types/util/types';

//#region Legend

interface LegendItemProps {
  activeLegend?: string;
  color: AvailableChartColorsKeys;
  name: string;
  onClick?: (name: string, color: AvailableChartColorsKeys) => void;
}

const LegendItem = ({activeLegend, color, name, onClick}: LegendItemProps) => {
  const hasOnValueChange = !!onClick;
  return (
    <li
      className={cx(
        // base
        'group inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 transition',
        hasOnValueChange
          ? 'cursor-pointer hover:bg-gray-100 dark:hover:border-gray-200/20'
          : 'cursor-default'
      )}
      onClick={e => {
        e.stopPropagation();
        onClick?.(name, color);
      }}
    >
      <span
        aria-hidden={true}
        className={cx(
          'h-[3px] w-3.5 shrink-0 rounded-full',
          getColorClassName(color, 'bg'),
          activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100'
        )}
      />
      <p
        className={cx(
          // base
          'truncate whitespace-nowrap text-xs',
          // text color
          'text-gray-700 dark:text-gray-300',
          hasOnValueChange &&
            'group-hover:text-gray-900 dark:group-hover:text-gray-50',
          activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100'
        )}
      >
        {name}
      </p>
    </li>
  );
};

interface ScrollButtonProps {
  disabled?: boolean;
  icon: React.ElementType;
  onClick?: () => void;
}

const ScrollButton = ({disabled, icon, onClick}: ScrollButtonProps) => {
  const Icon = icon;
  const [isPressed, setIsPressed] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => {
        onClick?.();
      }, 300);
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isPressed, onClick]);

  React.useEffect(() => {
    if (disabled) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      setIsPressed(false);
    }
  }, [disabled]);

  return (
    <button
      className={cx(
        // base
        'group inline-flex size-5 items-center truncate rounded-sm transition',
        disabled
          ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
          : 'cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:border-gray-200/20 dark:hover:text-gray-50'
      )}
      disabled={disabled}
      onClick={e => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseDown={e => {
        e.stopPropagation();
        setIsPressed(true);
      }}
      onMouseUp={e => {
        e.stopPropagation();
        setIsPressed(false);
      }}
      type="button"
    >
      <Icon aria-hidden="true" className="size-full" />
    </button>
  );
};

type HasScrollProps = {
  left: boolean;
  right: boolean;
};

interface LegendProps extends React.OlHTMLAttributes<HTMLOListElement> {
  activeLegend?: string;
  categories: string[];
  colors?: AvailableChartColorsKeys[];
  enableLegendSlider?: boolean;
  onClickLegendItem?: (category: string, color: string) => void;
}

const Legend = React.forwardRef<HTMLOListElement, LegendProps>((props, ref) => {
  const {
    activeLegend,
    categories,
    className,
    colors = AvailableChartColors,
    enableLegendSlider = false,
    onClickLegendItem,
    ...other
  } = props;
  const scrollableRef = React.useRef<HTMLInputElement>(null);
  const scrollButtonsRef = React.useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = React.useState<HasScrollProps | null>(null);
  const [isKeyDowned, setIsKeyDowned] = React.useState<null | string>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const checkScroll = React.useCallback(() => {
    const scrollable = scrollableRef?.current;
    if (!scrollable) return;

    const hasLeftScroll = scrollable.scrollLeft > 0;
    const hasRightScroll =
      scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft;

    setHasScroll({left: hasLeftScroll, right: hasRightScroll});
  }, [setHasScroll]);

  const scrollToTest = React.useCallback(
    (direction: 'left' | 'right') => {
      const element = scrollableRef?.current;
      const scrollButtons = scrollButtonsRef?.current;
      const scrollButtonsWith = scrollButtons?.clientWidth ?? 0;
      const width = element?.clientWidth ?? 0;

      if (element && enableLegendSlider) {
        element.scrollTo({
          behavior: 'smooth',
          left:
            direction === 'left'
              ? element.scrollLeft - width + scrollButtonsWith
              : element.scrollLeft + width - scrollButtonsWith,
        });
        setTimeout(() => {
          checkScroll();
        }, 400);
      }
    },
    [enableLegendSlider, checkScroll]
  );

  React.useEffect(() => {
    const keyDownHandler = (key: string) => {
      if (key === 'ArrowLeft') {
        scrollToTest('left');
      } else if (key === 'ArrowRight') {
        scrollToTest('right');
      }
    };
    if (isKeyDowned) {
      keyDownHandler(isKeyDowned);
      intervalRef.current = setInterval(() => {
        keyDownHandler(isKeyDowned);
      }, 300);
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isKeyDowned, scrollToTest]);

  const keyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      setIsKeyDowned(e.key);
    }
  };
  const keyUp = (e: KeyboardEvent) => {
    e.stopPropagation();
    setIsKeyDowned(null);
  };

  React.useEffect(() => {
    const scrollable = scrollableRef?.current;
    if (enableLegendSlider) {
      checkScroll();
      scrollable?.addEventListener('keydown', keyDown);
      scrollable?.addEventListener('keyup', keyUp);
    }

    return () => {
      scrollable?.removeEventListener('keydown', keyDown);
      scrollable?.removeEventListener('keyup', keyUp);
    };
  }, [checkScroll, enableLegendSlider]);

  return (
    <ol
      className={cx('relative overflow-hidden', className)}
      ref={ref}
      {...other}
    >
      <div
        className={cx(
          'flex h-full',
          enableLegendSlider
            ? hasScroll?.right || hasScroll?.left
              ? 'snap-mandatory items-center overflow-auto pl-4 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : ''
            : 'flex-wrap'
        )}
        ref={scrollableRef}
        tabIndex={0}
      >
        {categories.map((category, index) => (
          <LegendItem
            activeLegend={activeLegend}
            color={colors[index] as AvailableChartColorsKeys}
            key={`item-${index}`}
            name={category}
            onClick={onClickLegendItem}
          />
        ))}
      </div>
      {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
        <>
          <div
            className={cx(
              // base
              'absolute bottom-0 right-0 top-0 flex h-full items-center justify-center pr-1',
              // background color
              'bg-white dark:bg-black'
            )}
          >
            <ScrollButton
              disabled={!hasScroll?.left}
              icon={RiArrowLeftSLine}
              onClick={() => {
                setIsKeyDowned(null);
                scrollToTest('left');
              }}
            />
            <ScrollButton
              disabled={!hasScroll?.right}
              icon={RiArrowRightSLine}
              onClick={() => {
                setIsKeyDowned(null);
                scrollToTest('right');
              }}
            />
          </div>
        </>
      ) : null}
    </ol>
  );
});

Legend.displayName = 'Legend';

const ChartLegend = (
  {payload}: any,
  categoryColors: Map<string, AvailableChartColorsKeys>,
  setLegendHeight: React.Dispatch<React.SetStateAction<number>>,
  activeLegend: string | undefined,
  onClick?: (category: string, color: string) => void,
  enableLegendSlider?: boolean,
  legendPosition?: 'center' | 'left' | 'right',
  yAxisWidth?: number
) => {
  const legendRef = React.useRef<HTMLDivElement>(null);

  useOnWindowResize(() => {
    const calculateHeight = (height: number | undefined) =>
      height ? Number(height) + 15 : 60;
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
  });

  const legendPayload = payload.filter((item: any) => item.type !== 'none');

  const paddingLeft =
    legendPosition === 'left' && yAxisWidth ? yAxisWidth - 8 : 0;

  return (
    <div
      className={cx(
        'flex items-center',
        {'justify-center': legendPosition === 'center'},
        {'justify-start': legendPosition === 'left'},
        {'justify-end': legendPosition === 'right'}
      )}
      ref={legendRef}
      style={{paddingLeft: paddingLeft}}
    >
      <Legend
        activeLegend={activeLegend}
        categories={legendPayload.map((entry: any) => entry.value)}
        colors={legendPayload.map((entry: any) =>
          categoryColors.get(entry.value)
        )}
        enableLegendSlider={enableLegendSlider}
        onClickLegendItem={onClick}
      />
    </div>
  );
};

//#region Tooltip

interface ChartTooltipProps {
  active: boolean | undefined;
  label: string;
  payload: PayloadItem[];
  valueFormatter: (value: number) => string;
}

type PayloadItem = {
  category: string;
  color: AvailableChartColorsKeys;
  index: string;
  payload: any;
  type?: string;
  value: number;
};

type TooltipProps = Pick<ChartTooltipProps, 'active' | 'label' | 'payload'>;

const ChartTooltip = ({
  active,
  label,
  payload,
  valueFormatter,
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={cx(
          // base
          'rounded-md border text-sm shadow-md',
          // border color
          'border-gray-200 dark:border-gray-200/20',
          // background color
          'bg-white dark:bg-black',
          'mt-16'
        )}
      >
        <div className={cx('border-b border-inherit px-4 py-2')}>
          <p
            className={cx(
              // base
              'font-medium',
              // text color
              'text-gray-900 dark:text-gray-50'
            )}
          >
            {label}
          </p>
        </div>
        <div className={cx('space-y-1 px-4 py-2')}>
          {payload.map(({category, color, value}, index) => (
            <div
              className="flex items-center justify-between space-x-8"
              key={`id-${index}`}
            >
              <div className="flex items-center space-x-2">
                <span
                  aria-hidden="true"
                  className={cx(
                    'h-[3px] w-3.5 shrink-0 rounded-full',
                    getColorClassName(color, 'bg')
                  )}
                />
                <p
                  className={cx(
                    // base
                    'whitespace-nowrap text-right',
                    // text color
                    'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {category}
                </p>
              </div>
              <p
                className={cx(
                  // base
                  'whitespace-nowrap text-right font-medium tabular-nums',
                  // text color
                  'text-gray-900 dark:text-gray-50'
                )}
              >
                {valueFormatter(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

//#region AreaChart

interface ActiveDot {
  dataKey?: string;
  index?: number;
}

type AreaChartEventProps = BaseEventProps | null | undefined;

interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  allowDecimals?: boolean;
  autoMinValue?: boolean;
  categories: string[];
  chartKey?: string;
  colors?: AvailableChartColorsKeys[];
  connectNulls?: boolean;
  customTooltip?: React.ComponentType<TooltipProps>;
  data: Record<string, any>[];
  enableLegendSlider?: boolean;
  fill?: 'gradient' | 'none' | 'solid';
  index: string;
  intervalType?: 'equidistantPreserveStart' | 'preserveStartEnd';
  legendPosition?: 'center' | 'left' | 'right';
  maxValue?: number;
  minValue?: number;
  onValueChange?: (value: AreaChartEventProps) => void;
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
  tickGap?: number;
  tooltipCallback?: (tooltipCallbackContent: TooltipProps) => void;
  type?: 'default' | 'percent' | 'stacked';
  valueFormatter?: (value: number) => string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisWidth?: number;
}

type BaseEventProps = {
  [key: string]: number | string;
  categoryClicked: string;
  eventType: 'category' | 'dot';
};

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (props, ref) => {
    const {
      allowDecimals = true,
      autoMinValue = false,
      categories = [],
      chartKey,
      className,
      colors = AvailableChartColors,
      connectNulls = false,
      customTooltip,
      data = [],
      enableLegendSlider = false,
      fill = 'gradient',
      index,
      intervalType = 'equidistantPreserveStart',
      legendPosition = 'right',
      maxValue,
      minValue,
      onValueChange,
      showGridLines = true,
      showLegend = true,
      showTooltip = true,
      showXAxis = true,
      showYAxis = true,
      startEndOnly = false,
      tickGap = 5,
      tooltipCallback,
      type = 'default',
      valueFormatter = (value: number) => value.toString(),
      xAxisLabel,
      yAxisLabel,
      yAxisWidth = 56,
      ...other
    } = props;
    const CustomTooltip = customTooltip;
    const paddingValue =
      (!showXAxis && !showYAxis) || (startEndOnly && !showYAxis) ? 0 : 20;
    const [legendHeight, setLegendHeight] = React.useState(60);
    const [activeDot, setActiveDot] = React.useState<ActiveDot | undefined>(
      undefined
    );
    const [activeLegend, setActiveLegend] = React.useState<string | undefined>(
      undefined
    );
    const categoryColors = constructCategoryColors(categories, colors);

    const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
    const hasOnValueChange = !!onValueChange;
    const stacked = type === 'stacked' || type === 'percent';
    const areaId = React.useId();

    const prevActiveRef = React.useRef<boolean | undefined>(undefined);
    const prevLabelRef = React.useRef<string | undefined>(undefined);

    const getFillContent = ({
      activeDot,
      activeLegend,
      category,
      fillType,
    }: {
      activeDot: ActiveDot | undefined;
      activeLegend: string | undefined;
      category: string;
      fillType: AreaChartProps['fill'];
    }) => {
      const stopOpacity =
        activeDot || (activeLegend && activeLegend !== category) ? 0.1 : 0.3;

      switch (fillType) {
        case 'gradient':
          return (
            <>
              <stop
                offset="5%"
                stopColor="currentColor"
                stopOpacity={stopOpacity}
              />
              <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
            </>
          );
        case 'none':
          return <stop stopColor="currentColor" stopOpacity={0} />;
        case 'solid':
        default:
          return <stop stopColor="currentColor" stopOpacity={stopOpacity} />;
      }
    };

    function valueToPercent(value: number) {
      return `${(value * 100).toFixed(0)}%`;
    }

    function onDotClick(itemData: any, event: React.MouseEvent) {
      event.stopPropagation();

      if (!hasOnValueChange) return;
      if (
        (itemData.index === activeDot?.index &&
          itemData.dataKey === activeDot?.dataKey) ||
        (hasOnlyOneValueForKey(data, itemData.dataKey) &&
          activeLegend &&
          activeLegend === itemData.dataKey)
      ) {
        setActiveLegend(undefined);
        setActiveDot(undefined);
        onValueChange?.(null);
      } else {
        setActiveLegend(itemData.dataKey);
        setActiveDot({
          dataKey: itemData.dataKey,
          index: itemData.index,
        });
        onValueChange?.({
          categoryClicked: itemData.dataKey,
          eventType: 'dot',
          ...itemData.payload,
        });
      }
    }

    function onCategoryClick(dataKey: string) {
      if (!hasOnValueChange) return;
      if (
        (dataKey === activeLegend && !activeDot) ||
        (hasOnlyOneValueForKey(data, dataKey) &&
          activeDot &&
          activeDot.dataKey === dataKey)
      ) {
        setActiveLegend(undefined);
        onValueChange?.(null);
      } else {
        setActiveLegend(dataKey);
        onValueChange?.({
          categoryClicked: dataKey,
          eventType: 'category',
        });
      }
      setActiveDot(undefined);
    }

    return (
      <div
        className={cx('h-80 w-full', className)}
        ref={ref}
        tremor-id="tremor-raw"
        {...other}
      >
        <ResponsiveContainer>
          <RechartsAreaChart
            data={data}
            margin={{
              bottom: xAxisLabel ? 30 : undefined,
              left: yAxisLabel ? 20 : undefined,
              right: yAxisLabel ? 5 : undefined,
              top: 5,
            }}
            onClick={
              hasOnValueChange && (activeLegend || activeDot)
                ? () => {
                    setActiveDot(undefined);
                    setActiveLegend(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
            stackOffset={type === 'percent' ? 'expand' : undefined}
          >
            {showGridLines ? (
              <CartesianGrid
                className={cx(
                  'stroke-gray-200 stroke-1 dark:stroke-gray-200/20'
                )}
                horizontal={true}
                vertical={false}
              />
            ) : null}
            <XAxis
              axisLine={false}
              className={cx(
                // base
                'text-xs',
                // text fill
                'fill-gray-500 dark:fill-gray-500'
              )}
              dataKey={index}
              fill=""
              hide={!showXAxis}
              interval={startEndOnly ? 'preserveStartEnd' : intervalType}
              minTickGap={tickGap}
              padding={{left: paddingValue, right: paddingValue}}
              stroke=""
              tick={{transform: 'translate(0, 6)'}}
              tickLine={false}
              ticks={
                startEndOnly
                  ? [data[0][index], data[data.length - 1][index]]
                  : undefined
              }
            >
              {xAxisLabel && (
                <Label
                  className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
                  offset={-20}
                  position="insideBottom"
                >
                  {xAxisLabel}
                </Label>
              )}
            </XAxis>
            <YAxis
              allowDecimals={allowDecimals}
              axisLine={false}
              className={cx(
                // base
                'text-xs',
                // text fill
                'fill-gray-500 dark:fill-gray-500'
              )}
              domain={yAxisDomain as AxisDomain}
              fill=""
              hide={!showYAxis}
              stroke=""
              tick={{transform: 'translate(-3, 0)'}}
              tickFormatter={
                type === 'percent' ? valueToPercent : valueFormatter
              }
              tickLine={false}
              type="number"
              width={yAxisWidth}
            >
              {yAxisLabel && (
                <Label
                  angle={-90}
                  className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
                  offset={-15}
                  position="insideLeft"
                  style={{textAnchor: 'middle'}}
                >
                  {yAxisLabel}
                </Label>
              )}
            </YAxis>
            <Tooltip
              animationDuration={100}
              content={({active, label, payload}) => {
                const cleanPayload: TooltipProps['payload'] = payload
                  ? payload.map((item: any) => ({
                      category: item.dataKey,
                      color: categoryColors.get(
                        item.dataKey
                      ) as AvailableChartColorsKeys,
                      index: item.payload[index],
                      payload: item.payload,
                      type: item.type,
                      value: item.value,
                    }))
                  : [];

                if (
                  tooltipCallback &&
                  (active !== prevActiveRef.current ||
                    label !== prevLabelRef.current)
                ) {
                  tooltipCallback({active, label, payload: cleanPayload});
                  prevActiveRef.current = active;
                  prevLabelRef.current = label;
                }

                return showTooltip && active ? (
                  CustomTooltip ? (
                    <CustomTooltip
                      active={active}
                      label={label}
                      payload={cleanPayload}
                    />
                  ) : (
                    <ChartTooltip
                      active={active}
                      label={label}
                      payload={cleanPayload}
                      valueFormatter={valueFormatter}
                    />
                  )
                ) : null;
              }}
              cursor={{stroke: '#d1d5db', strokeWidth: 1}}
              isAnimationActive={true}
              offset={20}
              position={{y: 0}}
              wrapperStyle={{outline: 'none'}}
            />

            {showLegend ? (
              <RechartsLegend
                content={({payload}) =>
                  ChartLegend(
                    {payload},
                    categoryColors,
                    setLegendHeight,
                    activeLegend,
                    hasOnValueChange
                      ? (clickedLegendItem: string) =>
                          onCategoryClick(clickedLegendItem)
                      : undefined,
                    enableLegendSlider,
                    legendPosition,
                    yAxisWidth
                  )
                }
                height={legendHeight}
                verticalAlign="top"
              />
            ) : null}
            {categories.map(category => {
              const categoryId = `${areaId}-${category.replace(/[^a-zA-Z0-9]/g, '')}`;
              return (
                <React.Fragment key={chartKey + category + 'fragment'}>
                  <defs key={chartKey + category + 'defs'}>
                    <linearGradient
                      className={cx(
                        getColorClassName(
                          categoryColors.get(
                            category
                          ) as AvailableChartColorsKeys,
                          'text'
                        )
                      )}
                      id={categoryId}
                      key={chartKey + category + 'lg'}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      {getFillContent({
                        activeDot: activeDot,
                        activeLegend: activeLegend,
                        category: category,
                        fillType: fill,
                      })}
                    </linearGradient>
                  </defs>
                  <Area
                    activeDot={(props: any) => {
                      const {
                        cx: cxCoord,
                        cy: cyCoord,
                        dataKey,
                        stroke,
                        strokeLinecap,
                        strokeLinejoin,
                        strokeWidth,
                      } = props;
                      return (
                        <Dot
                          className={cx(
                            'stroke-white dark:stroke-gray-950',
                            onValueChange ? 'cursor-pointer' : '',
                            getColorClassName(
                              categoryColors.get(
                                dataKey
                              ) as AvailableChartColorsKeys,
                              'fill'
                            )
                          )}
                          cx={cxCoord}
                          cy={cyCoord}
                          fill=""
                          onClick={(_, event) => onDotClick(props, event)}
                          r={5}
                          stroke={stroke}
                          strokeLinecap={strokeLinecap}
                          strokeLinejoin={strokeLinejoin}
                          strokeWidth={strokeWidth}
                        />
                      );
                    }}
                    className={cx(
                      getColorClassName(
                        categoryColors.get(
                          category
                        ) as AvailableChartColorsKeys,
                        'stroke'
                      )
                    )}
                    connectNulls={connectNulls}
                    dataKey={category}
                    dot={(props: any) => {
                      const {
                        cx: cxCoord,
                        cy: cyCoord,
                        dataKey,
                        index,
                        stroke,
                        strokeLinecap,
                        strokeLinejoin,
                        strokeWidth,
                      } = props;

                      if (
                        (hasOnlyOneValueForKey(data, category) &&
                          !(
                            activeDot ||
                            (activeLegend && activeLegend !== category)
                          )) ||
                        (activeDot?.index === index &&
                          activeDot?.dataKey === category)
                      ) {
                        return (
                          <Dot
                            className={cx(
                              'stroke-white dark:stroke-gray-950',
                              onValueChange ? 'cursor-pointer' : '',
                              getColorClassName(
                                categoryColors.get(
                                  dataKey
                                ) as AvailableChartColorsKeys,
                                'fill'
                              )
                            )}
                            cx={cxCoord}
                            cy={cyCoord}
                            fill=""
                            key={index}
                            r={5}
                            stroke={stroke}
                            strokeLinecap={strokeLinecap}
                            strokeLinejoin={strokeLinejoin}
                            strokeWidth={strokeWidth}
                          />
                        );
                      }
                      return <React.Fragment key={index}></React.Fragment>;
                    }}
                    fill={`url(#${categoryId})`}
                    isAnimationActive={false}
                    key={chartKey + category + 'area'}
                    name={category}
                    stackId={stacked ? 'stack' : undefined}
                    stroke=""
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity={
                      activeDot || (activeLegend && activeLegend !== category)
                        ? 0.3
                        : 1
                    }
                    strokeWidth={2}
                    type="linear"
                  />
                </React.Fragment>
              );
            })}
            {/* hidden lines to increase clickable target area */}
            {onValueChange
              ? categories.map(category => (
                  <Line
                    className={cx('cursor-pointer')}
                    connectNulls={connectNulls}
                    dataKey={category}
                    fill="transparent"
                    key={chartKey + category + 'line'}
                    legendType="none"
                    name={category}
                    onClick={(props: any, event) => {
                      event.stopPropagation();
                      const {name} = props;
                      onCategoryClick(name);
                    }}
                    stroke="transparent"
                    strokeOpacity={0}
                    strokeWidth={12}
                    tooltipType="none"
                    type="linear"
                  />
                ))
              : null}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

AreaChart.displayName = 'AreaChart';

export {AreaChart, type AreaChartEventProps, type TooltipProps};
