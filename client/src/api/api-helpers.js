const url = "http://localhost:3000/";

export default {
  post: ({ path, data, callback }) => {
    fetch(`${url}${path}`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(async res => {
        // handle server errors
        if (res.status !== 200) {
          const data = await res.json();
          throw new Error(data.error);
        }

        return res.json();
      })
      .then(data => {
        callback(data);
      })
      .catch(err => console.warn("err", err));
  },
  get: ({ path, callback }) => {
    fetch(`${url}${path}`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(async res => {
        // handle server errors
        if (res.status !== 200) {
          const data = await res.json();
          throw new Error(data.error);
        }

        return res.json();
      })
      .then(({ userId }) => {
        console.log("success", userId);
      })
      .catch(err => console.warn("err", err));
  }
};
