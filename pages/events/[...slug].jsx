import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';

import EventList from '../../components/events/EventList';
import ResultsTitle from '../../components/events/ResultsTitle';
import Button from '../../components/ui/Button';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { getFilteredEvents } from '../../helpers/api-utils';

function FilteredEventsPage(props) {
  // With SSR
  // const filteredEvents = props.events;

  // if (props.hasError) {
  //   return (
  //     <Fragment>
  //       <ErrorAlert>
  //         <p>Invalid filter. Please adjust your values.</p>
  //       </ErrorAlert>
  //       <div className="center">
  //         <Button link="/events">Show All Elements</Button>
  //       </div>
  //     </Fragment>
  //   );
  // }

  // if (!filteredEvents || filteredEvents.length === 0) {
  //   return (
  //     <Fragment>
  //       <ErrorAlert>
  //         <p>No events found for the chosen filter!</p>
  //       </ErrorAlert>
  //       <div className="center">
  //         <Button link="/events">Show All Elements</Button>
  //       </div>
  //     </Fragment>
  //   );
  // }

  // const date = new Date(props.date.year, props.date.month - 1);

  // return (
  //   <Fragment>
  //     <ResultsTitle date={date} />
  //     <EventList events={filteredEvents} />
  //   </Fragment>
  // );

  // With CSR
  const [loadedEvents, setLoadedEvents] = useState();
  const router = useRouter();

  const filterData = router.query.slug;

  const { data, error } = useSWR(
    'https://nextjs-events-exercitse-default-rtdb.europe-west1.firebasedatabase.app/events.json',
    (url) => fetch(url).then((response) => response.json())
  );

  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }

      setLoadedEvents(events);
    }
  }, [data]);

  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content={`A list of filtered events`} />
    </Head>
  );

  if (!loadedEvents) {
    return (
      <Fragment>
        {pageHeadData}
        <p className="center">Loading...</p>
      </Fragment>
    );
  }

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All Events for ${numMonth}/${numYear}`}
      />
    </Head>
  );

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12 ||
    error
  ) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList events={filteredEvents} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const { params } = context;

//   const filterData = params.slug;

//   const filteredYear = filterData[0];
//   const filteredMonth = filterData[1];

//   const numYear = +filteredYear;
//   const numMonth = +filteredMonth;

//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2030 ||
//     numYear < 2021 ||
//     numMonth < 1 ||
//     numMonth > 12
//   ) {
//     return {
//       // notFound: true,
//       // redirect: {
//       //   destination: '/error',
//       // },
//       props: {
//         hasError: true,
//       },
//     };
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth,
//   });

//   return {
//     props: {
//       date: { year: numYear, month: numMonth },
//       events: filteredEvents,
//       hasError: false,
//     },
//   };
// }

export default FilteredEventsPage;
