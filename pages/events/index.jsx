import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import EventList from '../../components/events/EventList';
import EventsSearch from '../../components/events/EventsSearch';
import { getAllEvents } from '../../helpers/api-utils';

function EventsPage(props) {
  const events = props.events;
  const router = useRouter();

  function setSearchKeys(year, month) {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }

  return (
    <Fragment>
      <Head>
        <title>All Events</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve..."
        />
      </Head>
      <EventsSearch onSearch={setSearchKeys} />
      <EventList events={events} />
    </Fragment>
  );
}

export async function getStaticProps() {
  return { props: { events: await getAllEvents() }, revalidate: 60 };
}

export default EventsPage;
