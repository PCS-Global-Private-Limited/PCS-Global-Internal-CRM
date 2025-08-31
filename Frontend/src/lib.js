const checkAuth = async () => {
  const res = await fetch("http://localhost:5080/api/auth/verify", {
    method: "GET",
    credentials: "include", // sends the cookie
  });

  if (res.ok) {
    const userDetails = await res.json();
    console.log("User details from auth check:", userDetails);
    return userDetails;
  } else {
    console.log("Not ok");
    return false;
  }
};

export { checkAuth };
