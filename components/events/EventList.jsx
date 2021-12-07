import React from 'react';
import EventItem from './EventItem';
import classes from './EventList.module.css';

function EventList({ events }) {
  return (
    <ul className={classes.list}>
      {events.map((eventItem) => (
        <EventItem key={eventItem.id} event={eventItem} />
      ))}
    </ul>
  );
}

export default EventList;
