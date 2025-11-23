import axios from "axios";
const server = "http://localhost:9034";


const getCookie = (name) =>{
  const value = `;${document.cookie}`;
  const parts = value.split(`; ${name}=`)
  if(parts.length ===2) return parts.pop().split(";").shift();
}

//instence of axios
const api = axios.create({
  baseURL: server,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) =>{
    if(config.method === "post" || config.method === "put" || config.method === "delete"){
      const csrfToken = getCookie("csrfToken");
      console.log("csrfToken: ",csrfToken);
      console.log("setting csrf header")
      if(csrfToken){
        config.headers["x-csrf-token"] = csrfToken;
      }
    }
    return config;
  },(error)=>{
    return Promise.reject(error);
  }
)

//helpers
let isRefreshing = false;
let isRefreshingCSRF = false;
let failedQueue = []; //failed requests
let csrfFailedQueue = [];


const processCSRFQueue = (error, token = null) => {
  console.log("csrf queue resolving")
  csrfFailedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  csrfFailedQueue = [];
}; 


const processQueue = (error, token = null) => {
  console.log("processQueue resolving");
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("checking original request error code 403 if had")

    if (error.response?.status === 403 && !originalRequest._retry) {
      console.log("error found 403");
      const errorCode = error.response?.data?.code ;
      if(!errorCode){
        console.log("errorcode is empty")
      } 
     console.log("error code :", errorCode)




      if ( errorCode && errorCode.startsWith("CSRF_")){
        console.log("csrf error code found")

        if(isRefreshingCSRF){
          console.log("pushing request to csrfFailed queue")
           return new Promise((resolve, reject) => {
             csrfFailedQueue.push({ resolve, reject });
           }).then(() => {
             return api(originalRequest);
           }); 
        }
        originalRequest._retry = true;
        isRefreshingCSRF = true;
        try {
          console.log("refreshing csrf token then processing csrf failed queue")
          await api.post("api/v1/refresh-csrf");
          processCSRFQueue(null);
        } catch (error) {
          processCSRFQueue(error)
          console.error("Failed to refresh csrf token",error);
          return Promise.reject(error)
        }
        finally{
          isRefreshingCSRF = false;
        }
      }



      if (isRefreshing) {
        console.log("pushing request to failed queue")
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {return api(originalRequest);}); 
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("refreshing accesstoken then processing failed request");
        await api.post("/api/v1/refresh");
        processQueue(null)
        return api(originalRequest) 
      } catch (error) {
        processQueue(error, null)
        return Promise.reject(error)
      }
      finally{
      isRefreshing = false;
      }
    }
      return Promise.reject(error);
  }
);

export default api;
