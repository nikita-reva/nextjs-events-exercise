import Head from 'next/head';
import React from 'react';
import EventList from '../components/events/EventList';
import { getFeaturedEvents } from '../helpers/api-utils';

function HomePage(props) {
  return (
    <div>
      <Head>
        <title>Next.js Events</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve..."
        />
      </Head>
      <EventList events={props.events} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      events: featuredEvents,
      revalidate: 1800,
    },
  };
}

export default HomePage;
