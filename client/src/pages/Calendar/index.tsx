import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Empty, Skeleton, Spin } from 'antd';
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';
import { hospitalService } from '@/services/hospital.service';
import { specialtyService } from '@/services/specialty.service';
import { doctorService } from '@/services/doctor.service';
import { operationService, type GlobalFollowUp } from '@/services/operation.service';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Doctor, Hospital, Specialty } from '@/types';
import { fetchCalendarOperations } from './calendarApi';
import { applyCalendarFilters, formatEventTime, formatPeriodLabel, getUpcomingHorizon, getVisibleRange, isUpcomingStatus, parseOperationDateTime, shiftPeriod, toDateParam, type CalendarFilters, type CalendarView } from './calendarUtils';
import CalendarSummary from './CalendarSummary/CalendarSummary';
import CalendarToolbar from './CalendarToolbar/CalendarToolbar';
import CalendarFiltersBar from './CalendarFilters/CalendarFilters';
import MonthView from './MonthView/MonthView';
import WeekView from './WeekView/WeekView';
import DayView from './DayView/DayView';
import AgendaView from './AgendaView/AgendaView';
import UpcomingOperations from './UpcomingOperations/UpcomingOperations';
import CalendarFollowUps from './CalendarFollowUps/CalendarFollowUps';
import './Calendar.scss';

