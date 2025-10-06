export const postTrackEvent = (event) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  }).then((res) => res.json());

export const getTotalViews = (postId) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/evens/totalViews/${postId}`).then(
    (res) => res.json(),
  );

export const getDailyViews = (postId) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/evens/dailyViews/${postId}`).then(
    (res) => res.json(),
  );

export const getDailyDurations = (postId) =>
  fetch(
    `${import.meta.env.VITE_BACKEND_URL}/evens/dailyDurations/${postId}`,
  ).then((res) => res.json());
