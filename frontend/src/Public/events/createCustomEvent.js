export const createCustomEvent =  (eventName, eventDetail) => {
    const event = new CustomEvent(eventName, { detail: eventDetail });
    window.dispatchEvent(event);
}

/* OR
export const event = new CustomEvent("refreshDataEvent", {detail: {message: "Use for refreshing profile data"}});
window.dispatchEvent(event);
*/