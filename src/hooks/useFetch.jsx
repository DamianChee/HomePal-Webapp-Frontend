const useFetch = () => {
  const fetchData = async (endpoint, method, body, token = 0) => {
    const text = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
    console.log(`[useFetch] ${text}`);
    const res = await fetch(process.env.REACT_APP_BACKEND_DOMAIN + endpoint, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });
    const data = await res.text();

    let returnValue = {};
    if (res.ok) {
      if (data.status === "error") {
        returnValue = { ok: false, data: data.message };
      } else {
        returnValue = { ok: true, data };
      }
    } else {
      if (data?.errors && Array.isArray(data.errors)) {
        const messages = data.errors.map((item) => item.msg);
        returnValue = { ok: false, data: messages };
      } else if (data?.status === "error") {
        returnValue = { ok: false, data: data.message || data.msg };
      } else {
        console.log(data);
        returnValue = { ok: false, data: "An error has occurred" };
      }
    }

    return returnValue;
  };

  return fetchData;
};

export default useFetch;