export default function CalendarPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const [view, setView] = useState<CalendarView>('week');
  const [current, setCurrent] = useState<Dayjs>(() => dayjs());
  const [filters, setFilters] = useState<CalendarFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const visibleRange = useMemo(() => getVisibleRange(view, current, locale), [view, current, locale]);
  const upcomingRange = useMemo(() => getUpcomingHorizon(locale), [locale]);
  const dateFrom = toDateParam(visibleRange.from, 'start');
  const dateTo = toDateParam(visibleRange.to, 'end');
  const upcomingFrom = toDateParam(upcomingRange.from, 'start');
  const upcomingTo = toDateParam(upcomingRange.to, 'end');
  const serverFilters = useMemo(() => ({ status: filters.status, hospitalId: filters.hospitalId, specialtyId: filters.specialtyId }), [filters.status, filters.hospitalId, filters.specialtyId]);
  const { data: calendarOps = [], isLoading, isError, refetch, isFetching } = useQuery({ queryKey: ['calendar-operations', dateFrom, dateTo, serverFilters], queryFn: () => fetchCalendarOperations({ dateFrom, dateTo, ...serverFilters }) });
  const { data: calendarFollowUps = [], isLoading: followUpsLoading } = useQuery<GlobalFollowUp[]>({
    queryKey: ['calendar-follow-ups-events', dateFrom, dateTo],
    queryFn: async () => (await operationService.getGlobalFollowUps({ from: dateFrom, to: dateTo })).data.data ?? [],
  });
  const { data: upcomingOps = [], isLoading: upcomingLoading } = useQuery({ queryKey: ['calendar-upcoming', upcomingFrom, upcomingTo, serverFilters], queryFn: () => fetchCalendarOperations({ dateFrom: upcomingFrom, dateTo: upcomingTo, ...serverFilters }) });
  const { data: hospitalsData } = useQuery({ queryKey: ['hospitals-active'], queryFn: () => hospitalService.getActive(), staleTime: 60_000 });
  const { data: specialtiesData } = useQuery({ queryKey: ['specialties-list'], queryFn: () => specialtyService.getAll({ limit: 100 }), staleTime: 60_000 });
  const { data: doctorsData } = useQuery({ queryKey: ['doctors-active'], queryFn: () => doctorService.getActive(), staleTime: 60_000 });
  const hospitals: Hospital[] = hospitalsData?.data?.data ?? [];
  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];
  const doctors: Doctor[] = doctorsData?.data?.data ?? [];
  const operations = useMemo(() => applyCalendarFilters(calendarOps, filters), [calendarOps, filters]);
  const upcomingFiltered = useMemo(() => applyCalendarFilters(upcomingOps, filters).filter((operation) => isUpcomingStatus(operation.status)).filter((operation) => !parseOperationDateTime(operation).isBefore(dayjs().startOf('day'))).sort((a, b) => parseOperationDateTime(a).valueOf() - parseOperationDateTime(b).valueOf()), [upcomingOps, filters]);
  const summary = useMemo(() => {
    const todayKey = dayjs().format('YYYY-MM-DD'); const tomorrowKey = dayjs().add(1, 'day').format('YYYY-MM-DD'); const weekStart = dayjs().locale(locale).startOf('week'); const weekEnd = dayjs().locale(locale).endOf('week'); const source = applyCalendarFilters(upcomingOps, filters); const countOn = (key: string) => source.filter((operation) => String(operation.operationDate).slice(0, 10) === key).length; const weekCount = source.filter((operation) => { const date = dayjs(String(operation.operationDate).slice(0, 10)); return !date.isBefore(weekStart, 'day') && !date.isAfter(weekEnd, 'day'); }).length; const next = upcomingFiltered.find((operation) => !parseOperationDateTime(operation).isBefore(dayjs(), 'minute')); let nextLabel = t('calendar.none'); if (next) { const at = parseOperationDateTime(next); const minutes = at.diff(dayjs(), 'minute'); if (minutes <= 0) nextLabel = formatEventTime(next); else if (minutes < 60) nextLabel = t('calendar.inMinutes', { count: minutes }); else nextLabel = t('calendar.inHours', { hours: Math.floor(minutes / 60), minutes: minutes % 60 }); } return { todayCount: countOn(todayKey), tomorrowCount: countOn(tomorrowKey), weekCount, nextLabel };
  }, [upcomingOps, filters, upcomingFiltered, t, locale]);
  const hasFilters = Boolean(filters.status || filters.hospitalId || filters.specialtyId || filters.doctorId);
  const periodLabel = formatPeriodLabel(view, current, locale);
  const goCreate = () => navigate('/operations/new');

  if (isError) return <div className="calendar-page page"><div className="pageHeader"><div className="pageHeaderLeft"><div className="pageIcon"><CalendarOutlined /></div><div className="pageHeaderText"><h1 className="pageTitle">{t('calendar.title')}</h1><p className="pageHint">{t('calendar.subtitle')}</p></div></div></div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.operationFailed')}><Button type="primary" onClick={() => refetch()}>{t('common.refresh')}</Button></Empty></div>;

  return (
    <div className="calendar-page page">
      <div className="pageHeader"><div className="pageHeaderLeft"><div className="pageIcon"><CalendarOutlined /></div><div className="pageHeaderText"><h1 className="pageTitle">{t('calendar.title')}</h1><p className="pageHint">{t('calendar.subtitle')}</p></div></div><Button type="primary" icon={<PlusOutlined />} onClick={goCreate}>{t('calendar.newOperation')}</Button></div>
      <CalendarSummary todayCount={summary.todayCount} tomorrowCount={summary.tomorrowCount} weekCount={summary.weekCount} nextOperationLabel={summary.nextLabel} loading={upcomingLoading} />
      <div className="calendarShell">
        <div className="calendarMain">
          <CalendarToolbar view={view} periodLabel={periodLabel} hasFilters={hasFilters} onViewChange={setView} onPrevious={() => setCurrent((value) => shiftPeriod(view, value, -1))} onNext={() => setCurrent((value) => shiftPeriod(view, value, 1))} onToday={() => setCurrent(dayjs())} showMobileFilters={isMobile} onOpenFilters={() => setFiltersOpen(true)} />
          {!isMobile ? <CalendarFiltersBar filters={filters} hospitals={hospitals} specialties={specialties} doctors={doctors} onChange={setFilters} onClear={() => setFilters({})} /> : null}
          <Spin spinning={isLoading || isFetching || followUpsLoading}>
            {isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : view === 'week' ? <WeekView current={current} operations={operations} followUps={calendarFollowUps} onCreate={goCreate} /> : view === 'day' ? <DayView current={current} operations={operations} followUps={calendarFollowUps} onCreate={goCreate} /> : view === 'agenda' ? <AgendaView operations={operations} onCreate={goCreate} /> : <MonthView current={current} operations={operations} onChange={setCurrent} onShowDay={(value) => { setCurrent(value); setView('day'); }} onCreate={goCreate} />}
          </Spin>
        </div>
        <div className="calendarSidePanel"><UpcomingOperations operations={upcomingFiltered} loading={upcomingLoading} /><CalendarFollowUps from={visibleRange.from} to={visibleRange.to} /></div>
      </div>
      <Drawer title={t('calendar.filters')} open={filtersOpen} onClose={() => setFiltersOpen(false)} placement="bottom" height="auto"><CalendarFiltersBar filters={filters} hospitals={hospitals} specialties={specialties} doctors={doctors} onChange={setFilters} onClear={() => setFilters({})} /></Drawer>
    </div>
  );
}
