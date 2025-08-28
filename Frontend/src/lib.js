const checkAuth = async () => {
  const res = await fetch("http://localhost:5080/api/auth/verify", {
    method: "GET",
    credentials: "include", // sends the cookie
  });

  if (res.ok) {
    console.log("Ok");
    
    return true;
  } else {
    console.log("Not ok");
    
    return false;
  }
};

export { checkAuth };
