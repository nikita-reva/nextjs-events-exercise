import React, { Fragment } from 'react';
import Head from 'next/head';

import EventSummary from '../../components/event-detail/EventSummary';
import EventLogistics from '../../components/event-detail/EventLogistics';
import EventContent from '../../components/event-detail/EventContent';
import { getEventById, getFeaturedEvents } from '../../helpers/api-utils';
import Comments from '../../components/input/Comments';

function EventDetailPage(props) {
  const event = props.event;

  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics event={event} />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
      <Comments eventId={event.id} />
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;

  const selectedEvent = await getEventById(eventId);

  if (!selectedEvent) {
    return { notFound: true };
  }

  return {
    props: {
      event: selectedEvent,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const allEvents = await getFeaturedEvents();

  const paths = allEvents.map((event) => ({ params: { eventId: event.id } }));

  return { paths: paths, fallback: 'blocking' };
}

export default EventDetailPage;
