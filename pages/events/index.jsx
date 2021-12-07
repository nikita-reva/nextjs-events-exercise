import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import EventList from '../../components/events/EventList';
import EventsSearch from '../../components/events/EventsSearch';
import { getAllEvents } from '../../dummy-data';

function EventsPage() {
  const events = getAllEvents();
  const router = useRouter();

  function setSearchKeys(year, month) {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }

  return (
    <Fragment>
      <EventsSearch onSearch={setSearchKeys} />
      <EventList events={events} />
    </Fragment>
  );
}

export default EventsPage;
